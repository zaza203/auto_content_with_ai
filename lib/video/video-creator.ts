import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

interface VideoConfig {
  audio: string;
  images: any[];
  title: string;
  contentId: string;
}

export async function createVideo(config: VideoConfig): Promise<string> {
  try {
    const outputPath = path.join(process.cwd(), 'public/videos', `${config.contentId}.mp4`);
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create video with advanced editing
    await createAdvancedVideo(config, outputPath);
    
    return `/videos/${config.contentId}.mp4`;
    
  } catch (error) {
    console.error('Error creating video:', error);
    throw new Error('Failed to create video');
  }
}

async function createAdvancedVideo(config: VideoConfig, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audioPath = path.join(process.cwd(), 'public', config.audio);
    
    // Create image sequence with transitions and effects
    const imageFiles = config.images.map((_, index) => 
      path.join(process.cwd(), 'public/images', `temp_${index}.jpg`)
    );
    
    // FFmpeg command for professional video creation
    const ffmpegCommand = `ffmpeg -y \
      -f concat -safe 0 -i ${createImageList(imageFiles)} \
      -i "${audioPath}" \
      -filter_complex "\
        [0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black[scaled]; \
        [scaled]fade=in:0:30,fade=out:st=4*60-30:d=30[faded]; \
        [faded]drawtext=text='${config.title}':fontfile=/System/Library/Fonts/Arial.ttf:fontsize=60:fontcolor=white:x=(w-text_w)/2:y=100:enable='between(t,0,5)'[titled] \
      " \
      -map "[titled]" -map 1:a \
      -c:v libx264 -preset medium -crf 23 \
      -c:a aac -b:a 128k \
      -shortest \
      "${outputPath}"`;
    
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('FFmpeg error:', error);
        reject(error);
      } else {
        console.log('Video created successfully');
        resolve();
      }
    });
  });
}

function createImageList(imageFiles: string[]): string {
  const listPath = path.join(process.cwd(), 'temp_images.txt');
  const duration = 240 / imageFiles.length; // 4 minutes total
  
  const content = imageFiles.map(file => 
    `file '${file}'\nduration ${duration}`
  ).join('\n');
  
  fs.writeFileSync(listPath, content);
  return listPath;
}

export async function addAdvancedEffects(videoPath: string): Promise<string> {
  const enhancedPath = videoPath.replace('.mp4', '_enhanced.mp4');
  
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${videoPath}" \
      -vf "eq=brightness=0.1:contrast=1.1:saturation=1.2,unsharp=5:5:1.0:5:5:0.0" \
      -c:v libx264 -preset medium -crf 20 \
      -c:a copy \
      "${enhancedPath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error adding effects:', error);
        resolve(videoPath); // Return original if enhancement fails
      } else {
        resolve(enhancedPath);
      }
    });
  });
}