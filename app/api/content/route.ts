import { NextResponse } from 'next/server';
import { getContentList } from '@/lib/database/content-manager';

export async function GET() {
  try {
    const content = await getContentList();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}