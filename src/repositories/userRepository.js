const User = require('../models/User');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(updateData);
  }

  async findAll() {
    return await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = new UserRepository();
