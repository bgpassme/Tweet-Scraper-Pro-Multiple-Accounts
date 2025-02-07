import TwitterPipeline from '../twitter/TwitterPipeline.js';
import { TweetVectorStore } from '../vectorStore/index.js';
import { TweetEnhancer } from '../enhancer/index.js';
import Logger from '../utils/Logger.js';
import path from 'path';
import fs from 'fs/promises';

// Remove default export and keep only named export
export class TweetScheduler {
  constructor() {
    Logger.info('Initializing Tweet Scheduler');
    this.vectorStore = new TweetVectorStore();
    this.enhancer = new TweetEnhancer();
    this.targetUsernames = process.env.TARGET_USERNAMES.split(',')
      .map(u => u.trim().replace('@', ''));
    this.checkInterval = parseInt(process.env.CHECK_INTERVAL) || 1800000;
    this.accountSwitchDelay = parseInt(process.env.DELAY_BETWEEN_ACCOUNTS) || 300000;
  }

  async initialize() {
    Logger.info('Initializing vector stores...');
    for (const username of this.targetUsernames) {
      try {
        await this.vectorStore.initialize(username);
        Logger.success(`Initialized vector store for @${username}`);
      } catch (error) {
        Logger.error(`Failed to initialize vector store for @${username}: ${error.message}`);
        throw error;
      }
    }
  }

  async start() {
    try {
      Logger.info('Starting Tweet Scheduler');
      
      // Initialize vector stores before processing
      await this.initialize();
      
      for (const username of this.targetUsernames) {
        Logger.info(`Processing account: ${username}`);
        await this.processUser(username);
        
        if (username !== this.targetUsernames[this.targetUsernames.length - 1]) {
          Logger.info(`Waiting ${this.accountSwitchDelay/1000} seconds before next account...`);
          await new Promise(resolve => setTimeout(resolve, this.accountSwitchDelay));
        }
      }

      Logger.success('Completed processing all accounts');
    } catch (error) {
      Logger.error(`Scheduler error: ${error.message}`);
      throw error;
    }
  }

  async processUser(username) {
    Logger.info(`Starting tweet collection for @${username}`);
    const pipeline = new TwitterPipeline(username);
    
    try {
      // Initialize scraper before collecting tweets
      await pipeline.initializeScraper();
      
      const tweets = await pipeline.collectTweets(pipeline.scraper);
      Logger.info(`Collected ${tweets.length} tweets for @${username}`);

      for (const tweet of tweets) {
        Logger.info(`Processing tweet from ${username}:
          ID: ${tweet.id}
          Text: ${tweet.text.substring(0, 50)}...
          Date: ${tweet.createdAt}
          Engagement: ❤️ ${tweet.likes} | 🔄 ${tweet.retweetCount} | 💬 ${tweet.replies}
        `);
        
        const isNew = await this.vectorStore.addTweet(username, tweet);
        
        if (isNew) {
          try {
            const enhancedTweet = await this.enhancer.enhanceTweet(tweet);
            await this.saveTweet(username, enhancedTweet);
            Logger.success(`Enhanced and saved tweet ${tweet.id}`);
          } catch (error) {
            Logger.error(`Failed to enhance tweet ${tweet.id}: ${error.message}`);
          }
        } else {
          Logger.debug(`Skipped duplicate tweet ${tweet.id}`);
        }
      }
    } catch (error) {
      Logger.error(`Failed to process @${username}: ${error.message}`);
      throw error;
    }
  }

  async saveTweet(username, tweet) {
    try {
      const outputPath = path.join(process.env.OUTPUT_DIR, username);
      await fs.mkdir(outputPath, { recursive: true });
      
      const filename = `${new Date().toISOString()}_${tweet.id}.json`;
      await fs.writeFile(
        path.join(outputPath, filename),
        JSON.stringify(tweet, null, 2)
      );
      Logger.success(`Saved tweet to ${filename}`);
    } catch (error) {
      Logger.error(`Failed to save tweet: ${error.message}`);
      throw error;
    }
  }
}// Remove this line
