const { sendError } = require('../utils/responseHandler');

const validateEvent = (req, res, next) => {
  const { title, description, venue, start_date, end_date, max_participants, registration_deadline } = req.body;
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  }
  if (!description || description.trim() === '') {
    errors.push({ field: 'description', message: 'Description is required' });
  }
  if (!venue || venue.trim() === '') {
    errors.push({ field: 'venue', message: 'Venue is required' });
  }
  
  const parsedStart = Date.parse(start_date);
  const parsedEnd = Date.parse(end_date);
  const parsedDeadline = Date.parse(registration_deadline);

  if (!start_date || isNaN(parsedStart)) {
    errors.push({ field: 'start_date', message: 'A valid start date is required' });
  }
  if (!end_date || isNaN(parsedEnd)) {
    errors.push({ field: 'end_date', message: 'A valid end date is required' });
  }
  if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
    errors.push({ field: 'end_date', message: 'End date must be after the start date' });
  }
  
  if (max_participants === undefined || isNaN(max_participants) || parseInt(max_participants) <= 0) {
    errors.push({ field: 'max_participants', message: 'Maximum participants must be a positive number' });
  }
  
  if (!registration_deadline || isNaN(parsedDeadline)) {
    errors.push({ field: 'registration_deadline', message: 'A valid registration deadline is required' });
  }
  if (registration_deadline && start_date && new Date(registration_deadline) >= new Date(start_date)) {
    errors.push({ field: 'registration_deadline', message: 'Registration deadline must be before the start date' });
  }
  
  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }
  next();
};

module.exports = {
  validateEvent
};
