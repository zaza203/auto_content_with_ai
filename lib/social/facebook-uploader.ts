import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export async function uploadToFacebook(content: any): Promise<any> {
  try {
    // Upload video to Facebook
    const videoResult = await uploadVideoToFacebook(content);
    
    // Create a regular post
    const postResult = await createFacebookPost(content);
    
    return {
      success: true,
      video: videoResult,
      post: postResult
    };
    
  } catch (error) {
    console.error('Error uploading to Facebook:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

async function uploadVideoToFacebook(content: any): Promise<any> {
  const formData = new FormData();
  const videoPath = `${process.cwd()}/public${content.videoUrl}`;
  
  formData.append('source', fs.createReadStream(videoPath));
  formData.append('description', createFacebookVideoDescription(content));
  formData.append('title', content.title);
  formData.append('access_token', process.env.FACEBOOK_ACCESS_TOKEN);
  
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/videos`,
    formData,
    {
      headers: formData.getHeaders()
    }
  );
  
  return response.data;
}

async function createFacebookPost(content: any): Promise<any> {
  const postData = {
    message: createFacebookPostMessage(content),
    access_token: process.env.FACEBOOK_ACCESS_TOKEN
  };
  
  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.FACEBOOK_PAGE_ID}/feed`,
    postData
  );
  
  return response.data;
}

function createFacebookVideoDescription(content: any): string {
  return `${content.title}

${content.excerpt}

🔗 Read the full story at: [Your Website Link]

#Fiction #Story #${content.niche.replace(/\s+/g, '')} #MustWatch #Entertainment`;
}

function createFacebookPostMessage(content: any): string {
  return `📖 NEW STORY ALERT! 📖

"${content.title}"

A captivating ${content.niche} story that will keep you on the edge of your seat! 

🎬 Watch the full video above
🔗 Get the complete story at: [Your Website Link]

What do you think happens next? Let us know in the comments! 👇

#Fiction #Story #${content.niche.replace(/\s+/g, '')} #MustWatch #Entertainment #Storytelling`;
}