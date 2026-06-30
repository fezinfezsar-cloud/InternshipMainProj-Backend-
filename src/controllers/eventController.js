const eventService = require('../services/eventService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class EventController {
  async create(req, res, next) {
    try {
      const eventData = {
        title: req.body.title,
        description: req.body.description,
        venue: req.body.venue,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        max_participants: parseInt(req.body.max_participants),
        registration_deadline: req.body.registration_deadline,
        status: req.body.status || 'UPCOMING',
        created_by: req.user.id
      };

      const event = await eventService.createEvent(eventData, req.file);
      return sendSuccess(res, event, 'Event created successfully', 201);
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        venue: req.body.venue,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        max_participants: req.body.max_participants ? parseInt(req.body.max_participants) : undefined,
        registration_deadline: req.body.registration_deadline,
        status: req.body.status
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

      const event = await eventService.updateEvent(id, updateData, req.file, req.user);
      return sendSuccess(res, event, 'Event updated successfully');
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await eventService.deleteEvent(id, req.user);
      return sendSuccess(res, null, 'Event deleted successfully');
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      return sendSuccess(res, event, 'Event retrieved successfully');
    } catch (error) {
      return sendError(res, error.message, 404);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        status: req.query.status,
        created_by: req.query.created_by,
        upcoming: req.query.upcoming
      };

      const events = await eventService.getAllEvents(filters);
      return sendSuccess(res, events, 'Events retrieved successfully');
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }
}

module.exports = new EventController();
