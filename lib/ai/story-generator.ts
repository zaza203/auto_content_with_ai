import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface StoryData {
  title: string;
  niche: string;
  content: string;
  keywords: string[];
  tags: string[];
}

const niches = [
  'Mystery & Thriller',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Horror',
  'Adventure',
  'Drama',
  'Comedy',
  'Historical Fiction',
  'Urban Fiction'
];

export async function generateStory(): Promise<StoryData> {
  const selectedNiche = niches[Math.floor(Math.random() * niches.length)];
  
  // Use both OpenAI and Gemini for enhanced creativity
  // const openaiStory = await generateWithOpenAI(selectedNiche);
  const geminiStory = await generateWithGemini(selectedNiche);
  
  // Combine and enhance both stories
  // const finalStory = await combineStories(openaiStory, geminiStory, selectedNiche);
  
  return {
    title: geminiStory.title,
    niche: selectedNiche,
    content: geminiStory.content,
    keywords: extractKeywords(geminiStory.content),
    tags: generateTags(selectedNiche, geminiStory.content)
  };
}

async function generateWithOpenAI(niche: string): Promise<any> {
  const prompt = `Create a captivating ${niche} story that will hook readers from the first sentence. The story should be:
  
  1. Engaging and must-watch quality
  2. Approximately 1000-1200 words
  3. Have a cliffhanger ending
  4. Include vivid descriptions for visual storytelling
  5. Be family-friendly but exciting
  6. Have a catchy title
  
  Focus on creating suspense and emotional connection. The story should be incomplete, ending at a crucial moment that makes readers want to know what happens next.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a master storyteller who creates viral, engaging fiction that captivates audiences. Your stories always leave readers wanting more.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 1500,
    temperature: 0.8
  });

  return parseStoryResponse(response.choices[0].message.content || '');
}

async function generateWithGemini(niche: string): Promise<any> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `Write an incredible ${niche} story that's perfect for video content. Requirements:
  
  - Must be absolutely captivating from start to finish
  - Around 1000-1200 words
  - End with a major cliffhanger
  - Rich visual descriptions for video creation
  - Emotionally engaging characters
  - Include a compelling title
  
  Make it so engaging that viewers will be desperate to know what happens next. Focus on creating strong visual scenes and emotional moments.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return parseStoryResponse(text);
}

async function combineStories(openaiStory: any, geminiStory: any, niche: string): Promise<any> {
  const combinationPrompt = `Combine these two story concepts into one masterpiece ${niche} story:

  Story 1: ${openaiStory.title}
  ${openaiStory.content}

  Story 2: ${geminiStory.title}
  ${geminiStory.content}

  Create a single, superior story that:
  1. Takes the best elements from both stories
  2. Is 1000-1200 words
  3. Has an even better cliffhanger ending
  4. Includes rich visual descriptions
  5. Has maximum emotional impact
  6. Creates a compelling title

  Make this the most engaging ${niche} story possible.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert story editor who creates viral, must-read fiction by combining the best elements from multiple sources.'
      },
      {
        role: 'user',
        content: combinationPrompt
      }
    ],
    max_tokens: 1500,
    temperature: 0.7
  });

  return parseStoryResponse(response.choices[0].message.content || '');
}

function parseStoryResponse(response: string): any {
  // Extract title and content from the response
  const lines = response.split('\n');
  let title = '';
  let content = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().includes('title:') || (i === 0 && line.length < 100)) {
      title = line.replace(/title:\s*/i, '').replace(/['"]/g, '').trim();
    } else if (line.length > 20) {
      content += line + '\n';
    }
  }
  
  if (!title) {
    title = generateTitleFromContent(content);
  }
  
  return { title, content: content.trim() };
}

function generateTitleFromContent(content: string): string {
  const words = content.split(' ').slice(0, 10);
  return words.join(' ').replace(/[^\w\s]/gi, '') + '...';
}

function extractKeywords(content: string): string[] {
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'it', 'he', 'she', 'they', 'we', 'you', 'i', 'me', 'him', 'her', 'them', 'us'];
  
  const filteredWords = words.filter(word => 
    word.length > 3 && 
    !commonWords.includes(word) && 
    isNaN(Number(word))
  );
  
  const wordCounts = filteredWords.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(wordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function generateTags(niche: string, content: string): string[] {
  const baseTags = ['fiction', 'story', 'entertainment', 'mustwatch', 'viral'];
  const nicheTag = niche.toLowerCase().replace(/\s+/g, '');
  const keywords = extractKeywords(content).slice(0, 5);
  
  return [...baseTags, nicheTag, ...keywords];
}