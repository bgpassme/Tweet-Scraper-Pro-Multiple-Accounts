import OpenAI from 'openai';
import Logger from '../utils/Logger.js';

export class TweetEnhancer {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY  // Changed from DEEPSEEK_API_KEY
    });
  }

  async enhanceTweet(tweet, context) {
    Logger.info(`Enhancing tweet: ${tweet.id}`);
    
    try {
      const prompt = `
        Transform this tweet into an engaging news-style announcement while maintaining the original topic and technical accuracy.
        Make it informative and attention-grabbing in exactly 280 characters.
        
        Original tweet: "${tweet.text}"
        Context: ${context || 'No additional context provided'}
        
        Requirements:
        - Maintain technical accuracy
        - Make it newsworthy
        - Include relevant hashtags
        - Must be exactly 280 characters
        - Avoid repetitive content
      `;

      const response = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "user",
          content: prompt
        }],
        max_tokens: 150,
        temperature: 0.7
      });

      const enhancedTweet = response.choices[0].message.content.trim();
      Logger.success(`Successfully enhanced tweet ${tweet.id}`);
      return enhancedTweet;

    } catch (error) {
      Logger.error(`Failed to enhance tweet ${tweet.id}: ${error.message}`);
      throw error;
    }
  }
}