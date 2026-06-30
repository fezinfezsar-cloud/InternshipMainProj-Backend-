const registrationRepository = require('../repositories/registrationRepository');
const eventRepository = require('../repositories/eventRepository');

class RegistrationService {
  async registerForEvent(userId, eventId) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.status === 'CANCELLED' || event.status === 'COMPLETED') {
      throw new Error(`Cannot register. Event is already ${event.status.toLowerCase()}`);
    }

    // Check deadline
    if (new Date() > new Date(event.registration_deadline)) {
      throw new Error('Registration deadline has passed');
    }

    // Check duplication
    const existingReg = await registrationRepository.findByUserAndEvent(userId, eventId);
    if (existingReg) {
      if (existingReg.status === 'REGISTERED') {
        throw new Error('You are already registered for this event');
      } else {
        // Reactivate registration
        return await registrationRepository.update(existingReg.id, { status: 'REGISTERED' });
      }
    }

    // Check seat capacity
    const activeCount = await registrationRepository.countActiveRegistrations(eventId);
    if (activeCount >= event.max_participants) {
      throw new Error('This event is fully booked.');
    }

    return await registrationRepository.create({
      user_id: userId,
      event_id: eventId,
      status: 'REGISTERED',
      attendance_status: 'ABSENT'
    });
  }

  async getParticipants(eventId, requestUser) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Creator or admin check
    if (event.created_by !== requestUser.id && !['ADMIN', 'SUPER_ADMIN'].includes(requestUser.role)) {
      throw new Error('You do not have permission to view participants.');
    }

    return await registrationRepository.findParticipantsByEventId(eventId);
  }

  async getRegistrationsByUserId(userId) {
    return await registrationRepository.findRegistrationsByUserId(userId);
  }

  async checkInParticipant(eventId, participantUserId, requestUser) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Attendance checker check
    if (event.created_by !== requestUser.id && !['ADMIN', 'SUPER_ADMIN'].includes(requestUser.role)) {
      throw new Error('You do not have permission to mark attendance for this event.');
    }

    const registration = await registrationRepository.findByUserAndEvent(participantUserId, eventId);
    if (!registration) {
      throw new Error('This user is not registered for the event.');
    }

    if (registration.status !== 'REGISTERED') {
      throw new Error('User has cancelled their registration.');
    }

    if (registration.attendance_status === 'PRESENT') {
      throw new Error('Participant is already checked in.');
    }

    return await registrationRepository.update(registration.id, {
      attendance_status: 'PRESENT'
    });
  }
}

module.exports = new RegistrationService();
