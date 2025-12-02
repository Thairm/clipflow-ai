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

// Video Preview Component
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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBackward = () => {
    setPlayheadTime(Math.max(0, playheadTime - 10));
  };

  const handleSkipForward = () => {
    setPlayheadTime(Math.min(duration, playheadTime + 10));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  return (
    <div className="flex-1 bg-black rounded-lg overflow-hidden flex flex-col">
      {/* Video Display Area */}
      <div className="flex-1 bg-black flex items-center justify-center relative">
        {currentProject ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="text-white text-center">
              <Video className="w-32 h-32 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">{currentProject.name}</p>
              <p className="text-sm opacity-75">Duration: {formatTime(duration)}</p>
              <div className="mt-4 text-xs opacity-50">
                Resolution: 1920x1080 • 30fps
              </div>
            </div>
            
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
                onClick={() => {
                  // Trigger file upload
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'video/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      // Handle file upload here
                      console.log('Video file selected:', file.name);
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

      {/* Video Controls - Compact spacing */}
      <div className="p-2 bg-card border-t">
        <div className="flex items-center gap-3">
          {/* Playback Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleSkipBackward}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePlayPause}>
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSkipForward}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Time Display */}
          <div className="text-sm font-mono text-muted-foreground">
            {formatTime(playheadTime)} / {formatTime(duration)}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 ml-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVolume = parseInt(e.target.value);
                setVolume(newVolume);
                setIsMuted(newVolume === 0);
              }}
              className="w-20 accent-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Left Toolbar Component
const LeftToolbar: React.FC = () => {
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
            onClick={() => setActivePanel(panel.id)}
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
    <div className="h-48 bg-card border-t">
      {/* Timeline Header */}
      <div className="h-10 bg-muted/50 flex items-center justify-between px-3 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Square className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Circle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Layers className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setZoom(Math.max(10, zoom - 10))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-mono min-w-[3rem] text-center">{zoom}%</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setZoom(Math.min(500, zoom + 10))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Badge variant="secondary" className="text-xs">
          {formatTime(duration)}
        </Badge>
      </div>

      {/* Timeline Content */}
      <div className="h-38 flex">
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
            {currentProject && (
              <div
                className="h-6 bg-blue-500 rounded-sm flex items-center px-1 cursor-move"
                style={{ 
                  width: '100%',
                  position: 'absolute',
                  left: 0
                }}
              >
                <span className="text-xs text-white truncate">
                  {currentProject.name}
                </span>
              </div>
            )}
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
        </div>
      </div>
    </div>
  );
};

// Main VideoEditor Component
const VideoEditor: React.FC<VideoEditorProps> = ({ onBackToDashboard }) => {
  const { currentProject, addNotification } = useVideoStore();
  
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

      {/* Main Editor Layout */}
      <div className="flex-1 flex">
        {/* Left Toolbar */}
        <LeftToolbar />

        {/* Center Content Area - No gap between preview and timeline */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview - Connected directly to timeline */}
          <div className="flex-1 min-h-0">
            <VideoPreview />
          </div>

          {/* Timeline - Directly connected to preview */}
          <VideoTimeline />
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
