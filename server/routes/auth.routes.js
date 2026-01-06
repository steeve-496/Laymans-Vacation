const express = require('express');
const router = express.Router();
const { loginAdmin, logoutAdmin, getMe, seedAdmin, createAdmin, getAdmins, updateAdmin, deleteAdmin } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', protect, getMe);
router.post('/seed', seedAdmin); // Use this to create the FIRST admin
router.post('/register', protect, createAdmin);
router.get('/list', protect, getAdmins);
router.put('/update/:id', protect, updateAdmin);
router.delete('/delete/:id', protect, deleteAdmin);
router.post('/forgot-password', require('../controllers/auth.controller').forgotPassword);
router.post('/reset-password', require('../controllers/auth.controller').resetPassword);

module.exports = router;
