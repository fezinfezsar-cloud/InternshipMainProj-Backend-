const eventRepository = require('../repositories/eventRepository');
const s3Service = require('./s3Service');

class EventService {
  async createEvent(eventData, bannerFile = null) {
    let banner_url = null;
    if (bannerFile) {
      banner_url = await s3Service.uploadFile(bannerFile);
    }

    return await eventRepository.create({
      ...eventData,
      banner_url
    });
  }

  async updateEvent(id, updateData, bannerFile = null, requestUser) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    // Auth check: Event creator, Admin or SuperAdmin
    if (event.created_by !== requestUser.id && !['ADMIN', 'SUPER_ADMIN'].includes(requestUser.role)) {
      throw new Error('You do not have permission to modify this event.');
    }

    let banner_url = event.banner_url;
    if (bannerFile) {
      if (banner_url) {
        await s3Service.deleteFile(banner_url);
      }
      banner_url = await s3Service.uploadFile(bannerFile);
    }

    return await eventRepository.update(id, {
      ...updateData,
      banner_url
    });
  }

  async deleteEvent(id, requestUser) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    // Auth check
    if (event.created_by !== requestUser.id && !['ADMIN', 'SUPER_ADMIN'].includes(requestUser.role)) {
      throw new Error('You do not have permission to delete this event.');
    }

    if (event.banner_url) {
      await s3Service.deleteFile(event.banner_url);
    }

    return await eventRepository.delete(id);
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    return event;
  }

  async getAllEvents(filters) {
    return await eventRepository.findAll(filters);
  }
}

module.exports = new EventService();
