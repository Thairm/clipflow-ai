// Viral Shorts Creator Component - ClipFlow AI
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Smartphone, 
  Youtube, 
  Instagram, 
  Download, 
  Play, 
  Plus, 
  Clock, 
  TrendingUp,
  Scissors,
  Type,
  Music,
  Palette,
  Settings
} from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import { 
  ViralShortsSettings, 
  ViralShortProject, 
  ViralShortClip, 
  TextOverlay,
  Transition,
  ExportSettings 
} from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';

const PLATFORM_PRESETS = {
  tiktok: {
    targetPlatform: 'tiktok' as const,
    verticalFormat: true,
    maxDuration: 60,
    includeTextOverlays: true,
    autoTrim: true,
    optimizeFor: 'viral' as const
  },
  youtube_shorts: {
    targetPlatform: 'youtube_shorts' as const,
    verticalFormat: true,
    maxDuration: 60,
    includeTextOverlays: true,
    autoTrim: false,
    optimizeFor: 'retention' as const
  },
  instagram_reels: {
    targetPlatform: 'instagram_reels' as const,
    verticalFormat: true,
    maxDuration: 90,
    includeTextOverlays: true,
    autoTrim: true,
    optimizeFor: 'viral' as const
  },
  all: {
    targetPlatform: 'all' as const,
    verticalFormat: true,
    maxDuration: 60,
    includeTextOverlays: true,
    autoTrim: true,
    optimizeFor: 'viral' as const
  }
};

interface ViralShortsPanelProps {
  className?: string;
}

const ViralShortsPanel: React.FC<ViralShortsPanelProps> = ({ className = "" }) => {
  const {
    currentProject,
    viralShortProjects,
    isAIProcessing,
    createViralShort,
    addNotification,
    updateProject
  } = useVideoStore();

  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PLATFORM_PRESETS>('tiktok');
  const [settings, setSettings] = useState<ViralShortsSettings>(PLATFORM_PRESETS.tiktok);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'mp4',
    quality: '1080p',
    fps: 30,
    codec: 'h264',
    audioCodec: 'aac',
    audioBitrate: 128,
    optimizeFor: 'quality'
  });
  const [projectName, setProjectName] = useState<string>('');
  const [creationProgress, setCreationProgress] = useState(0);

  // Available video assets from current project
  const videoAssets = currentProject?.assets.filter(asset => asset.type === 'video') || [];

  // Monitor creation progress
  useEffect(() => {
    if (isAIProcessing) {
      const interval = setInterval(() => {
        setCreationProgress(prev => Math.min(prev + 12, 95));
      }, 400);

      return () => clearInterval(interval);
    } else {
      setCreationProgress(0);
    }
  }, [isAIProcessing]);

  const handlePresetChange = (presetName: keyof typeof PLATFORM_PRESETS) => {
    const preset = PLATFORM_PRESETS[presetName];
    if (preset) {
      setSelectedPreset(presetName);
      setSettings(preset);
      
      // Adjust export settings based on platform
      if (presetName === 'tiktok') {
        setExportSettings(prev => ({
          ...prev,
          quality: '1080p',
          fps: 30
        }));
      } else if (presetName === 'youtube_shorts') {
        setExportSettings(prev => ({
          ...prev,
          quality: '1080p',
          fps: 60
        }));
      }
    }
  };

  const handleCreateViralShort = async () => {
    if (!currentProject) {
      addNotification({
        type: 'error',
        title: 'No Project',
        message: 'Please create or load a project first'
      });
      return;
    }

    if (videoAssets.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Video Assets',
        message: 'Please add video assets to your project first'
      });
      return;
    }

    const name = projectName.trim() || `Viral Short ${Date.now()}`;

    try {
      await createViralShort(currentProject.id, {
        settings,
        exportSettings,
        name
      });

      setProjectName('');
      addNotification({
        type: 'success',
        title: 'Viral Short Created',
        message: `${name} has been created successfully`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create viral short. Please try again.'
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return <Smartphone className="w-5 h-5" />;
      case 'youtube_shorts':
        return <Youtube className="w-5 h-5" />;
      case 'instagram_reels':
        return <Instagram className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'youtube_shorts':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'instagram_reels':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getOptimizationIcon = (optimization: string) => {
    switch (optimization) {
      case 'viral':
        return <TrendingUp className="w-4 h-4" />;
      case 'retention':
        return <Clock className="w-4 h-4" />;
      case 'conversion':
        return <Zap className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentProject) {
    return (
      <Card className={`${className} border-dashed`}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No project loaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Viral Shorts Creator</h2>
          <p className="text-muted-foreground">
            Transform your content into viral short-form videos optimized for social platforms
          </p>
        </div>
      </div>

      <Tabs defaultValue="creator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creator">Creator</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Creator Tab */}
        <TabsContent value="creator" className="space-y-6">
          {/* Platform Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Selection</CardTitle>
              <CardDescription>
                Choose your target platform for optimized viral short creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(PLATFORM_PRESETS).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant={selectedPreset === key ? "default" : "outline"}
                    onClick={() => handlePresetChange(key as keyof typeof PLATFORM_PRESETS)}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(preset.targetPlatform)}
                      <span className="font-semibold capitalize">
                        {preset.targetPlatform.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground text-left">
                      {preset.maxDuration}s • {preset.verticalFormat ? 'Vertical' : 'Horizontal'}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Project Configuration</CardTitle>
              <CardDescription>
                Configure your viral short project settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter a name for your viral short project"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={settings.maxDuration}
                    onChange={(e) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        maxDuration: parseInt(e.target.value) || 60 
                      }))
                    }
                    min={15}
                    max={300}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Optimization Goal</Label>
                  <Select 
                    value={settings.optimizeFor} 
                    onValueChange={(value: any) => 
                      setSettings(prev => ({ ...prev, optimizeFor: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viral">Viral Potential</SelectItem>
                      <SelectItem value="retention">Viewer Retention</SelectItem>
                      <SelectItem value="conversion">Conversion Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Vertical Format</Label>
                    <p className="text-xs text-muted-foreground">
                      Optimize for mobile viewing (9:16 aspect ratio)
                    </p>
                  </div>
                  <Switch
                    checked={settings.verticalFormat}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, verticalFormat: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include Text Overlays</Label>
                    <p className="text-xs text-muted-foreground">
                      Add AI-generated text overlays for engagement
                    </p>
                  </div>
                  <Switch
                    checked={settings.includeTextOverlays}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, includeTextOverlays: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Trim</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically trim content to optimal length
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoTrim}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, autoTrim: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
              <CardDescription>
                Configure output settings for your viral short
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Format</Label>
                  <Select 
                    value={exportSettings.format} 
                    onValueChange={(value: any) => 
                      setExportSettings(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quality</Label>
                  <Select 
                    value={exportSettings.quality} 
                    onValueChange={(value: any) => 
                      setExportSettings(prev => ({ ...prev, quality: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>FPS</Label>
                  <Select 
                    value={exportSettings.fps.toString()} 
                    onValueChange={(value) => 
                      setExportSettings(prev => ({ ...prev, fps: parseInt(value) as any }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Button */}
          <Button
            onClick={handleCreateViralShort}
            disabled={isAIProcessing || videoAssets.length === 0}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isAIProcessing ? (
              <>
                <Scissors className="w-5 h-5 mr-2 animate-pulse" />
                Creating Viral Short...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Create Viral Short
              </>
            )}
          </Button>

          {/* Processing Progress */}
          {isAIProcessing && (
            <Card className="border-primary/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Optimizing for viral potential</span>
                    <span className="text-primary font-medium">{creationProgress}%</span>
                  </div>
                  <Progress value={creationProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    AI is analyzing your content and creating optimized clips...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platform Requirements */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary">Platform Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-pink-400" />
                    <span className="font-medium">TikTok</span>
                  </div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 9:16 aspect ratio</li>
                    <li>• Max 60 seconds</li>
                    <li>• 1080p recommended</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span className="font-medium">YouTube Shorts</span>
                  </div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 9:16 aspect ratio</li>
                    <li>• Max 60 seconds</li>
                    <li>• 60fps preferred</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-purple-400" />
                    <span className="font-medium">Instagram Reels</span>
                  </div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• 9:16 aspect ratio</li>
                    <li>• Max 90 seconds</li>
                    <li>• 1080p recommended</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {viralShortProjects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No viral short projects yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first viral short to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {viralShortProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {getPlatformIcon(project.settings.targetPlatform)}
                            {project.name}
                          </CardTitle>
                          <CardDescription>
                            Created {new Intl.DateTimeFormat('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(project.createdAt)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPlatformColor(project.settings.targetPlatform)}>
                            {project.settings.targetPlatform.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getOptimizationIcon(project.settings.optimizeFor)}
                            {project.settings.optimizeFor}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="ml-2 font-medium">
                            {formatDuration(project.settings.maxDuration)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Format:</span>
                          <span className="ml-2 font-medium">
                            {project.exportSettings.quality} {project.exportSettings.fps}fps
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clips:</span>
                          <span className="ml-2 font-medium">{project.clips.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vertical:</span>
                          <span className="ml-2 font-medium">
                            {project.settings.verticalFormat ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Play className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
              <CardDescription>
                Configure default settings for viral short creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Advanced settings for viral short creation will be available here.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViralShortsPanel;