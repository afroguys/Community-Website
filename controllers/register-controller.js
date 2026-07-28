const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const imageService = require('../services/img-service');
const crypto = require('crypto');
const adminModel = require('../models/admin-model');

class RegisterController {
    // Step 1: Register with email + societyCode + houseNo (no OTP)
    async sendOtp(req, res) {
        const { email, societyCode, houseNo } = req.body.data;
        const codes = await adminModel.findOne({}, { societyCode: 1, _id: 0 });
        
        if (societyCode !== codes.societyCode) {
            return res.json({ message: 'Invalid society Code', next: false });
        }
        if (houseNo > 250) {
            return res.json({ message: 'enter valid houseno', next: false });
        }
        
        const euser = await userService.findUser({ email });
        const huser = await userService.findUser({ houseNo });
        if (euser || huser) {
            return res.json({ message: 'Already register', next: false });
        }

        // Create user immediately with pending status
        try {
            const user = await userService.createUser({ email, houseNo });
            const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: false });
            await tokenService.storeRefershToken(refreshToken, user._id);
            
            res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
            res.cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
            
            return res.json({
                hash: `${email}.${houseNo}`,
                email, houseNo, societyCode,
                next: true,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Registration failed', next: false });
        }
    }

    // Step 2: Verify - simplified (no OTP check)
    async verifyOtp(req, res) {
        return res.json({ auth: true });
    }

    // Step 3: Activate - save user details, status = pending
    async activate(req, res) {
        const { userData, profileImg } = req.body;
        const folderPath = `users/${crypto.randomBytes(5).toString('hex')}`;
        const imgPath = await imageService.storeImg(profileImg, folderPath);
        
        if (imgPath.next === false) {
            return res.json({ imgPath });
        }

        const userId = req.user._id;
        userData.password = await hashService.hashData(userData.password);
        userData.profileImg = imgPath;
        userData.activated = true;
        userData.approved = false;  // Awaiting admin approval
        userData.imgFolder = folderPath;
        userData.publicUrl = crypto.randomBytes(5).toString('hex');

        try {
            const user = await userService.findByIdAndUpdate(userId, userData);
            return res.json({ auth: true, activate: true, approved: false });
        } catch (err) {
            console.log(err);
            return res.json({ message: 'something went wrong!', next: false });
        }
    }
}

module.exports = new RegisterController();
