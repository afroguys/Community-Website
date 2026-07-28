const router = require('express').Router();

//controllers
const registerController = require("./controllers/register-controller");
const authController = require('./controllers/auth-controller');
const adminController = require('./controllers/admin-controller');
const publicController = require('./controllers/public-controller');

//middlewares
const authMiddleware = require('./middlewares/auth-middleware');
const adminLoginMiddleware= require('./middlewares/login-admin-middleware');

//user routes
router.post('/api/send-otp', registerController.sendOtp);
router.post('/api/verify-otp',registerController.verifyOtp);
router.post('/api/activate',authMiddleware,registerController.activate);
router.get('/api/refresh',authController.refresh);
router.post('/api/login',adminLoginMiddleware,authController.login);
router.post('/api/logout',authController.logout);
router.post('/api/updateUser',authMiddleware,authController.updateUser);
router.post('/api/forgotPassword/verifyUser',authController.verifyUser);
router.post('/api/forgotPassword/changePassword',authController.changePassword);
router.post('/api/userOperations',authMiddleware,authController.userOperations);

//public routes
router.get('/api/getAdvertise',publicController.getAdvertise);
router.get('/api/getMembers',publicController.getMembers);
router.post('/api/getMemberProfile',publicController.getMemberProfile);
router.get('/api/gethomePageData',publicController.getHomePageData);

//Admin routes
router.post('/api/registerAdmin',adminController.registerAdmin);
router.post('/api/verifyAdmin',adminController.verifyAdmin);
router.post('/api/logoutAdmin',adminController.logoutAdmin);
router.post('/api/deleteUser',authMiddleware,adminController.deleteUser);
router.post('/api/adminDataOperation',authMiddleware,adminController.adminDataOperation);
router.post('/api/adminSetting',authMiddleware,adminController.adminSetting);

// === NEW ADMIN ENDPOINTS ===
router.get('/api/admin/getPendingUsers',authMiddleware,adminController.getPendingUsers);
router.post('/api/admin/approveUser',authMiddleware,adminController.approveUser);
router.post('/api/admin/rejectUser',authMiddleware,adminController.rejectUser);
router.get('/api/admin/getAllUsers',authMiddleware,adminController.getAllUsers);

// Gallery (admin)
router.post('/api/admin/addGalleryImage',authMiddleware,adminController.addGalleryImage);
router.post('/api/admin/deleteGalleryImage',authMiddleware,adminController.deleteGalleryImage);

// Rules (admin)
router.post('/api/admin/addRule',authMiddleware,adminController.addRule);
router.post('/api/admin/updateRule',authMiddleware,adminController.updateRule);
router.post('/api/admin/deleteRule',authMiddleware,adminController.deleteRule);

// === ANNOUNCEMENT ROUTES ===
router.post('/api/admin/addAnnouncement', adminController.addAnnouncement);
router.get('/api/public/announcements', adminController.getAnnouncements);
router.post('/api/admin/deleteAnnouncement', adminController.deleteAnnouncement);

// === PUBLIC ROUTES ===
router.get('/api/public/getGalleryImages',adminController.getGalleryImages);
router.get('/api/public/getRules',adminController.getRules);
router.get('/api/public/settings', adminController.getPublicSettings);

module.exports = router;