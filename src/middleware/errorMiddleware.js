const logger = require('../utils/logger');
const { sendError } = require('../utils/responseHandler');

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.stack || err.message || 'An error occurred');
  
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return sendError(res, message, status, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = errorMiddleware;
