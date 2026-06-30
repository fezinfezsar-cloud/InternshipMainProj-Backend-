const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Secure all profile routes
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', upload.single('profile_image'), userController.updateProfile);

module.exports = router;
