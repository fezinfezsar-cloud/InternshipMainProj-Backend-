const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validateEvent } = require('../validators/eventValidator');

// Public Event Routes
router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);

// Registered User Action Routes
router.post('/:id/register', authMiddleware, registrationController.register);

// Organizer / Administrator Management Routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ORGANIZER', 'ADMIN', 'SUPER_ADMIN']),
  upload.single('banner'),
  validateEvent,
  eventController.create
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('banner'),
  eventController.update
);

router.delete(
  '/:id',
  authMiddleware,
  eventController.delete
);

router.get(
  '/:id/participants',
  authMiddleware,
  registrationController.getParticipants
);

router.post(
  '/:id/checkin',
  authMiddleware,
  registrationController.checkIn
);

module.exports = router;
