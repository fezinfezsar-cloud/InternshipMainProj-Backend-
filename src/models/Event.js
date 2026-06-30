const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  banner_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  max_participants: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  registration_deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'UPCOMING',
    allowNull: false
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Relationships
User.hasMany(Event, { foreignKey: 'created_by', as: 'events' });
Event.belongsTo(User, { foreignKey: 'created_by', as: 'organizer' });

module.exports = Event;
