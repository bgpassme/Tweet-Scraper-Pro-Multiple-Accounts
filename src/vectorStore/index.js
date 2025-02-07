import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import path from 'path';
import fs from 'fs/promises';
import Logger from '../utils/Logger.js';

export class TweetVectorStore {
  constructor() {
    this.vectorStores = new Map();
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-ada-002'  // Specify the embedding model
    });
    this.dimensions = 1536;  // OpenAI ada-002 embeddings are 1536 dimensions
  }

  async initialize(username) {
    const storePath = path.join(process.env.VECTOR_DB_PATH, username);
    await fs.mkdir(storePath, { recursive: true });
    
    try {
      this.vectorStores.set(username, await HNSWLib.load(
        storePath,
        this.embeddings
      ));
    } catch {
      // Create new store with proper dimensions
      this.vectorStores.set(username, await HNSWLib.fromTexts(
        ['initialization text'],  // Need at least one text to initialize
        { id: 'init' },
        this.embeddings,
        {
          space: 'cosine',
          numDimensions: this.dimensions
        }
      ));
    }
  }

  async addTweet(username, tweet) {
    const store = this.vectorStores.get(username);
    if (!store) {
      throw new Error(`Vector store not initialized for ${username}`);
    }

    try {
      const similar = await store.similaritySearch(tweet.text, 1);
      const similarity = similar.length > 0 ? similar[0].metadata.similarity : 0;

      if (similarity > parseFloat(process.env.SIMILARITY_THRESHOLD)) {
        return false; // Tweet is too similar to existing ones
      }

      await store.addDocuments([{
        pageContent: tweet.text,
        metadata: {
          id: tweet.id,
          timestamp: tweet.timestamp,
          similarity: similarity
        }
      }]);

      await store.save(path.join(process.env.VECTOR_DB_PATH, username));
      return true;
    } catch (error) {
      Logger.error(`Vector store error: ${error.message}`);
      return false;
    }
  }
}