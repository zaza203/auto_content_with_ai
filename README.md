# AI Content Creation System

A comprehensive automated system that generates fiction stories, converts them to professional videos, and uploads them to social media platforms.

## Features

### 🤖 AI-Powered Story Generation
- Uses OpenAI GPT-4 and Google Gemini for enhanced creativity
- Generates captivating fiction stories across multiple niches
- Creates 4-minute story excerpts with cliffhanger endings
- Provides full story content separately

### 🎬 Professional Video Creation
- Text-to-speech conversion with human-like voices
- Automated image collection from Unsplash and Pexels
- Advanced video editing with transitions and effects
- Professional-grade output with ffmpeg

### 📱 Social Media Integration
- Automatic YouTube uploads with optimized descriptions
- Facebook page and post automation
- Scheduled content creation every 6 hours
- Real-time upload tracking and analytics

### 🎯 Content Niches
- Mystery & Thriller
- Romance
- Science Fiction
- Fantasy
- Horror
- Adventure
- Drama
- Comedy
- Historical Fiction
- Urban Fiction

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

### 2. Required API Keys

#### OpenAI API
1. Visit https://platform.openai.com/
2. Create an account and get your API key
3. Add to `OPENAI_API_KEY` in your `.env` file

#### Google Gemini API
1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add to `GEMINI_API_KEY` in your `.env` file

#### ElevenLabs TTS API
1. Visit https://elevenlabs.io/
2. Sign up for free tier
3. Get your API key and preferred voice ID
4. Add to `.env` file

#### Image APIs
- **Unsplash**: Visit https://unsplash.com/developers
- **Pexels**: Visit https://www.pexels.com/api/

#### YouTube API
1. Visit Google Cloud Console
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Get refresh token using OAuth flow

#### Facebook API
1. Visit Facebook for Developers
2. Create a new app
3. Get page access token
4. Add page ID to `.env`

### 3. Install Dependencies
```bash
npm install
```

### 4. Install FFmpeg
The system requires FFmpeg for video processing:

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html

### 5. Run the Application
```bash
npm run dev
```

## Usage

### Manual Content Generation
1. Open the dashboard at `http://localhost:3000`
2. Click "Generate New Content" to create a story
3. Preview the generated content
4. Download videos or upload to social media

### Automated Scheduling
The system automatically generates and uploads content every 6 hours. To start the scheduler:

```bash
curl -X POST http://localhost:3000/api/scheduler
```

### Content Management
- View all generated content in the dashboard
- Download videos locally
- Manual upload to social platforms
- Track upload statistics

## File Structure

```
├── app/
│   ├── api/              # API routes
│   ├── components/       # UI components
│   └── page.tsx         # Main dashboard
├── lib/
│   ├── ai/              # Story generation
│   ├── tts/             # Text-to-speech
│   ├── images/          # Image collection
│   ├── video/           # Video creation
│   ├── social/          # Social media
│   ├── database/        # Data management
│   └── scheduler/       # Cron jobs
└── public/
    ├── videos/          # Generated videos
    ├── audio/           # TTS audio files
    └── images/          # Story images
```

## Technical Details

### Story Generation Process
1. AI selects random niche from 10+ categories
2. OpenAI generates initial story concept
3. Gemini creates alternative version
4. Stories are combined for enhanced quality
5. 4-minute excerpt created with cliffhanger

### Video Production Pipeline
1. Text-to-speech conversion (4-minute duration)
2. Relevant images collected based on story keywords
3. Professional video editing with:
   - Smooth transitions between images
   - Title overlay animations
   - Color grading and enhancement
   - Audio synchronization

### Social Media Automation
1. YouTube upload with SEO-optimized descriptions
2. Facebook video post with engagement hooks
3. Separate Facebook text post for broader reach
4. Automatic link to full story content

## Customization

### Adding New Niches
Edit `lib/ai/story-generator.ts` and add to the `niches` array:

```typescript
const niches = [
  // ... existing niches
  'Your New Niche'
];
```

### Modifying Video Effects
Edit `lib/video/video-creator.ts` to customize:
- Transition effects
- Color grading
- Text overlays
- Audio processing

### Scheduling Frequency
Modify the cron schedule in `lib/scheduler/cron-jobs.ts`:

```typescript
// Every 6 hours
cron.schedule('0 */6 * * *', async () => {
  // ... generation logic
});
```

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Install FFmpeg and ensure it's in your PATH
2. **API rate limits**: Check your API usage and upgrade plans if needed
3. **Video processing fails**: Ensure sufficient disk space and memory
4. **Social media upload fails**: Verify API credentials and permissions

### Performance Optimization

1. **Storage**: Regularly clean up generated files
2. **Memory**: Monitor RAM usage during video processing
3. **API calls**: Implement caching for image searches
4. **Database**: Use proper indexing for content queries

## License

This project is for educational and personal use. Ensure you comply with all API terms of service and content platform guidelines.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Ensure all environment variables are set correctly
4. Verify FFmpeg installation and permissions