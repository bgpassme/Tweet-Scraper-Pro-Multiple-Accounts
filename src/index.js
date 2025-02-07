import { TweetScheduler } from './scheduler/index.js';
import Logger from './utils/Logger.js';
import dotenv from 'dotenv';

process.on('uncaughtException', (error) => {
  Logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

dotenv.config();

const scheduler = new TweetScheduler();
scheduler.start()
  .then(() => Logger.success('Application completed successfully'))
  .catch(error => {
    Logger.error(`Application failed: ${error.message}`);
    process.exit(1);
  });