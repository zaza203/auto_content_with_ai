import { NextResponse } from 'next/server';
import { startScheduledJobs } from '@/lib/scheduler/cron-jobs';

let jobsStarted = false;

export async function POST() {
  try {
    if (!jobsStarted) {
      startScheduledJobs();
      jobsStarted = true;
      
      return NextResponse.json({ 
        success: true, 
        message: 'Scheduled jobs started successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'Scheduled jobs already running' 
      });
    }
  } catch (error) {
    console.error('Error starting scheduled jobs:', error);
    return NextResponse.json(
      { error: 'Failed to start scheduled jobs' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    jobsStarted,
    message: jobsStarted ? 'Jobs are running' : 'Jobs not started'
  });
}