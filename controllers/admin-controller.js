const adminService = require('../services/admin-service');
const adminModel = require('../models/admin-model');
const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const imageService = require('../services/img-service');
const userModel = require('../models/user-model');
const galleryModel = require('../models/gallery-model');
const ruleModel = require('../models/rule-model');
const tokenService = require('../services/token-service');
const refreshModel = require('../models/refresh-model');
const crypto = require('crypto');

class AdminController {
    async verifyAdmin(req, res) {
        try {
            const { name, email, adminCode } = req.body.data;
            const valid = await adminModel.find({});
            if (valid.length >= 1) return res.json({ next: false, message: 'Already have admin!' });
            const emailAvailable = await userModel.findOne({ email });
            if (emailAvailable) return res.json({ next: false, message: 'please use another email' });

            const otp = await otpService.sendOtpByGmail(email);
            const ttl = 1000 * 60 * 2;
            const expires = Date.now() + ttl;
            const data = `${email}.${otp}.${expires}`;
            const hash = await hashService.hashData(data);
            res.json({ name, email, adminCode, hash: `${hash}.${expires}` });
        } catch (err) {
            console.log(err);
            res.json({ next: false, message: 'something went wrong!' });
        }
    }

    async registerAdmin(req, res) {
        try {
            const { name, email, otp, img, hash, password, adminCode } = req.body.data;
            const [hashedOtp, expires] = hash.split('.');
            if (Date.now() > +expires) return res.json({ message: 'OTP expired!', next: false });

            const data = `${email}.${otp}.${expires}`;
            const isValid = await otpService.verifyOtp(hashedOtp, data);
            if (!isValid) return res.json({ message: 'Invalid OTP', next: false });

            const imgResponse = await imageService.storeImg(img, 'admin');
            const adminData = await adminModel.create({
                name, email, password: hashService.hashData(password),
                adminCode, img: imgResponse, tokens: [],
            });
            return res.json({ adminData, next: true });
        } catch (err) {
            console.log(err);
            return res.json({ next: false, message: 'something went wrong' });
        }
    }

    async logoutAdmin(req, res) {
        try {
            res.cookie('accessToken', '', { maxAge: 1, httpOnly: true });
            res.json({ done: true });
        } catch (err) {
            console.log(err);
        }
    }

    async deleteUser(req, res) {
        try {
            const { userId } = req.body;
            await userModel.findByIdAndDelete(userId);
            res.json({ deleted: true });
        } catch (err) {
            console.log(err);
        }
    }

    // === PENDING USERS (admin approval) ===
    async getPendingUsers(req, res) {
        try {
            const users = await userModel.find({ activated: true, approved: false });
            res.json({ users });
        } catch (err) {
            console.log(err);
            res.json({ users: [] });
        }
    }

    async approveUser(req, res) {
        try {
            const { userId } = req.body;
            await userModel.findByIdAndUpdate(userId, { approved: true });
            res.json({ done: true });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }

    async rejectUser(req, res) {
        try {
            const { userId } = req.body;
            await userModel.findByIdAndDelete(userId);
            res.json({ done: true });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }

    // === GET ALL USERS (for admin) ===
    async getAllUsers(req, res) {
        try {
            const users = await userModel.find({ activated: true });
            res.json({ users });
        } catch (err) {
            console.log(err);
            res.json({ users: [] });
        }
    }

    // === GALLERY MANAGEMENT ===
    async addGalleryImage(req, res) {
        try {
            const { title, image, category } = req.body;
            const folderPath = `gallery/${crypto.randomBytes(4).toString('hex')}`;
            const imgPath = await imageService.storeImg(image, folderPath);
            if (imgPath.next === false) return res.json({ done: false, message: 'Upload failed' });

            await galleryModel.create({ title, image: imgPath, category: category || 'gallery' });
            res.json({ done: true });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }

    async deleteGalleryImage(req, res) {
        try {
            const { id } = req.body;
            await galleryModel.findByIdAndDelete(id);
            res.json({ done: true });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }

    async getGalleryImages(req, res) {
        try {
            const { category } = req.query;
            const filter = category ? { category } : {};
            const images = await galleryModel.find(filter).sort({ createdAt: -1 });
            res.json({ images });
        } catch (err) {
            console.log(err);
            res.json({ images: [] });
        }
    }

    // === RULES MANAGEMENT ===
    async addRule(req, res) {
        try {
            const { title, description } = req.body;
            if (!title || !description) return res.json({ done: false, message: 'Title and description required' });
            
            const count = await ruleModel.countDocuments();
            if (count >= 10) return res.json({ done: false, message: 'Maximum 10 rules allowed' });
            if (description.length > 200) return res.json({ done: false, message: 'Description max 200 characters' });

            const rule = await ruleModel.create({ title, description, sort_order: count });
            res.json({ done: true, rule });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }

    async updateRule(req, res) {
        try {
            const { id, title, description } = req.body;
            if (description && description.length > 200) return res.json({ done: false, message: 'Description max 200 characters' });
            const update = {};
            if (title) update.title = title;
            if (description) update.description = description;
            await ruleModel.findByIdAndUpdate(id, update);
            res.json({ done: true });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }

    async deleteRule(req, res) {
        try {
            const { id } = req.body;
            await ruleModel.findByIdAndDelete(id);
            res.json({ done: true });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }

    async getRules(req, res) {
        try {
            const rules = await ruleModel.find().sort({ sort_order: 1 });
            res.json({ rules });
        } catch (err) {
            console.log(err);
            res.json({ rules: [] });
        }
    }

    // === ANNOUNCEMENTS ===
    async addAnnouncement(req, res) {
        try {
            const { title, content } = req.body;
            if (!title || !content) return res.json({ done: false, message: 'Title & content required' });
            await (require('../models/announcement-model')).create({ title, content });
            res.json({ done: true });
        } catch (err) { console.log(err); res.json({ done: false }); }
    }
    async getAnnouncements(req, res) {
        try {
            const list = await (require('../models/announcement-model')).find().sort({ createdAt: -1 });
            res.json({ announcements: list });
        } catch (err) { console.log(err); res.json({ announcements: [] }); }
    }
    async deleteAnnouncement(req, res) {
        try {
            await (require('../models/announcement-model')).findByIdAndDelete(req.body.id);
            res.json({ done: true });
        } catch (err) { console.log(err); res.json({ done: false }); }
    }

    // PUBLIC: Get site settings (no auth)
    async getPublicSettings(req, res) {
        try {
            const admin = await adminModel.findOne({});
            if (!admin) return res.json({});
            res.json({
                nama_persatuan: admin.nama_persatuan || '',
                nama_taman: admin.nama_taman || '',
                moto: admin.moto || '',
                logo_img: admin.logo_img || '',
                icon_img: admin.icon_img || '',
                contact_email: admin.contact_email || '',
                contact_address: admin.contact_address || '',
                main_photo_1: admin.main_photo_1 || '',
                main_photo_2: admin.main_photo_2 || '',
            });
        } catch (err) {
            console.log(err);
            res.json({});
        }
    }

    // === ADMIN DATA OPERATIONS ===
    async adminDataOperation(req, res) {
        try {
            const { operationName, fieldName, dbData } = req.body.data || req.body;
            const admin = await adminModel.findOne({});
            if (!admin) return res.json({ done: false });

            // GET operation
            if (operationName === 'get') {
                return res.json(admin[fieldName] || []);
            }

            // CREATE operation
            if (operationName === 'create') {
                admin[fieldName] = admin[fieldName] || [];
                admin[fieldName].push(dbData);
                await admin.save();
                return res.json({ done: true });
            }

            // UPDATE operation
            if (operationName === 'update') {
                const { index, data } = dbData;
                if (index !== undefined && admin[fieldName] && admin[fieldName][index] !== undefined) {
                    Object.assign(admin[fieldName][index], data);
                    await admin.save();
                    return res.json({ done: true });
                }
                return res.json({ done: false, message: 'Item not found' });
            }

            // DELETE operation
            if (operationName === 'delete') {
                admin[fieldName] = (admin[fieldName] || []).filter(
                    (item, i) => i !== dbData.index
                );
                await admin.save();
                return res.json({ done: true });
            }

            // Legacy type-based operations
            const { type, data } = req.body.data || req.body;
            if (type === 'addEvent') {
                admin.events = admin.events || [];
                admin.events.push(data);
            } else if (type === 'deleteEvent') {
                admin.events = (admin.events || []).filter((_, i) => i !== data.index);
            } else if (type === 'addManagement') {
                admin.management = admin.management || [];
                admin.management.push(data);
            } else if (type === 'deleteManagement') {
                admin.management = (admin.management || []).filter((_, i) => i !== data.index);
            } else if (type === 'addComplaine') {
                admin.complaines = admin.complaines || [];
                admin.complaines.push(data);
            } else if (type === 'addContact') {
                admin.contacts = admin.contacts || [];
                admin.contacts.push(data);
            } else if (type === 'deleteContact') {
                admin.contacts = (admin.contacts || []).filter((_, i) => i !== data.index);
            } else if (type === 'update') {
                Object.assign(admin, data);
            }
            await admin.save();
            res.json({ done: true });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }

    async adminSetting(req, res) {
        try {
            const saveData = req.body.adminHomePageData || req.body.data;
            const admin = await adminModel.findOne({});
            if (!admin) return res.json({ done: false });

            if (saveData && typeof saveData === 'object') {
                // Handle image uploads - convert base64 to file paths
                const imgFields = ['logo_img', 'icon_img', 'main_photo_1', 'main_photo_2'];
                for (const field of imgFields) {
                    if (saveData[field] && typeof saveData[field] === 'string' && saveData[field].startsWith('data:')) {
                        const folderPath = `settings/${field}`;
                        const result = await imageService.storeImg(saveData[field], folderPath);
                        if (result && typeof result === 'string') {
                            saveData[field] = result;
                        }
                    }
                    // Don't overwrite existing value with empty string
                    if (!saveData[field]) {
                        delete saveData[field];
                    }
                }
                // Also handle non-image non-edited fields
                const keepFields = ['nama_taman','nama_persatuan','moto','contact_email','contact_address',
                    'societyCode','adminCode','name'];
                for (const field of keepFields) {
                    if (saveData[field] === undefined || saveData[field] === null) {
                        delete saveData[field];
                    }
                }
                Object.assign(admin, saveData);
                await admin.save();
                return res.json({ done: true });
            }

            // No data provided = GET admin info
            return res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                img: admin.img || '/images/icons/logo.png',
                societyCode: admin.societyCode,
                adminCode: admin.adminCode || '',
                nama_persatuan: admin.nama_persatuan || '',
                nama_taman: admin.nama_taman || '',
                moto: admin.moto || '',
                logo_img: admin.logo_img || '',
                icon_img: admin.icon_img || '',
                contact_email: admin.contact_email || '',
                contact_address: admin.contact_address || '',
                main_photo_1: admin.main_photo_1 || '',
                main_photo_2: admin.main_photo_2 || '',
            });
        } catch (err) {
            console.log(err);
            res.json({ done: false });
        }
    }
}

module.exports = new AdminController();
