// Professional Video Editor Component - Clean Timeline-based Interface
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Scissors,
  Move,
  Type,
  Image,
  Music,
  Settings,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  Square,
  Circle,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Plus,
  Minus,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Filter,
  Palette,
  Mic,
  Camera,
  Monitor,
  Headphones,
  MousePointer
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useVideoStore } from '../store/videoStore';

interface VideoEditorProps {
  onBackToDashboard: () => void;
}

// Video upload helper functions - accessible to all components
const handleVideoUpload = async (file: File) => {
  const { 
    createProject, 
    addAsset, 
    addClip, 
    updateProject,
    addNotification,
    setPlayheadTime,
    setIsPlaying
  } = useVideoStore();

  try {
    // Show loading notification
    addNotification({
      type: 'info',
      title: 'Processing Video',
      message: `Uploading ${file.name}...`
    });

    // Create video URL
    const videoUrl = URL.createObjectURL(file);
    
    // Extract video metadata
    const videoMetadata = await extractVideoMetadata(videoUrl);
    
    // Create project name
    const projectName = file.name.replace(/\.[^/.]+$/, "");
    
    // Always create fresh project for clean upload
    createProject(projectName, '16:9');
    
    // Wait briefly for project to be created
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Add asset using store function
    const asset = await addAsset(file);
    
    // Get current project state for updates
    const state = useVideoStore.getState();
    const currentProject = state.currentProject;
    
    // Update asset with video metadata
    updateProject({
      duration: videoMetadata.duration,
      assets: currentProject?.assets.map(a => 
        a.id === asset.id ? {
          ...a,
          duration: videoMetadata.duration,
          metadata: {
            ...a.metadata,
            width: videoMetadata.width,
            height: videoMetadata.height,
            fps: videoMetadata.fps,
            videoUrl: videoUrl
          }
        } : a
      ) || []
    });
    
    // Find video track and add clip
    if (currentProject) {
      const videoTrack = currentProject.tracks.find(track => track.type === 'video');
      if (videoTrack) {
        addClip(videoTrack.id, asset.id, 0, videoMetadata.duration);
      }
    }
    
    // Reset playhead and stop playback
    setPlayheadTime(0);
    setIsPlaying(false);
    
    // Clean up old video URL if replacing
    if (currentProject?.assets[0]?.metadata?.videoUrl && 
        currentProject.assets[0].metadata.videoUrl !== videoUrl) {
      URL.revokeObjectURL(currentProject.assets[0].metadata.videoUrl);
    }

    // Success notification
    addNotification({
      type: 'success',
      title: 'Video Uploaded',
      message: `${file.name} has been added to the project`,
      duration: 3000
    });

  } catch (error) {
    console.error('Error uploading video:', error);
    addNotification({
      type: 'error',
      title: 'Upload Failed',
      message: 'Failed to upload video file'
    });
  }
};

const extractVideoMetadata = (videoUrl: string): Promise<{
  duration: number;
  width: number;
  height: number;
  fps: number;
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      const duration = video.duration;
      const width = video.videoWidth;
      const height = video.videoHeight;
      
      // Estimate FPS (common for web videos)
      const fps = 30;
      
      // Clean up
      URL.revokeObjectURL(videoUrl);
      
      resolve({ duration, width, height, fps });
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = videoUrl;
  });
};

// Video Preview Component (CapCut Style)
const VideoPreview: React.FC = () => {
  const { 
    isPlaying, 
    playheadTime, 
    setIsPlaying, 
    setPlayheadTime,
    currentProject
  } = useVideoStore();

  const duration = currentProject?.duration || 0;
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sync video playback with store state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync video time with playhead time
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - playheadTime) > 0.1) {
      videoRef.current.currentTime = playheadTime;
    }
  }, [playheadTime]);

  // Update playhead when video time changes
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setPlayheadTime(videoRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBackward = () => {
    setPlayheadTime(Math.max(0, playheadTime - 10));
  };

  const handleSkipForward = () => {
    setPlayheadTime(Math.min(duration, playheadTime + 10));
  };

  return (
    <div className="h-full bg-black rounded-lg overflow-hidden flex flex-col">
      {/* Video Display Area - No bottom padding to connect to controls */}
      <div className="flex-1 bg-black flex items-center justify-center relative">
        {currentProject && currentProject.assets.length > 0 ? (
          // Show uploaded video
          <div className="relative w-full h-full">
            {/* Video Element - Now Visible! */}
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src={currentProject.assets[0]?.metadata?.videoUrl || currentProject.assets[0]?.filePath}
              loop
              muted={isMuted}
              controls={false}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = playheadTime;
                }
              }}
              onError={(e) => {
                console.error('Video error:', e);
                console.log('Video URL:', currentProject.assets[0]?.metadata?.videoUrl || currentProject.assets[0]?.filePath);
              }}
            />
            
            {/* Play/Pause Overlay */}
            <Button
              onClick={handlePlayPause}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/50 hover:bg-black/70 border-2 border-white/20"
              variant="ghost"
              size="icon"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" />
              )}
            </Button>

            {/* Video Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
              <p className="text-sm font-medium mb-1">{currentProject.assets[0].name}</p>
              <p className="text-xs opacity-75">
                {formatTime(playheadTime)} / {formatTime(currentProject.assets[0].duration || 0)}
              </p>
              <div className="text-xs opacity-50">
                {currentProject.assets[0].metadata?.width}x{currentProject.assets[0].metadata?.height} • {currentProject.assets[0].metadata?.fps}fps
              </div>
            </div>

            {/* Upload Button - Always visible for replacing video */}
            <Button
              onClick={async () => {
                // Trigger file upload
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    await handleVideoUpload(file);
                  }
                };
                input.click();
              }}
              className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white border border-white/20"
              variant="ghost"
              size="sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Replace Video
            </Button>

            {/* Fullscreen Button */}
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
              variant="ghost"
              size="icon"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-white" />
              ) : (
                <Maximize className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="text-white text-center">
              <Video className="w-32 h-32 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">Professional Video Editor</p>
              <p className="text-sm opacity-75 mb-4">Upload a video to start editing</p>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={async () => {
                  // Trigger file upload
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'video/*';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      await handleVideoUpload(file);
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </div>
            
            {/* Always show play button even when no video */}
            <Button
              onClick={handlePlayPause}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/50 hover:bg-black/70 border-2 border-white/20"
              variant="ghost"
              size="icon"
            >
              <Play className="w-10 h-10 text-white ml-1" />
            </Button>

            {/* Always show fullscreen button */}
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70"
              variant="ghost"
              size="icon"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-white" />
              ) : (
                <Maximize className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Left Toolbar Component
const LeftToolbar: React.FC = () => {
  const { 
    currentProject, 
    createProject, 
    addAsset,
    addClip,
    updateProject,
    addNotification,
    setPlayheadTime,
    setIsPlaying
  } = useVideoStore();
  
  const [activeTool, setActiveTool] = useState('selection');
  const [activePanel, setActivePanel] = useState('tools');

  const tools = [
    { id: 'selection', icon: MousePointer, label: 'Selection' },
    { id: 'cut', icon: Scissors, label: 'Cut' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: Image, label: 'Image' },
    { id: 'audio', icon: Music, label: 'Audio' },
  ];

  const panels = [
    { id: 'tools', icon: Settings, label: 'Tools' },
    { id: 'media', icon: Upload, label: 'Media' },
    { id: 'effects', icon: Filter, label: 'Effects' },
    { id: 'transitions', icon: Move, label: 'Transitions' },
  ];

  return (
    <div className="w-16 bg-card border-r flex flex-col">
      {/* Panel Selector */}
      <div className="p-2 space-y-1">
        {panels.map((panel) => (
          <Button
            key={panel.id}
            variant={activePanel === panel.id ? 'default' : 'ghost'}
            size="icon"
            onClick={() => {
              setActivePanel(panel.id);
              if (panel.id === 'media') {
                // Trigger file upload for media panel
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*,image/*,audio/*';
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file && file.type.startsWith('video/')) {
                    // Use the same upload logic as handleVideoUpload
                    const videoUrl = URL.createObjectURL(file);
                    const videoMetadata = await extractVideoMetadata(videoUrl);
                    
                    const projectName = file.name.replace(/\.[^/.]+$/, "");
                    
                    // Always create fresh project for clean upload
                    createProject(projectName, '16:9');
                    
                    // Wait briefly for project to be created
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Add asset using store function
                    const asset = await addAsset(file);
                    
                    // Get current project state for updates
                    const state = useVideoStore.getState();
                    const currentProject = state.currentProject;
                    
                    // Update asset with video metadata
                    updateProject({
                      duration: videoMetadata.duration,
                      assets: currentProject?.assets.map(a => 
                        a.id === asset.id ? {
                          ...a,
                          duration: videoMetadata.duration,
                          metadata: {
                            ...a.metadata,
                            width: videoMetadata.width,
                            height: videoMetadata.height,
                            fps: videoMetadata.fps,
                            videoUrl: videoUrl
                          }
                        } : a
                      ) || []
                    });
                    
                    // Find video track and add clip
                    if (currentProject) {
                      const videoTrack = currentProject.tracks.find(track => track.type === 'video');
                      if (videoTrack) {
                        addClip(videoTrack.id, asset.id, 0, videoMetadata.duration);
                      }
                    }
                    
                    // Reset playhead and stop playback
                    setPlayheadTime(0);
                    setIsPlaying(false);
                    
                    addNotification({
                      type: 'success',
                      title: 'Video Uploaded',
                      message: `${file.name} has been added to the project`,
                      duration: 3000
                    });
                  }
                };
                input.click();
              }
            }}
            className="w-12 h-12"
            title={panel.label}
          >
            <panel.icon className="w-5 h-5" />
          </Button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Tools */}
      <div className="p-2 border-t">
        <div className="space-y-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setActiveTool(tool.id)}
              className="w-12 h-12"
              title={tool.label}
            >
              <tool.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Timeline Component
const VideoTimeline: React.FC = () => {
  const { 
    playheadTime, 
    setPlayheadTime,
    currentProject,
    selectedClips 
  } = useVideoStore();

  const duration = currentProject?.duration || 0;

  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateTimelineMarkers = () => {
    const markers = [];
    
    if (duration === 0) {
      // No duration, show just a starting marker
      markers.push(
        <div
          key={0}
          className="absolute top-0 h-full border-l border-border"
          style={{ left: '0%' }}
        >
          <div className="absolute -top-6 left-0 text-xs text-muted-foreground transform -translate-x-1/2">
            {formatTime(0)}
          </div>
        </div>
      );
      return markers;
    }
    
    const interval = Math.max(1, Math.floor(duration / 10));
    
    for (let i = 0; i <= duration; i += interval) {
      markers.push(
        <div
          key={i}
          className="absolute top-0 h-full border-l border-border"
          style={{ left: `${(i / duration) * 100}%` }}
        >
          <div className="absolute -top-6 left-0 text-xs text-muted-foreground transform -translate-x-1/2">
            {formatTime(i)}
          </div>
        </div>
      );
    }
    return markers;
  };

  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !currentProject) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    setPlayheadTime(Math.max(0, Math.min(duration, newTime)));
  };

  return (
    <div className="h-full bg-card border-t">
      {/* Timeline Content */}
      <div className="h-full flex">
        {/* Track Labels */}
        <div className="w-20 bg-muted/30 border-r">
          <div className="p-1 h-12 flex items-center gap-1 border-b">
            <Video className="w-3 h-3" />
            <span className="text-xs font-medium">V1</span>
          </div>
          <div className="p-1 h-12 flex items-center gap-1 border-b">
            <Music className="w-3 h-3" />
            <span className="text-xs font-medium">A1</span>
          </div>
          <div className="p-1 h-12 flex items-center gap-1 border-b">
            <Layers className="w-3 h-3" />
            <span className="text-xs font-medium">V2</span>
          </div>
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 relative" ref={timelineRef} onClick={handleTimelineClick}>
          {/* Timeline Grid */}
          <div className="absolute inset-0">
            {generateTimelineMarkers()}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
            style={{ left: `${duration > 0 ? (playheadTime / duration) * 100 : 0}%` }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rotate-45" />
          </div>

          {/* Video Track */}
          <div className="absolute top-0 left-0 right-0 h-12 border-b flex items-center px-1">
            {currentProject && currentProject.tracks[0]?.clips.map((clip, index) => {
              const asset = currentProject.assets.find(a => a.id === clip.assetId);
              const clipWidth = duration > 0 ? `${(clip.endTime - clip.startTime) / duration * 100}%` : '100%';
              const clipLeft = duration > 0 ? `${(clip.startTime / duration) * 100}%` : '0%';
              
              return (
                <div
                  key={clip.id}
                  className="h-6 bg-blue-500 rounded-sm flex items-center px-1 cursor-move absolute"
                  style={{ 
                    width: clipWidth,
                    left: clipLeft
                  }}
                >
                  <span className="text-xs text-white truncate">
                    {asset?.name || 'Video Clip'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Audio Track */}
          <div className="absolute top-12 left-0 right-0 h-12 border-b flex items-center px-1">
            {currentProject && (
              <div className="flex-1 h-6">
                {/* Audio waveform visualization would go here */}
                <div className="h-1.5 bg-green-500/30 rounded-sm" />
              </div>
            )}
          </div>

          {/* Additional Video Track */}
          <div className="absolute top-24 left-0 right-0 h-12 border-b flex items-center px-1">
            {/* Empty track for additional content */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Playback Controls Component - CapCut Style
const PlaybackControlsCompact: React.FC = () => {
  const { 
    isPlaying, 
    playheadTime, 
    setIsPlaying, 
    setPlayheadTime,
    currentProject
  } = useVideoStore();

  const duration = currentProject?.duration || 0;
  const [volume, setVolume] = useState(80);

  const handleSkipBackward = () => {
    setPlayheadTime(Math.max(0, playheadTime - 10));
  };

  const handleSkipForward = () => {
    setPlayheadTime(Math.min(duration, playheadTime + 10));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-12 bg-card border-t border-b flex items-center justify-between px-6">
      {/* Left: Playback Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleSkipBackward}>
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleSkipForward}>
          <SkipForward className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="icon">
            <Volume2 className="w-4 h-4" />
          </Button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-16 accent-primary"
          />
        </div>
      </div>

      {/* Center: Time Display */}
      <div className="text-sm font-mono text-foreground">
        {formatTime(playheadTime)} | {formatTime(duration)}
      </div>

      {/* Right: Timeline Tools */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Square className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Layers className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// Main VideoEditor Component
const VideoEditor: React.FC<VideoEditorProps> = ({ onBackToDashboard }) => {
  const { 
    currentProject, 
    addNotification 
  } = useVideoStore();
  
  const handleExport = () => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: 'Your video is being rendered. This may take a few minutes.'
    });
  };

  const handleSave = () => {
    addNotification({
      type: 'success',
      title: 'Project Saved',
      message: 'Your project has been saved successfully.'
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <div className="h-16 bg-card border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBackToDashboard}>
            ← Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <span className="font-semibold">ClipFlow Video Editor</span>
          </div>
          {currentProject && (
            <Badge variant="secondary" className="ml-2">
              {currentProject.name}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Editor Layout - CapCut Style Tight Connection */}
      <div className="flex-1 flex">
        {/* Left Toolbar */}
        <LeftToolbar />

        {/* Center Content Area - No gaps, tight connection */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview - Takes more space */}
          <div className="flex-[3] min-h-0 p-2">
            <VideoPreview />
          </div>

          {/* Playback Controls - Compact, connected */}
          <PlaybackControlsCompact />

          {/* Timeline - Directly connected, no gap */}
          <div className="flex-[2] min-h-0">
            <VideoTimeline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
