import { NextResponse } from 'next/server';
import { getContentById } from '@/lib/database/content-manager';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = params.contentId;
    const content = await getContentById(contentId);
    
    if (!content || !content.videoUrl) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    const videoPath = path.join(process.cwd(), 'public', content.videoUrl);
    const videoBuffer = fs.readFileSync(videoPath);
    
    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="story-${contentId}.mp4"`
      }
    });
    
  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json(
      { error: 'Failed to download video' },
      { status: 500 }
    );
  }
}