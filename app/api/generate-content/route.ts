import { NextResponse } from 'next/server';
import { generateStory } from '@/lib/ai/story-generator';
import { generateTTS } from '@/lib/tts/tts-generator';
import { collectImages } from '@/lib/images/image-collector';
import { createVideo } from '@/lib/video/video-creator';
import { saveContent } from '@/lib/database/content-manager';

export async function POST(request: Request) {
  try {
    const contentId = generateContentId();
    
    // Step 1: Generate story using AI
    const story = await generateStory();
    
    // Step 2: Create 4-minute excerpt and full story
    const excerpt = createExcerpt(story);
    const fullStory = story;
    
    // Step 3: Generate TTS audio
    const audioUrl = await generateTTS(excerpt);
    
    // Step 4: Collect related images
    const images = await collectImages(story.keywords);
    
    // Step 5: Create video with professional editing
    const videoUrl = await createVideo({
      audio: audioUrl,
      images: images,
      title: story.title,
      contentId: contentId
    });
    
    // Step 6: Save content to database
    await saveContent({
      id: contentId,
      title: story.title,
      niche: story.niche,
      excerpt: excerpt,
      fullStory: fullStory,
      videoUrl: videoUrl,
      audioUrl: audioUrl,
      images: images,
      status: 'ready',
      createdAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: true, 
      contentId: contentId,
      message: 'Content generated successfully' 
    });
    
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

function generateContentId(): string {
  return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createExcerpt(story: any): string {
  // Create a 4-minute excerpt (approximately 600-800 words)
  const words = story.content.split(' ');
  const excerptWords = words.slice(0, 700);
  
  // Add cliffhanger ending
  const excerpt = excerptWords.join(' ');
  const cliffhanger = "\n\nThe story continues with unexpected twists and turns. Click the link in the description to get the full story and discover what happens next!";
  
  return excerpt + cliffhanger;
}