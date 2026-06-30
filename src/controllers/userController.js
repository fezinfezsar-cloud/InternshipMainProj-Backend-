const userRepository = require('../repositories/userRepository');
const s3Service = require('../services/s3Service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_image: user.profile_image,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
      
      return sendSuccess(res, userData, 'Profile fetched successfully');
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;
      const updateData = {};
      
      if (name) updateData.name = name;
      
      if (email && email !== req.user.email) {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
          return sendError(res, 'Email is already taken', 400);
        }
        updateData.email = email;
      }
      
      if (req.file) {
        if (req.user.profile_image) {
          await s3Service.deleteFile(req.user.profile_image);
        }
        updateData.profile_image = await s3Service.uploadFile(req.file);
      }
      
      const updatedUser = await userRepository.update(req.user.id, updateData);
      
      const responseData = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profile_image: updatedUser.profile_image,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at
      };
      
      return sendSuccess(res, responseData, 'Profile updated successfully');
    } catch (error) {
      return sendError(res, error.message, 500);
    }
  }
}

module.exports = new UserController();
