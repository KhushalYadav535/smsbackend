const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Get current user's profile
router.get('/profile', authMiddleware, userController.getProfile);
// Update current user's profile
router.put('/profile', authMiddleware, userController.updateProfile);
// Change current user's password
router.post('/change-password', authMiddleware, userController.changePassword);
// Get user dashboard stats
router.get('/dashboard', authMiddleware, userController.getUserDashboardStats);
// Get admin dashboard stats
router.get('/admin/dashboard', authMiddleware, userController.getAdminDashboardStats);

module.exports = router;
