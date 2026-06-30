const Event = require('../models/Event');
const User = require('../models/User');
const { Op } = require('sequelize');

class EventRepository {
  async findById(id) {
    return await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email', 'profile_image']
        }
      ]
    });
  }

  async create(eventData) {
    return await Event.create(eventData);
  }

  async update(id, updateData) {
    const event = await Event.findByPk(id);
    if (!event) return null;
    return await event.update(updateData);
  }

  async delete(id) {
    const event = await Event.findByPk(id);
    if (!event) return false;
    await event.destroy();
    return true;
  }

  async findAll(filters = {}) {
    const where = {};
    
    // Support dialect checks for pg iLike vs sqlite like case-insensitive searches
    const isPostgres = Event.sequelize.getDialect() === 'postgres';
    const matchOp = isPostgres ? Op.iLike : Op.like;

    if (filters.search) {
      where[Op.or] = [
        { title: { [matchOp]: `%${filters.search}%` } },
        { description: { [matchOp]: `%${filters.search}%` } },
        { venue: { [matchOp]: `%${filters.search}%` } }
      ];
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.created_by) {
      where.created_by = filters.created_by;
    }

    if (filters.upcoming === 'true') {
      where.start_date = {
        [Op.gt]: new Date()
      };
    }

    return await Event.findAll({
      where,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name', 'email', 'profile_image']
        }
      ],
      order: [['start_date', 'ASC']]
    });
  }
}

module.exports = new EventRepository();
