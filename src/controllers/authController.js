const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, result, 'Registration successful', 201);
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return sendSuccess(res, result, 'Login successful', 200);
    } catch (error) {
      return sendError(res, error.message, 400);
    }
  }

  async logout(req, res, next) {
    try {
      return sendSuccess(res, null, 'Logout successful', 200);
    } catch (error) {
      return sendError(res, 'Logout failed', 500);
    }
  }
}

module.exports = new AuthController();
