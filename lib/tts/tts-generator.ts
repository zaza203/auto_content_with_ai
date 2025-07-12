import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface TTSOptions {
  text: string;
  voice?: string;
  speed?: number;
  pitch?: number;
}

export async function generateTTS(text: string): Promise<string> {
  // try {
  //   // Using ElevenLabs free tier API (you'll need to sign up for API key)
  //   const response = await axios.post(
  //     `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
  //     {
  //       text: text,
  //       model_id: "eleven_monolingual_v1",
  //       voice_settings: {
  //         stability: 0.5,
  //         similarity_boost: 0.5,
  //         style: 0.5,
  //         use_speaker_boost: true
  //       }
  //     },
  //     {
  //       headers: {
  //         'Accept': 'audio/mpeg',
  //         'Content-Type': 'application/json',
  //         'xi-api-key': process.env.ELEVENLABS_API_KEY
  //       },
  //       responseType: 'arraybuffer'
  //     }
  //   );
    
  //   const audioBuffer = Buffer.from(response.data);
  //   const fileName = `audio_${Date.now()}.mp3`;
  //   const filePath = path.join(process.cwd(), 'public/audio', fileName);
    
  //   // Ensure directory exists
  //   const dir = path.dirname(filePath);
  //   if (!fs.existsSync(dir)) {
  //     fs.mkdirSync(dir, { recursive: true });
  //   }
    
  //   fs.writeFileSync(filePath, audioBuffer);
    
  //   return `/audio/${fileName}`;
    
  // } catch (error) {
  //   console.error('Error generating TTS:', error);
    
    // Fallback to Web Speech API or other free TTS service
    return await generateFallbackTTS(text);
  // }
}

async function generateFallbackTTS(text: string): Promise<string> {
  // Alternative: Use Google TTS or other free services
  // This is a placeholder - implement your preferred free TTS service
  
  try {
    // Example with Google TTS (free tier)
    const response = await axios.get(
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`,
      {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    ); 
    
    const audioBuffer = Buffer.from(response.data);
    const fileName = `audio_${Date.now()}.mp3`;
    const filePath = path.join(process.cwd(), 'public/audio', fileName);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, audioBuffer);
    
    return `/audio/${fileName}`;
    
  } catch (error) {
    console.error('Error with fallback TTS:', error);
    throw new Error('Failed to generate TTS audio');
  }
}

// async function generateFallbackTTS(text: string): Promise<string> {
//   try {
//     const voiceId = process.env.PLAYHT_VOICE_ID
//     const response = await axios.post(
//       'https://play.ht/api/v2/tts',
//       {
//         text,
//         voice: voiceId,
//         output_format: 'mp3'
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.PLAYHT_API_KEY}`,
//           'X-User-Id': process.env.PLAYHT_USER_ID,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const { audioUrl } = response.data;
//     if (!audioUrl) throw new Error('No audioUrl in Play.ht response');

//     // Download the audio file from the URL
//     const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
//     const audioBuffer = Buffer.from(audioResponse.data);
//     const fileName = `fallback_audio_${Date.now()}.mp3`;
//     const filePath = path.join(process.cwd(), 'public/audio', fileName);

//     const dir = path.dirname(filePath);
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     fs.writeFileSync(filePath, audioBuffer);

//     return `/audio/${fileName}`;
//   } catch (error) {
//     console.error('Play.ht fallback TTS failed:', error);
//     throw new Error('Failed to generate fallback TTS audio');
//   }
// }


export async function enhanceAudioQuality(audioPath: string): Promise<string> {
  // Add audio enhancement using ffmpeg
  const { exec } = require('child_process');
  const inputPath = path.join(process.cwd(), 'public', audioPath);
  const outputPath = inputPath.replace('.mp3', '_enhanced.mp3');
  
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${inputPath}" -af "highpass=f=80,lowpass=f=8000,volume=1.2" -ar 44100 -b:a 128k "${outputPath}"`;
    
    exec(command, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error('Error enhancing audio:', error);
        resolve(audioPath); // Return original if enhancement fails
      } else {
        const enhancedPath = audioPath.replace('.mp3', '_enhanced.mp3');
        resolve(enhancedPath);
      }
    });
  });
}