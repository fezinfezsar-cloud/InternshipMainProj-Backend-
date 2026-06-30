const { Sequelize } = require('sequelize');
const env = require('./env');
const path = require('path');

let sequelize;

if (env.DATABASE_URL) {
  console.log('Database Config: Connecting to PostgreSQL via DATABASE_URL...');
  sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    },
    logging: false
  });
} else if (env.DB_HOST && env.DB_USER && env.DB_NAME) {
  console.log(`Database Config: Connecting to PostgreSQL at ${env.DB_HOST}...`);
  sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    },
    logging: false
  });
} else {
  console.warn('Database Config: PostgreSQL credentials not found in environment. Falling back to SQLite file...');
  const storagePath = path.join(__dirname, '../../database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
  });
}

module.exports = sequelize;
