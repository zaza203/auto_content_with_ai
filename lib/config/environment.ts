// Environment configuration
export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  },
  
  // Gemini Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-pro'
  },
  
  // TTS Configuration
  tts: {
    elevenlabs: {
      apiKey: process.env.ELEVENLABS_API_KEY,
      voiceId: process.env.ELEVENLABS_VOICE_ID || 'default'
    }
  },
  
  // Image APIs
  images: {
    unsplash: {
      accessKey: process.env.UNSPLASH_ACCESS_KEY
    },
    pexels: {
      apiKey: process.env.PEXELS_API_KEY
    }
  },
  
  // Social Media APIs
  social: {
    youtube: {
      clientId: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      redirectUri: process.env.YOUTUBE_REDIRECT_URI,
      refreshToken: process.env.YOUTUBE_REFRESH_TOKEN
    },
    facebook: {
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
      pageId: process.env.FACEBOOK_PAGE_ID
    }
  },
  
  // Application Settings
  app: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    storyDuration: 4 * 60, // 4 minutes in seconds
    maxImagesPerVideo: 10,
    videoQuality: 'high'
  }
};

// Validate required environment variables
export function validateEnvironment(): void {
  const required = [
    'OPENAI_API_KEY',
    'GEMINI_API_KEY',
    'ELEVENLABS_API_KEY',
    'UNSPLASH_ACCESS_KEY',
    'PEXELS_API_KEY',
    'YOUTUBE_CLIENT_ID',
    'YOUTUBE_CLIENT_SECRET',
    'YOUTUBE_REFRESH_TOKEN',
    'FACEBOOK_ACCESS_TOKEN',
    'FACEBOOK_PAGE_ID'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Some features may not work correctly. Please check your .env file.');
  }
}