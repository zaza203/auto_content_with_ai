import { getContentList } from './content-manager';

export async function getSystemStats(): Promise<any> {
  const content = await getContentList();
  
  const stats = {
    totalVideos: content.length,
    successfulUploads: content.filter(c => c.status === 'uploaded').length,
    scheduledJobs: 4, // Running every 6 hours = 4 times per day
    nextRun: getNextRunTime()
  };
  
  return stats;
}

function getNextRunTime(): string {
  const now = new Date();
  const nextRun = new Date(now);
  
  // Calculate next 6-hour interval
  const hours = now.getHours();
  const nextHour = Math.ceil(hours / 6) * 6;
  
  nextRun.setHours(nextHour, 0, 0, 0);
  
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
    nextRun.setHours(0, 0, 0, 0);
  }
  
  return nextRun.toLocaleString();
}

export async function logUploadActivity(contentId: string, platform: string, success: boolean): Promise<void> {
  console.log(`Upload activity logged: ${contentId} to ${platform} - ${success ? 'success' : 'failed'}`);
  // Implement actual logging to database
}