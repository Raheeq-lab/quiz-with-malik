import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, Trash2, Play, AlertCircle, Link, HardDrive } from "lucide-react";
import { 
  uploadFile, 
  validateVideoFile, 
  deleteFile, 
  extractYouTubeId, 
  extractVimeoId, 
  detectVideoSourceType 
} from "@/lib/supabase";

interface VideoUploadProps {
  onVideoUploaded: (data: {
    url: string;
    sourceType: 'upload' | 'youtube' | 'vimeo';
    title?: string;
    posterUrl?: string;
  }) => void;
  onRemove: () => void;
  initialData?: {
    url?: string;
    sourceType?: 'upload' | 'youtube' | 'vimeo';
    title?: string;
    posterUrl?: string;
  };
  userRole?: 'teacher' | 'owner' | 'student';
}

const VideoUpload: React.FC<VideoUploadProps> = ({ 
  onVideoUploaded, 
  onRemove, 
  initialData,
  userRole = 'teacher'
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
  
  const [videoData, setVideoData] = useState({
    url: initialData?.url || '',
    sourceType: initialData?.sourceType || 'upload' as 'upload' | 'youtube' | 'vimeo',
    title: initialData?.title || '',
    posterUrl: initialData?.posterUrl || ''
  });

  const [linkInput, setLinkInput] = useState('');

  const isTeacherOrOwner = userRole === 'teacher' || userRole === 'owner';

  const handleFileSelect = async (file: File) => {
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const { url, error } = await uploadFile(file, 'videos', (progress) => {
        setUploadProgress(progress);
      });

      if (error) {
        throw new Error(error);
      }

      const newVideoData = {
        url,
        sourceType: 'upload' as const,
        title: videoData.title || file.name.replace(/\.[^/.]+$/, ""),
        posterUrl: videoData.posterUrl
      };
      
      setVideoData(newVideoData);
      onVideoUploaded(newVideoData);

      toast({
        title: "Success!",
        description: "Video uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLinkSubmit = () => {
    if (!linkInput.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }

    const sourceType = detectVideoSourceType(linkInput);
    let processedUrl = linkInput;

    if (sourceType === 'youtube') {
      const videoId = extractYouTubeId(linkInput);
      if (!videoId) {
        toast({
          title: "Invalid YouTube URL",
          description: "Please enter a valid YouTube video URL",
          variant: "destructive",
        });
        return;
      }
      processedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (sourceType === 'vimeo') {
      const videoId = extractVimeoId(linkInput);
      if (!videoId) {
        toast({
          title: "Invalid Vimeo URL",
          description: "Please enter a valid Vimeo video URL",
          variant: "destructive",
        });
        return;
      }
      processedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    const newVideoData = {
      url: processedUrl,
      sourceType: sourceType as 'youtube' | 'vimeo' | 'upload',
      title: videoData.title || 'Video',
      posterUrl: videoData.posterUrl
    };

    setVideoData(newVideoData);
    onVideoUploaded(newVideoData);
    setLinkInput('');

    toast({
      title: "Success!",
      description: "Video link added successfully",
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    if (!isTeacherOrOwner) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = async () => {
    if (videoData.url && videoData.sourceType === 'upload') {
      await deleteFile(videoData.url, 'videos');
    }
    onRemove();
  };

  const renderVideoPreview = () => {
    if (!videoData.url) return null;

    if (videoData.sourceType === 'youtube' || videoData.sourceType === 'vimeo') {
      return (
        <div className="relative">
          <iframe
            src={videoData.url}
            className="w-full h-48 rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              onClick={handleRemove}
              variant="destructive"
              size="sm"
              className="h-8 px-2"
            >
              Remove
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <video
          src={videoData.url}
          poster={videoData.posterUrl}
          controls
          className="w-full max-h-48 rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-2 right-2">
          <Button
            type="button"
            onClick={handleRemove}
            variant="destructive"
            size="sm"
            className="h-8 px-2"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  };

  if (!isTeacherOrOwner) {
    return (
      <div className="space-y-4 border-2 border-dashed border-muted rounded-lg p-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Video Upload</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle size={16} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Video uploads are limited to teachers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Video className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>Video uploads are available for teachers only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 border-2 border-dashed border-muted rounded-lg p-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Video Upload</Label>
        <Button
          type="button"
          onClick={handleRemove}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {!videoData.url ? (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'link')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <HardDrive size={16} />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link size={16} />
              Paste Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Drag and drop a video here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  MP4, WEBM up to 200MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Browse Files'}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploading && (
                <div className="mt-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="videoLink" className="text-sm font-medium">
                  Video URL
                </Label>
                <Input
                  id="videoLink"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supports YouTube and Vimeo links
                </p>
              </div>
              <Button
                type="button"
                onClick={handleLinkSubmit}
                disabled={!linkInput.trim()}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {renderVideoPreview()}
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="videoTitle" className="text-sm font-medium">
                Title (Optional)
              </Label>
              <Input
                id="videoTitle"
                value={videoData.title}
                onChange={(e) => {
                  const newVideoData = { ...videoData, title: e.target.value };
                  setVideoData(newVideoData);
                  onVideoUploaded(newVideoData);
                }}
                placeholder="Video title or description"
                className="mt-1"
              />
            </div>

            {videoData.sourceType === 'upload' && (
              <div>
                <Label htmlFor="posterUrl" className="text-sm font-medium">
                  Poster Image URL (Optional)
                </Label>
                <Input
                  id="posterUrl"
                  value={videoData.posterUrl}
                  onChange={(e) => {
                    const newVideoData = { ...videoData, posterUrl: e.target.value };
                    setVideoData(newVideoData);
                    onVideoUploaded(newVideoData);
                  }}
                  placeholder="URL for video thumbnail/poster"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional thumbnail image shown before video plays
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;