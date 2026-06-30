const registrationService = require('../services/registrationService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class RegistrationController {
  async register(req, res, next) {
    try {
      const { id: eventId } = req.params;
      const registration = await registrationService.registerForEvent(req.user.id, eventId);
      return sendSuccess(res, registration, 'Successfully registered for this event.', 201);
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  async getParticipants(req, res, next) {
    try {
      const { id: eventId } = req.params;
      const participants = await registrationService.getParticipants(eventId, req.user);
      return sendSuccess(res, participants, 'Participants list retrieved successfully.');
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  async getMyRegistrations(req, res, next) {
    try {
      const registrations = await registrationService.getRegistrationsByUserId(req.user.id);
      return sendSuccess(res, registrations, 'My registrations fetched successfully.');
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  async checkIn(req, res, next) {
    try {
      const { id: eventId } = req.params;
      const { user_id: participantUserId } = req.body;

      if (!participantUserId) {
        return sendError(res, 'user_id parameter is required to check in.', 400);
      }

      const updatedReg = await registrationService.checkInParticipant(eventId, participantUserId, req.user);
      return sendSuccess(res, updatedReg, 'Attendee checked in successfully.');
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }
}

module.exports = new RegistrationController();
