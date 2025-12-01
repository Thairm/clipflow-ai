// Export System Component - ClipFlow AI
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Settings, 
  Play, 
  FileVideo, 
  Monitor, 
  Smartphone, 
  Tablet,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  HardDrive,
  Wifi,
  Zap
} from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import { ExportSettings, ExportProgress, Project } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';

const EXPORT_PRESETS = {
  web: {
    name: 'Web Optimized',
    format: 'mp4' as const,
    quality: '1080p' as const,
    fps: 30,
    codec: 'h264' as const,
    audioCodec: 'aac' as const,
    audioBitrate: 128,
    optimizeFor: 'speed' as const
  },
  mobile: {
    name: 'Mobile Social',
    format: 'mp4' as const,
    quality: '720p' as const,
    fps: 30,
    codec: 'h264' as const,
    audioCodec: 'aac' as const,
    audioBitrate: 96,
    optimizeFor: 'size' as const
  },
  high_quality: {
    name: 'High Quality',
    format: 'mp4' as const,
    quality: '4k' as const,
    fps: 60,
    codec: 'h265' as const,
    audioCodec: 'aac' as const,
    audioBitrate: 256,
    optimizeFor: 'quality' as const
  },
  streaming: {
    name: 'Streaming Ready',
    format: 'mp4' as const,
    quality: '1080p' as const,
    fps: 60,
    codec: 'h264' as const,
    audioCodec: 'aac' as const,
    audioBitrate: 192,
    optimizeFor: 'speed' as const
  }
};

const FORMAT_INFO = {
  mp4: { name: 'MP4', description: 'Most compatible, great for web and social', icon: FileVideo },
  mov: { name: 'MOV', description: 'High quality, preferred by creators', icon: FileVideo },
  avi: { name: 'AVI', description: 'Legacy format, large file size', icon: FileVideo },
  webm: { name: 'WebM', description: 'Open source, optimized for web', icon: FileVideo },
  mkv: { name: 'MKV', description: 'Supports multiple audio/subtitle tracks', icon: FileVideo }
};

const QUALITY_INFO = {
  '480p': { 
    name: '480p SD', 
    resolution: '854×480', 
    size: 'Small (~200MB/hour)',
    icon: Monitor,
    useCase: 'Social media, quick sharing'
  },
  '720p': { 
    name: '720p HD', 
    resolution: '1280×720', 
    size: 'Medium (~500MB/hour)',
    icon: Tablet,
    useCase: 'YouTube, presentations'
  },
  '1080p': { 
    name: '1080p Full HD', 
    resolution: '1920×1080', 
    size: 'Large (~1GB/hour)',
    icon: Monitor,
    useCase: 'Professional content, streaming'
  },
  '4k': { 
    name: '4K Ultra HD', 
    resolution: '3840×2160', 
    size: 'Very Large (~3GB/hour)',
    icon: Monitor,
    useCase: 'Professional production, cinema'
  }
};

interface ExportSystemProps {
  className?: string;
}

const ExportSystem: React.FC<ExportSystemProps> = ({ className = "" }) => {
  const {
    currentProject,
    exportProgress,
    exportQueue,
    startExport,
    cancelExport,
    addNotification
  } = useVideoStore();

  // @ts-ignore - Type mismatch in preset fps
  const [exportSettings, setExportSettings] = useState<ExportSettings>(EXPORT_PRESETS.web);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof EXPORT_PRESETS>('web');
  const [filename, setFilename] = useState<string>('');
  const [customBitrate, setCustomBitrate] = useState<number>(0);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState<string>('ClipFlow AI');
  const [estimatedSize, setEstimatedSize] = useState<string>('0 MB');

  // Calculate estimated file size based on settings
  useEffect(() => {
    if (currentProject && exportSettings) {
      const duration = currentProject.duration; // in seconds
      const qualityMultiplier = {
        '480p': 0.5,
        '720p': 1,
        '1080p': 2,
        '4k': 8
      }[exportSettings.quality];
      
      const baseSizePerHour = 1000; // MB per hour for 720p
      const sizeMB = (duration / 3600) * baseSizePerHour * qualityMultiplier;
      
      if (sizeMB > 1024) {
        setEstimatedSize(`${(sizeMB / 1024).toFixed(1)} GB`);
      } else {
        setEstimatedSize(`${sizeMB.toFixed(0)} MB`);
      }
    }
  }, [currentProject, exportSettings]);

  // Auto-generate filename
  useEffect(() => {
    if (currentProject && !filename) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      setFilename(`${currentProject.name}_${timestamp}.${exportSettings.format}`);
    }
  }, [currentProject, exportSettings.format, filename]);

  const handlePresetChange = (presetKey: keyof typeof EXPORT_PRESETS) => {
    const preset = EXPORT_PRESETS[presetKey];
    if (preset) {
      setSelectedPreset(presetKey);
      // @ts-ignore - Type mismatch in preset fps
      setExportSettings(preset);
    }
  };

  const handleExport = async () => {
    if (!currentProject) {
      addNotification({
        type: 'error',
        title: 'No Project',
        message: 'Please create or load a project first'
      });
      return;
    }

    if (!filename.trim()) {
      addNotification({
        type: 'warning',
        title: 'Filename Required',
        message: 'Please enter a filename for the export'
      });
      return;
    }

    const settings = {
      ...exportSettings,
      watermark: watermarkEnabled ? {
        text: watermarkText,
        position: 'bottom-right' as const,
        opacity: 0.7,
        size: 'small' as const
      } : undefined
    };

    try {
      const exportId = await startExport(currentProject.id, settings);
      addNotification({
        type: 'info',
        title: 'Export Started',
        message: `Export "${filename}" has been started`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to start export. Please try again.'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'preparing':
      case 'encoding':
      case 'finalizing':
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'preparing':
      case 'encoding':
      case 'finalizing':
      case 'uploading':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentProject) {
    return (
      <Card className={`${className} border-dashed`}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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
          <Download className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Export System</h2>
          <p className="text-muted-foreground">
            Export your project in multiple formats and quality settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="watermark">Watermark</TabsTrigger>
            </TabsList>

            {/* Basic Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              {/* Export Presets */}
              <Card>
                <CardHeader>
                  <CardTitle>Export Presets</CardTitle>
                  <CardDescription>
                    Choose a preset optimized for your target platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(EXPORT_PRESETS).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant={selectedPreset === key ? "default" : "outline"}
                        onClick={() => handlePresetChange(key as keyof typeof EXPORT_PRESETS)}
                        className="h-auto p-4 flex flex-col items-start gap-2"
                      >
                        <div className="font-semibold">{preset.name}</div>
                        <div className="text-xs text-muted-foreground text-left">
                          {preset.quality} • {preset.format.toUpperCase()} • {preset.fps}fps
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Format Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Format & Quality</CardTitle>
                  <CardDescription>
                    Select output format and quality settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                          {Object.entries(FORMAT_INFO).map(([key, info]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <info.icon className="w-4 h-4" />
                                <div>
                                  <div className="font-medium">{info.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {info.description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
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
                          {Object.entries(QUALITY_INFO).map(([key, info]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <info.icon className="w-4 h-4" />
                                <div>
                                  <div className="font-medium">{info.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {info.resolution} • {info.size}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Frame Rate</Label>
                      <Select 
                        value={exportSettings.fps.toString()} 
                        onValueChange={(value) => 
                          setExportSettings(prev => ({ 
                            ...prev, 
                            fps: parseInt(value) as any 
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 FPS (Cinematic)</SelectItem>
                          <SelectItem value="30">30 FPS (Standard)</SelectItem>
                          <SelectItem value="60">60 FPS (Smooth)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Optimization</Label>
                      <Select 
                        value={exportSettings.optimizeFor} 
                        onValueChange={(value: any) => 
                          setExportSettings(prev => ({ ...prev, optimizeFor: value }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="speed">Speed (Faster export)</SelectItem>
                          <SelectItem value="quality">Quality (Best results)</SelectItem>
                          <SelectItem value="size">Size (Smaller file)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filename */}
              <Card>
                <CardHeader>
                  <CardTitle>Filename</CardTitle>
                  <CardDescription>
                    Choose a name for your exported video
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="Enter filename..."
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audio Settings</CardTitle>
                  <CardDescription>
                    Configure audio encoding and quality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Audio Codec</Label>
                      <Select 
                        value={exportSettings.audioCodec} 
                        onValueChange={(value: any) => 
                          setExportSettings(prev => ({ ...prev, audioCodec: value }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aac">AAC (Recommended)</SelectItem>
                          <SelectItem value="mp3">MP3</SelectItem>
                          <SelectItem value="opus">Opus (WebM only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Audio Bitrate (kbps)</Label>
                      <Input
                        type="number"
                        value={exportSettings.audioBitrate}
                        onChange={(e) => 
                          setExportSettings(prev => ({ 
                            ...prev, 
                            audioBitrate: parseInt(e.target.value) || 128 
                          }))
                        }
                        min={64}
                        max={512}
                        step={32}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Video Codec</CardTitle>
                  <CardDescription>
                    Advanced video encoding settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Video Codec</Label>
                    <Select 
                      value={exportSettings.codec} 
                      onValueChange={(value: any) => 
                        setExportSettings(prev => ({ ...prev, codec: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="h264">H.264 (AVC) - Most compatible</SelectItem>
                        <SelectItem value="h265">H.265 (HEVC) - Better compression</SelectItem>
                        <SelectItem value="vp9">VP9 - WebM format</SelectItem>
                        <SelectItem value="av1">AV1 - Next-gen compression</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Watermark Tab */}
            <TabsContent value="watermark" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Watermark Settings</CardTitle>
                  <CardDescription>
                    Add a watermark to your exported video
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Watermark</Label>
                      <p className="text-xs text-muted-foreground">
                        Add ClipFlow AI watermark to your video
                      </p>
                    </div>
                    <Switch
                      checked={watermarkEnabled}
                      onCheckedChange={setWatermarkEnabled}
                    />
                  </div>

                  {watermarkEnabled && (
                    <>
                      <div>
                        <Label>Watermark Text</Label>
                        <Input
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="Enter watermark text..."
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Export Queue & Progress */}
        <div className="space-y-6">
          {/* Export Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <div className="font-medium">{formatTime(currentProject.duration)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Size:</span>
                  <div className="font-medium">{estimatedSize}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality:</span>
                  <div className="font-medium">{QUALITY_INFO[exportSettings.quality]?.name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <div className="font-medium">{exportSettings.format.toUpperCase()}</div>
                </div>
              </div>

              <Button
                onClick={handleExport}
                disabled={exportProgress !== null}
                className="w-full"
                size="lg"
              >
                {exportProgress ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Start Export
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Export Progress */}
          {exportProgress && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(exportProgress.status)}
                  Export Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={getStatusColor(exportProgress.status)}>
                      {exportProgress.currentStep}
                    </span>
                    <span className="text-primary font-medium">
                      {exportProgress.progress}%
                    </span>
                  </div>
                  <Progress value={exportProgress.progress} className="w-full" />
                </div>

                {exportProgress.estimatedTimeRemaining > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Estimated time remaining: {formatTime(exportProgress.estimatedTimeRemaining)}
                  </div>
                )}

                <Button
                  onClick={() => cancelExport(exportProgress.id)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Cancel Export
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Export Queue */}
          {exportQueue.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Export Queue</CardTitle>
                <CardDescription>
                  {exportQueue.length} export{exportQueue.length !== 1 ? 's' : ''} in queue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exportQueue.map((exportItem) => (
                    <div
                      key={exportItem.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(exportItem.status)}
                        <div>
                          <div className="font-medium text-sm">Export {exportItem.id.slice(-4)}</div>
                          <div className="text-xs text-muted-foreground">
                            {exportItem.currentStep}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{exportItem.progress}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platform Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-medium">TikTok/Instagram</span>
                </div>
                <div className="text-xs text-muted-foreground ml-6">
                  MP4, 720p-1080p, 30fps, small file size
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium">YouTube</span>
                </div>
                <div className="text-xs text-muted-foreground ml-6">
                  MP4, 1080p+, 30-60fps, good quality
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Web/Streaming</span>
                </div>
                <div className="text-xs text-muted-foreground ml-6">
                  MP4/WebM, 1080p, fast encoding
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExportSystem;
