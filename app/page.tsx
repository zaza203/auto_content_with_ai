'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, Download, Upload, Settings, Clock, Video, FileText, Image, Volume2 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  niche: string;
  status: 'generating' | 'ready' | 'uploaded' | 'failed';
  progress: number;
  createdAt: string;
  videoUrl?: string;
  fullStory?: string;
}

interface SystemStats {
  totalVideos: number;
  successfulUploads: number;
  scheduledJobs: number;
  nextRun: string;
}

export default function ContentCreationDashboard() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalVideos: 0,
    successfulUploads: 0,
    scheduledJobs: 0,
    nextRun: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    fetchContent();
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = async (contentId: string) => {
    try {
      const response = await fetch(`/api/download/${contentId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `story-${contentId}.mp4`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  const manualUpload = async (contentId: string) => {
    try {
      await fetch(`/api/upload/${contentId}`, {
        method: 'POST',
      });
      fetchContent();
    } catch (error) {
      console.error('Error uploading content:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'uploaded': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const niches = [
    'Mystery & Thriller', 'Romance', 'Science Fiction', 'Fantasy', 'Horror',
    'Adventure', 'Drama', 'Comedy', 'Historical Fiction', 'Urban Fiction'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">AI Content Creation Studio</h1>
          <p className="text-slate-300">Automated fiction story generation and video creation system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Videos</p>
                  <p className="text-2xl font-bold text-white">{stats.totalVideos}</p>
                </div>
                <Video className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Successful Uploads</p>
                  <p className="text-2xl font-bold text-white">{stats.successfulUploads}</p>
                </div>
                <Upload className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Scheduled Jobs</p>
                  <p className="text-2xl font-bold text-white">{stats.scheduledJobs}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Next Run</p>
                  <p className="text-sm font-semibold text-white">{stats.nextRun}</p>
                </div>
                <Settings className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content List */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Generated Content</CardTitle>
                  <Button 
                    onClick={generateContent}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGenerating ? 'Generating...' : 'Generate New Content'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {content.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-slate-700 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors cursor-pointer"
                        onClick={() => setSelectedContent(item)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">{item.title}</h3>
                          <Badge className={`${getStatusColor(item.status)} text-white`}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">Niche: {item.niche}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-slate-400 text-xs">{item.createdAt}</p>
                          <div className="flex gap-2">
                            {item.status === 'ready' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadVideo(item.id);
                                  }}
                                  className="border-slate-600 text-white hover:bg-slate-600"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    manualUpload(item.id);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        {item.status === 'generating' && (
                          <Progress value={item.progress} className="mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Content Preview */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Content Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedContent ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">{selectedContent.title}</h3>
                      <p className="text-slate-300 text-sm">Niche: {selectedContent.niche}</p>
                    </div>
                    
                    {selectedContent.videoUrl && (
                      <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center">
                        <video
                          controls
                          className="w-full h-full rounded-lg"
                          src={selectedContent.videoUrl}
                        />
                      </div>
                    )}

                    <Tabs defaultValue="story" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="story">Story</TabsTrigger>
                        <TabsTrigger value="script">Script</TabsTrigger>
                        <TabsTrigger value="full">Full Story</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="story" className="space-y-2">
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-slate-300">4-minute story excerpt</span>
                          </div>
                          <p className="text-slate-200 text-sm">
                            Story preview will appear here once generated...
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="script" className="space-y-2">
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Volume2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-slate-300">TTS Script</span>
                          </div>
                          <p className="text-slate-200 text-sm">
                            Generated script for text-to-speech conversion...
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="full" className="space-y-2">
                        <div className="p-4 bg-slate-700 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Image className="h-4 w-4 text-purple-500" />
                            <span className="text-sm text-slate-300">Complete Story</span>
                          </div>
                          <p className="text-slate-200 text-sm">
                            Full story content available for download...
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Select a content item to preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Niches */}
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">Popular Niches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <Badge
                      key={niche}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {niche}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}