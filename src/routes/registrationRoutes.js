const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');

// Secure all registration routes
router.use(authMiddleware);

// GET /api/registrations/my
router.get('/my', registrationController.getMyRegistrations);

module.exports = router;
