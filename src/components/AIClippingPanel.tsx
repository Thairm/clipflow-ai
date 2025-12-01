// AI Auto Clipping Component - ClipFlow AI
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Play, Plus, Clock, TrendingUp, Brain, Loader2 } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import { AutoClipSettings, SuggestedClip, AutoClipResult } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

const AI_AUTOCLIPPING_CONFIG = {
  minClipLength: 15,
  maxClipLength: 120,
  sensitivity: 7,
  prioritizeViral: true,
  includeCaptions: true,
  generateThumbnails: true
};

interface AIClippingPanelProps {
  assetId?: string;
  className?: string;
}

const AIClippingPanel: React.FC<AIClippingPanelProps> = ({ 
  assetId, 
  className = "" 
}) => {
  const {
    currentProject,
    isAIProcessing,
    currentProcessingJob,
    generateAutoClips,
    addClip,
    addNotification
  } = useVideoStore();

  const [settings, setSettings] = useState<AutoClipSettings>(AI_AUTOCLIPPING_CONFIG);
  const [results, setResults] = useState<AutoClipResult[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>(assetId || '');
  const [processingProgress, setProcessingProgress] = useState(0);

  // Get available video assets
  const videoAssets = currentProject?.assets.filter(asset => asset.type === 'video') || [];

  // Monitor processing progress
  useEffect(() => {
    if (currentProcessingJob?.type === 'auto_clip') {
      const interval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 95));
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProcessingProgress(0);
    }
  }, [currentProcessingJob]);

  const handleGenerateClips = async () => {
    if (!selectedAsset) {
      addNotification({
        type: 'warning',
        title: 'No Asset Selected',
        message: 'Please select a video asset to analyze'
      });
      return;
    }

    try {
      const result = await generateAutoClips(selectedAsset, settings);
      setResults(prev => [result, ...prev]);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: 'Failed to generate auto clips. Please try again.'
      });
    }
  };

  const handleAddToTimeline = (clip: SuggestedClip, trackId?: string) => {
    const defaultTrack = currentProject?.tracks.find(t => t.type === 'video')?.id;
    const targetTrackId = trackId || defaultTrack;
    
    if (!targetTrackId) {
      addNotification({
        type: 'error',
        title: 'No Track Available',
        message: 'Please create a video track first'
      });
      return;
    }

    try {
      addClip(
        targetTrackId,
        selectedAsset,
        clip.startTime,
        clip.endTime
      );

      addNotification({
        type: 'success',
        title: 'Clip Added',
        message: `Clip "${clip.title}" has been added to timeline`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Add Clip',
        message: 'Could not add clip to timeline'
      });
    }
  };

  const getClipTypeIcon = (type: string) => {
    switch (type) {
      case 'highlight':
        return <TrendingUp className="w-4 h-4" />;
      case 'jump_scare':
        return <Brain className="w-4 h-4" />;
      case 'call_to_action':
        return <Plus className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getClipTypeColor = (type: string) => {
    switch (type) {
      case 'highlight':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'jump_scare':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'call_to_action':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'emotional_peak':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'funny_moment':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentProject) {
    return (
      <Card className={`${className} border-dashed`}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <Wand2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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
          <Wand2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Auto Clipping</h2>
          <p className="text-muted-foreground">
            Automatically detect and extract the most engaging moments
          </p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Selection</CardTitle>
              <CardDescription>
                Choose the video to analyze for potential clips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a video asset...</option>
                {videoAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({Math.round(asset.duration || 0)}s)
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clipping Settings</CardTitle>
              <CardDescription>
                Configure how AI should analyze and clip your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sensitivity: {settings.sensitivity}/10
                </label>
                <Slider
                  value={[settings.sensitivity]}
                  onValueChange={([value]) => 
                    setSettings(prev => ({ ...prev, sensitivity: value }))
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher values detect more potential clips
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Min Clip Length (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.minClipLength}
                    onChange={(e) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        minClipLength: parseInt(e.target.value) || 15 
                      }))
                    }
                    min={5}
                    max={60}
                    className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Clip Length (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.maxClipLength}
                    onChange={(e) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        maxClipLength: parseInt(e.target.value) || 120 
                      }))
                    }
                    min={30}
                    max={300}
                    className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Prioritize Viral Content</label>
                    <p className="text-xs text-muted-foreground">
                      Focus on clips with high viral potential
                    </p>
                  </div>
                  <Switch
                    checked={settings.prioritizeViral}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, prioritizeViral: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Include Captions</label>
                    <p className="text-xs text-muted-foreground">
                      Generate captions for detected clips
                    </p>
                  </div>
                  <Switch
                    checked={settings.includeCaptions}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, includeCaptions: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Generate Thumbnails</label>
                    <p className="text-xs text-muted-foreground">
                      Create preview thumbnails for clips
                    </p>
                  </div>
                  <Switch
                    checked={settings.generateThumbnails}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, generateThumbnails: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Button */}
          <Button
            onClick={handleGenerateClips}
            disabled={!selectedAsset || isAIProcessing}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isAIProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Content...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Auto Clips
              </>
            )}
          </Button>

          {/* Processing Progress */}
          {isAIProcessing && (
            <Card className="border-primary/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analyzing video content</span>
                    <span className="text-primary font-medium">{processingProgress}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${processingProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI is identifying the most engaging moments...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          {results.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No clips generated yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate clips to see AI suggestions
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {results.map((result, resultIndex) => (
                <motion.div
                  key={resultIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: resultIndex * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            Generated Clips
                          </CardTitle>
                          <CardDescription>
                            {result.clips.length} clips found • {result.processingTime.toFixed(1)}s processing • {Math.round(result.confidence * 100)}% confidence
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {result.totalAnalyzed}s analyzed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.clips.map((clip, clipIndex) => (
                          <Card key={clip.id} className="border-border/50">
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getClipTypeIcon(clip.clipType)}
                                    <h4 className="font-semibold">{clip.title}</h4>
                                    <Badge 
                                      className={`text-xs ${getClipTypeColor(clip.clipType)}`}
                                    >
                                      {clip.clipType.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {clip.description}
                                  </p>
                                  
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatTimestamp(clip.startTime)} - {formatTimestamp(clip.endTime)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      {clip.viralScore}% viral score
                                    </span>
                                    <span>
                                      {Math.round(clip.confidence * 100)}% confidence
                                    </span>
                                  </div>
                                  
                                  {clip.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {clip.hashtags.map((tag, tagIndex) => (
                                        <Badge 
                                          key={tagIndex} 
                                          variant="outline" 
                                          className="text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToTimeline(clip)}
                                    className="min-w-0 px-3"
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add to Timeline
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="min-w-0 px-3"
                                  >
                                    <Play className="w-4 h-4 mr-1" />
                                    Preview
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
              <CardDescription>
                View previously generated auto clips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  Generation history will be available after you create your first clips.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIClippingPanel;
