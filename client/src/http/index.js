import axios from 'axios';

const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
});

// List of all the endpoints

//on page refresh endpoints
export const refresh = ()=>api.get('/api/refresh');

//user endpoints
export const sendOtp = (data) => api.post('/api/send-otp', data);
export const verifyOtp = (data) => api.post('/api/verify-otp', data);
export const activate = (data) => api.post('/api/activate', data);
export const login = (data)=>api.post('/api/login',data);
export const logout = () => api.post('/api/logout');
export const forgotPassword = (data) => api.post('/api/forgotPassword/verifyUser',data);
export const changePassword = (data) => api.post('/api/forgotPassword/changePassword',data);
export const updateUser = (data)=> api.post('/api/updateUser',data);
export const userOperations = (data)=>api.post('/api/userOperations',data);
export const adminSetting = (data)=>api.post('/api/adminSetting',data);

// === NEW ADMIN ENDPOINTS ===
export const getPendingUsers = () => api.get('/api/admin/getPendingUsers');
export const approveUser = (data) => api.post('/api/admin/approveUser',data);
export const rejectUser = (data) => api.post('/api/admin/rejectUser',data);
export const getAllUsers = () => api.get('/api/admin/getAllUsers');
export const addGalleryImage = (data) => api.post('/api/admin/addGalleryImage',data);
export const deleteGalleryImage = (data) => api.post('/api/admin/deleteGalleryImage',data);
export const addRule = (data) => api.post('/api/admin/addRule',data);
export const updateRule = (data) => api.post('/api/admin/updateRule',data);
export const deleteRule = (data) => api.post('/api/admin/deleteRule',data);
export const getGalleryImages = (params) => api.get('/api/public/getGalleryImages',{params});
export const getRules = () => api.get('/api/public/getRules');

//public endpoints
export const contactForm = (data) => api.post('/api/contactForm',data);
export const getAdvertise =(data)=>api.get('/api/getAdvertise',data);
export const getMembers = (data)=>api.get('/api/getMembers',data);
export const getProfile = (data)=>api.post('/api/getMemberProfile',data);
export const getHomePageData = (data)=>api.get('/api/getHomePageData',data);
export const getSiteSettings = () => api.get('/api/public/settings');

//Admin endpoints
export const verifyAdmin = (data)=>api.post('/api/verifyAdmin',data);
export const registerAdmin = (data)=>api.post('/api/registerAdmin',data);
export const logoutAdmin =(data)=>api.post('/api/logoutAdmin',data);
export const deleteUser=(data)=>api.post('/api/deleteUser',data);
export const adminDataOperation = (data)=>api.post('/api/adminDataOperation',data);
