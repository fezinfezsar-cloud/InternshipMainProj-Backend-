const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/responseHandler');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return sendError(res, 'Invalid or expired token.', 401);
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return sendError(res, 'User profile not found.', 401);
    }

    // Attach user instance to request
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Authentication failed.', 401);
  }
};

module.exports = authMiddleware;
