const app = require('./src/app');
const sequelize = require('./src/config/db');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');

const PORT = env.PORT;

const startServer = async () => {
  try {
    logger.info('Database Connection: Authenticating connection...');
    await sequelize.authenticate();
    logger.info('Database Connection: Connection established successfully.');

    logger.info('Database Sync: Synchronizing schema models...');
    await sequelize.sync({ alter: true });
    logger.info('Database Sync: All schema models synchronized.');

    app.listen(PORT, () => {
      logger.info(`Server Instance: Running on port ${PORT} in [${env.NODE_ENV}] environment.`);
    });
  } catch (error) {
    logger.error('Server Instance: Critical startup failure:', error);
    process.exit(1);
  }
};

startServer();
