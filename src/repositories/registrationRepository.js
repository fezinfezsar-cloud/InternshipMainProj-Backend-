const Registration = require('../models/Registration');
const User = require('../models/User');
const Event = require('../models/Event');

class RegistrationRepository {
  async findByUserAndEvent(userId, eventId) {
    return await Registration.findOne({
      where: {
        user_id: userId,
        event_id: eventId
      }
    });
  }

  async create(registrationData) {
    return await Registration.create(registrationData);
  }

  async update(id, updateData) {
    const reg = await Registration.findByPk(id);
    if (!reg) return null;
    return await reg.update(updateData);
  }

  async findParticipantsByEventId(eventId) {
    return await Registration.findAll({
      where: { event_id: eventId, status: 'REGISTERED' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'profile_image']
        }
      ],
      order: [['registered_at', 'DESC']]
    });
  }

  async findRegistrationsByUserId(userId) {
    return await Registration.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Event,
          as: 'event',
          include: [
            {
              model: User,
              as: 'organizer',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['registered_at', 'DESC']]
    });
  }

  async countActiveRegistrations(eventId) {
    return await Registration.count({
      where: {
        event_id: eventId,
        status: 'REGISTERED'
      }
    });
  }
}

module.exports = new RegistrationRepository();
