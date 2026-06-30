const { sendError } = require('../utils/responseHandler');

const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];
  
  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }
  if (!email || !email.includes('@')) {
    errors.push({ field: 'email', message: 'A valid email is required' });
  }
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }
  if (role && !['SUPER_ADMIN', 'ADMIN', 'ORGANIZER', 'USER'].includes(role)) {
    errors.push({ field: 'role', message: 'Invalid role specified' });
  }
  
  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  }
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  
  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
