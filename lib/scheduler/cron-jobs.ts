import cron from 'node-cron';
import { generateStory } from '../ai/story-generator';
import { generateTTS } from '../tts/tts-generator';
import { collectImages } from '../images/image-collector';
import { createVideo } from '../video/video-creator';
import { uploadToYouTube } from '../social/youtube-uploader';
import { uploadToFacebook } from '../social/facebook-uploader';
import { saveContent } from '../database/content-manager';

export function startScheduledJobs(): void {
  console.log('Starting scheduled content creation jobs...');
  
  // Run every 6 hours (0 */6 * * *)
  cron.schedule('0 */6 * * *', async () => {
    console.log('Starting scheduled content generation...');
    
    try {
      await generateAndUploadContent();
      console.log('Scheduled content generation completed successfully');
    } catch (error) {
      console.error('Error in scheduled content generation:', error);
    }
  }, {
    timezone: 'UTC'
  });
  
  console.log('Scheduled jobs started - running every 6 hours');
}

async function generateAndUploadContent(): Promise<void> {
  const contentId = `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    // Step 1: Generate story
    console.log('Generating story...');
    const story = await generateStory();
    
    // Step 2: Create 4-minute excerpt
    const excerpt = createExcerpt(story);
    
    // Step 3: Generate TTS
    console.log('Generating TTS...');
    const audioUrl = await generateTTS(excerpt);
    
    // Step 4: Collect images
    console.log('Collecting images...');
    const images = await collectImages(story.keywords);
    
    // Step 5: Create video
    console.log('Creating video...');
    const videoUrl = await createVideo({
      audio: audioUrl,
      images: images,
      title: story.title,
      contentId: contentId
    });
    
    // Step 6: Save content
    const contentData = {
      id: contentId,
      title: story.title,
      niche: story.niche,
      excerpt: excerpt,
      fullStory: story.content,
      videoUrl: videoUrl,
      audioUrl: audioUrl,
      images: images,
      tags: story.tags,
      status: 'ready',
      createdAt: new Date().toISOString()
    };
    
    await saveContent(contentData);
    
    // Step 7: Auto-upload to social media
    console.log('Uploading to social media...');
    const youtubeResult = await uploadToYouTube(contentData);
    const facebookResult = await uploadToFacebook(contentData);
    
    if (youtubeResult.success && facebookResult.success) {
      contentData.status = 'uploaded';
      await saveContent(contentData);
      console.log('Content successfully uploaded to all platforms');
    }
    
  } catch (error) {
    console.error('Error in automated content generation:', error);
  }
}

function createExcerpt(story: any): string {
  const words = story.content.split(' ');
  const excerptWords = words.slice(0, 700); // Approximately 4 minutes of reading
  
  const excerpt = excerptWords.join(' ');
  const cliffhanger = "\n\nThe story continues with incredible twists and turns that will leave you breathless. Click the link in the description to get the full story and discover what happens next!";
  
  return excerpt + cliffhanger;
}