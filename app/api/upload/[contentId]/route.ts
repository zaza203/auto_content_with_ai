import { NextResponse } from 'next/server';
import { uploadToYouTube } from '@/lib/social/youtube-uploader';
import { uploadToFacebook } from '@/lib/social/facebook-uploader';
import { getContentById, updateContentStatus } from '@/lib/database/content-manager';

export async function POST(
  request: Request,
  { params }: { params: { contentId: string } }
) {
  try {
    const contentId = params.contentId;
    const content = await getContentById(contentId);
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    // Upload to YouTube
    const youtubeResult = await uploadToYouTube(content);
    
    // Upload to Facebook
    const facebookResult = await uploadToFacebook(content);
    
    // Update content status
    await updateContentStatus(contentId, 'uploaded');
    
    return NextResponse.json({
      success: true,
      youtube: youtubeResult,
      facebook: facebookResult
    });
    
  } catch (error) {
    console.error('Error uploading content:', error);
    return NextResponse.json(
      { error: 'Failed to upload content' },
      { status: 500 }
    );
  }
}