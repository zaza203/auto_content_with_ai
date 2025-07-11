import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const youtube = google.youtube('v3');

export async function uploadToYouTube(content: any): Promise<any> {
  try {
    const auth = await getYouTubeAuth();
    const videoPath = path.join(process.cwd(), 'public', content.videoUrl);
    
    const response = await youtube.videos.insert({
      auth: auth,
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: content.title,
          description: createYouTubeDescription(content),
          tags: content.tags,
          categoryId: '24', // Entertainment category
          defaultLanguage: 'en'
        },
        status: {
          privacyStatus: 'public',
          publishAt: new Date().toISOString()
        }
      },
      media: {
        body: fs.createReadStream(videoPath)
      }
    });
    
    return {
      success: true,
      videoId: response.data.id,
      url: `https://www.youtube.com/watch?v=${response.data.id}`
    };
    
  } catch (error) {
    console.error('Error uploading to YouTube:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function getYouTubeAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
  });
  
  return oauth2Client;
}

function createYouTubeDescription(content: any): string {
  return `${content.excerpt}

🔗 GET THE FULL STORY: [Your Website Link Here]

Don't miss out on the complete story! Click the link above to read the full version and discover how this incredible tale unfolds.

📖 Story Type: ${content.niche}
⏱️ Duration: 4 minutes
🎬 Professional storytelling with stunning visuals

---

🔔 SUBSCRIBE for more amazing stories!
👍 LIKE if you enjoyed this story!
💬 COMMENT what you think happens next!
🔄 SHARE with friends who love great stories!

---

#Fiction #Story #${content.niche.replace(/\s+/g, '')} #MustWatch #Storytelling #Entertainment #Viral #Subscribe

© All rights reserved. This is original fiction content created for entertainment purposes.`;
}