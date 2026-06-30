const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Event = require('./Event');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  event_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Event,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('REGISTERED', 'CANCELLED'),
    defaultValue: 'REGISTERED',
    allowNull: false
  },
  attendance_status: {
    type: DataTypes.ENUM('ABSENT', 'PRESENT'),
    defaultValue: 'ABSENT',
    allowNull: false
  }
}, {
  tableName: 'registrations',
  timestamps: true,
  createdAt: 'registered_at', // Aligns with 'registered_at' in the spec
  updatedAt: 'updated_at'
});

// Relationships
User.belongsToMany(Event, { through: Registration, foreignKey: 'user_id', otherKey: 'event_id', as: 'registeredEvents' });
Event.belongsToMany(User, { through: Registration, foreignKey: 'event_id', otherKey: 'user_id', as: 'participants' });

// We also associate the Registration model directly for easy queries
Registration.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Registration.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
User.hasMany(Registration, { foreignKey: 'user_id', as: 'registrations' });
Event.hasMany(Registration, { foreignKey: 'event_id', as: 'registrations' });

module.exports = Registration;
