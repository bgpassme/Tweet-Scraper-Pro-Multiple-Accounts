# Tweet-Scraper Pro (Multiple Accounts)

An advanced pipeline for automated collection and AI-enhanced processing of tweets from multiple public figures. Features intelligent rate limiting, vector-based duplicate detection, and AI content enhancement.


this project is Forked of : https://github.com/elizaOS/twitter-scraper-finetune

## Features
- 🔄 Multi-account monitoring with smart delays
- 🤖 AI-powered tweet enhancement
- 🎯 Vector-based duplicate detection
- ⚡ Intelligent rate limiting
- 🔒 Secure cookie-based authentication
- 📊 Detailed logging and statistics

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Twitter account for authentication
- OpenAI API key


## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/tweet-scraper-pro.git
   cd tweet-scraper-pro

2. Install Dependencies
   npm install



3. Configure Environment Create a .env

4. Running the Scraper
configure  TARGET_USERNAMES=account1,account2 Without @ symbol (example: TARGET_USERNAMES=elonmusk,jack) in .env file to scrape the tweets

npm run start:monitor


## Important Notes
⚠️ Security Recommendations :

- ⚠️ Create a dedicated Twitter account for scraping
- 🔒 Store API keys securely
- 📊 Monitor rate limits in logs
- ⚡ Follow Twitter's automation guidelines

## Troubleshooting
If you encounter issues:

1. Check Twitter credentials
2. Verify API keys are valid
3. Ensure proper delay settings
4. Check network connectivity
5. Review logs for errors

## Directory structure

tweet-scraper-pro/
├── src/
│   ├── twitter/
│   │   ├── TwitterPipeline.js
│   │   └── Logger.js
│   ├── vectorStore/
│   │   └── index.js
│   ├── enhancer/
│   │   └── index.js
│   ├── utils/
│   │   └── Logger.js
│   ├── scheduler/
│   │   └── index.js
│   └── index.js
├── data/
│   ├── vector_store/
│   │   └── [username]/
│   │       ├── docstore.json
│   │       └── hnswlib.index
│   └── generated_tweets/
│       └── [username]/
│           └── [timestamp]_[tweet_id].json
├── cookies/
│   └── [username]_cookies.json
├── package.json
├── .env
└── README.md

Key directories and their purposes:

- src/ : Source code files
- data/ : Stored tweets and vector databases
- cookies/ : Authentication data
- src/twitter/ : Twitter interaction logic
- src/vectorStore/ : Vector similarity handling
- src/enhancer/ : AI enhancement