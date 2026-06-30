const { sendError } = require('../utils/responseHandler');

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Access denied. User not authenticated.', 401);
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Forbidden. You do not have permission to perform this action.', 403);
    }
    
    next();
  };
};

module.exports = roleMiddleware;
