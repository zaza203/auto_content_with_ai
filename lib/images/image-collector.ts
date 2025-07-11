import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface ImageData {
  url: string;
  alt: string;
  source: string;
}

export async function collectImages(keywords: string[]): Promise<ImageData[]> {
  const images: ImageData[] = [];
  
  try {
    // Use Unsplash API for high-quality images
    for (const keyword of keywords.slice(0, 5)) {
      const unsplashImages = await fetchUnsplashImages(keyword);
      images.push(...unsplashImages);
    }
    
    // Fallback to Pexels if not enough images
    if (images.length < 8) {
      const pexelsImages = await fetchPexelsImages(keywords);
      images.push(...pexelsImages);
    }
    
    return images.slice(0, 10); // Return top 10 images
    
  } catch (error) {
    console.error('Error collecting images:', error);
    return await getFallbackImages(keywords);
  }
}

async function fetchUnsplashImages(keyword: string): Promise<ImageData[]> {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=3&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    return response.data.results.map((image: any) => ({
      url: image.urls.regular,
      alt: image.alt_description || keyword,
      source: 'unsplash'
    }));
    
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
}

async function fetchPexelsImages(keywords: string[]): Promise<ImageData[]> {
  try {
    const keyword = keywords.join(' ');
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=5&orientation=landscape`,
      {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY
        }
      }
    );
    
    return response.data.photos.map((photo: any) => ({
      url: photo.src.large,
      alt: keyword,
      source: 'pexels'
    }));
    
  } catch (error) {
    console.error('Error fetching Pexels images:', error);
    return [];
  }
}

async function getFallbackImages(keywords: string[]): Promise<ImageData[]> {
  // Fallback to curated stock images for different niches
  const fallbackImages = [
    { url: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg', alt: 'mystery scene', source: 'pexels' },
    { url: 'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg', alt: 'dramatic landscape', source: 'pexels' },
    { url: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg', alt: 'atmospheric scene', source: 'pexels' },
    { url: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg', alt: 'cinematic view', source: 'pexels' },
    { url: 'https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg', alt: 'storytelling scene', source: 'pexels' },
    { url: 'https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg', alt: 'narrative backdrop', source: 'pexels' },
    { url: 'https://images.pexels.com/photos/1229042/pexels-photo-1229042.jpeg', alt: 'fiction setting', source: 'pexels' },
    { url: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg', alt: 'story atmosphere', source: 'pexels' }
  ];
  
  return fallbackImages.slice(0, 8);
}

export async function downloadAndOptimizeImages(images: ImageData[]): Promise<string[]> {
  const downloadedPaths: string[] = [];
  
  for (let i = 0; i < images.length; i++) {
    try {
      const image = images[i];
      const response = await axios.get(image.url, { responseType: 'arraybuffer' });
      
      const fileName = `image_${Date.now()}_${i}.jpg`;
      const filePath = path.join(process.cwd(), 'public/images', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, response.data);
      downloadedPaths.push(`/images/${fileName}`);
      
    } catch (error) {
      console.error(`Error downloading image ${i}:`, error);
    }
  }
  
  return downloadedPaths;
}