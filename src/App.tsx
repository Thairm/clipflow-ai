// Enhanced Main App Component - ClipFlow AI with Homepage and Dashboard
import React, { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Wand2, 
  Type, 
  Zap, 
  Download, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Settings,
  Plus,
  Upload,
  Folder,
  Clock,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';
import { useVideoStore } from './store/videoStore';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import AIClippingPanel from './components/AIClippingPanel';
import HormoziCaptionsPanel from './components/HormoziCaptionsPanel';
import ViralShortsPanel from './components/ViralShortsPanel';
import ExportSystem from './components/ExportSystem';
import { formatDuration } from './lib/utils';

// Enhanced AI Features Dashboard
const AIFeaturesDashboard: React.FC = () => {
  const {
    currentProject,
    aiSummaries,
    autoClipResults,
    viralShortProjects,
    isAIProcessing,
    addNotification
  } = useVideoStore();

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Simulate recent AI activity for demo
  useEffect(() => {
    const activities = [
      {
        id: '1',
        type: 'ai_analysis',
        title: 'Viral Analysis Complete',
        description: 'Identified 3 high-potential moments',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        icon: Brain,
        color: 'text-purple-400'
      },
      {
        id: '2',
        type: 'auto_clip',
        title: 'Auto Clips Generated',
        description: '12 clips suggested for TikTok',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        icon: Wand2,
        color: 'text-blue-400'
      },
      {
        id: '3',
        type: 'captions',
        title: 'Hormozi Captions Ready',
        description: '5 high-converting captions generated',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        icon: Type,
        color: 'text-green-400'
      }
    ];
    setRecentActivity(activities);
  }, []);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* AI Processing Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" />
            AI Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Processing</span>
              <Badge variant={isAIProcessing ? "default" : "secondary"}>
                {isAIProcessing ? "Active" : "Ready"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Analyses</span>
              <span className="font-medium">{aiSummaries.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auto Clips</span>
              <span className="font-medium">
                {autoClipResults.reduce((total, result) => total + result.clips.length, 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent AI Activity */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.title}</div>
                  <div className="text-xs text-muted-foreground">{activity.description}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick AI Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Wand2 className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium">Auto Clip</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Type className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium">Captions</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="text-sm font-medium">Viral Shorts</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-400" />
              <span className="text-sm font-medium">Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Video Preview Component
const VideoPreview: React.FC = () => {
  const {
    currentProject,
    isPlaying,
    playheadTime,
    setIsPlaying,
    setPlayheadTime,
    selectedClips,
    selectedTracks
  } = useVideoStore();

  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(300); // 5 minutes default

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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Video Display Area */}
        <div className="flex-1 bg-black rounded-t-lg flex items-center justify-center relative overflow-hidden">
          {currentProject ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Video Preview</p>
                <p className="text-sm opacity-75">{currentProject.name}</p>
                <p className="text-xs opacity-50 mt-2">
                  {currentProject.tracks.length} tracks • {formatDuration(currentProject.duration)}
                </p>
              </div>
              
              {/* Play/Pause Overlay */}
              <Button
                onClick={handlePlayPause}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 border-2 border-white/20"
                variant="ghost"
                size="icon"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </Button>
            </div>
          ) : (
            <div className="text-white text-center">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No video loaded</p>
              <p className="text-sm opacity-75">Upload a video to get started</p>
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div className="p-4 bg-card border-t">
          <div className="flex items-center gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
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
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 accent-primary"
              />
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max={duration}
              value={playheadTime}
              onChange={(e) => setPlayheadTime(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main ClipFlow AI Application with Homepage and Dashboard
const ClipFlowAI: React.FC = () => {
  const [currentView, setCurrentView] = useState<'homepage' | 'dashboard' | 'app'>('homepage');

  // If we're on the homepage, show that
  if (currentView === 'homepage') {
    return <Homepage onLaunchApp={() => setCurrentView('dashboard')} />;
  }

  // If we're in the dashboard, show the dashboard hub
  if (currentView === 'dashboard') {
    return (
      <Dashboard 
        onBackToHome={() => setCurrentView('homepage')}
        onOpenEditor={() => setCurrentView('app')}
      />
    );
  }

  // If we're in the app, show the application interface
  return <AppInterface onBackToHome={() => setCurrentView('homepage')} onBackToDashboard={() => setCurrentView('dashboard')} />;
};

// Application Interface Component (original ClipFlowAI logic)
const AppInterface: React.FC<{ onBackToHome: () => void; onBackToDashboard: () => void }> = ({ onBackToHome, onBackToDashboard }) => {
  const {
    currentProject,
    projects,
    notifications,
    createProject,
    loadProject,
    addNotification,
    removeNotification
  } = useVideoStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration !== null) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || 5000);
      }
    });
  }, [notifications, removeNotification]);

  const handleCreateProject = () => {
    const projectName = `ClipFlow Project ${Date.now()}`;
    createProject(projectName, '16:9');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && currentProject) {
      // Handle file upload logic here
      addNotification({
        type: 'success',
        title: 'Files Ready',
        message: `Selected ${files.length} file(s) for upload`
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Enhanced Header with Back Button */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  ClipFlow AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-Powered Video Editing
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onBackToDashboard} size="sm">
                ← Dashboard
              </Button>
              <Button variant="outline" onClick={onBackToHome} size="sm">
                Home
              </Button>
              {currentProject ? (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {currentProject.name}
                </Badge>
              ) : (
                <Button onClick={handleCreateProject} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              )}
              
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-clips" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              AI Clips
            </TabsTrigger>
            <TabsTrigger value="captions" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Captions
            </TabsTrigger>
            <TabsTrigger value="viral-shorts" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Viral Shorts
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Editor
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {!currentProject ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <Video className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to ClipFlow AI</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first project to start editing with AI-powered features
                  </p>
                  <Button onClick={handleCreateProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Video Preview */}
                <div className="xl:col-span-2">
                  <VideoPreview />
                </div>

                {/* AI Features Dashboard */}
                <div className="space-y-6">
                  <AIFeaturesDashboard />
                </div>
              </div>
            )}
          </TabsContent>

          {/* AI Clips Tab */}
          <TabsContent value="ai-clips">
            <AIClippingPanel />
          </TabsContent>

          {/* Captions Tab */}
          <TabsContent value="captions">
            <HormoziCaptionsPanel />
          </TabsContent>

          {/* Viral Shorts Tab */}
          <TabsContent value="viral-shorts">
            <ViralShortsPanel />
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <ExportSystem />
          </TabsContent>

          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Professional Timeline Editor</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced video editing with multi-track timeline, effects, and precision controls
                  </p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Timeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification System */}
      <AnimatePresence>
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className={`p-4 rounded-lg shadow-lg border max-w-sm ${
                notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-sm opacity-90 mt-1">{notification.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="ml-2 h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* File Upload Input */}
      <input
        type="file"
        multiple
        accept="video/*,audio/*,image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
      />
    </div>
  );
};

export default ClipFlowAI;
