// Mock database functions - replace with your preferred database (PostgreSQL, MongoDB, etc.)
let contentStore: any[] = [];
let idCounter = 1;

export async function saveContent(content: any): Promise<void> {
  const newContent = {
    ...content,
    id: content.id || `content_${idCounter++}`,
    createdAt: content.createdAt || new Date().toISOString(),
    progress: 100
  };
  
  contentStore.push(newContent);
  console.log('Content saved:', newContent.id);
}

export async function getContentList(): Promise<any[]> {
  return contentStore.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getContentById(id: string): Promise<any | null> {
  return contentStore.find(content => content.id === id) || null;
}

export async function updateContentStatus(id: string, status: string): Promise<void> {
  const contentIndex = contentStore.findIndex(content => content.id === id);
  if (contentIndex !== -1) {
    contentStore[contentIndex].status = status;
    console.log(`Content ${id} status updated to: ${status}`);
  }
}

export async function deleteContent(id: string): Promise<void> {
  contentStore = contentStore.filter(content => content.id !== id);
  console.log(`Content ${id} deleted`);
}

// Initialize with some sample data
setTimeout(() => {
  if (contentStore.length === 0) {
    contentStore.push({
      id: 'sample_1',
      title: 'The Midnight Library\'s Secret',
      niche: 'Mystery & Thriller',
      status: 'ready',
      progress: 100,
      createdAt: new Date().toISOString(),
      videoUrl: '/videos/sample_1.mp4',
      excerpt: 'Sarah never expected to find the hidden room behind the old bookshelf...',
      fullStory: 'Complete story content here...',
      tags: ['mystery', 'thriller', 'library', 'secret', 'fiction']
    });
  }
}, 1000);