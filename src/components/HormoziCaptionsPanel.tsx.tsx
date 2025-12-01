// Hormozi Captions Generator Component - ClipFlow AI
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Copy, RefreshCw, Target, TrendingUp, Zap, Users, Clock } from 'lucide-react';
import { useVideoStore } from '../store/videoStore';
import { HormoziCaptionSettings, HormoziCaption, TranscriptWord } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';

const HORMOZI_CAPTION_PRESETS = {
  direct: {
    tone: 'direct',
    length: 'medium',
    includeEmoji: false,
    includeHashtags: true,
    ctaType: 'comment',
    targetAudience: 'entrepreneurs'
  },
  urgent: {
    tone: 'urgent',
    length: 'short',
    includeEmoji: true,
    includeHashtags: true,
    ctaType: 'share',
    targetAudience: 'marketers'
  },
  storytelling: {
    tone: 'storytelling',
    length: 'long',
    includeEmoji: false,
    includeHashtags: true,
    ctaType: 'save',
    targetAudience: 'creators'
  },
  curiosity: {
    tone: 'curiosity',
    length: 'medium',
    includeEmoji: true,
    includeHashtags: true,
    ctaType: 'comment',
    targetAudience: 'general'
  }
};

interface HormoziCaptionsPanelProps {
  assetId?: string;
  transcript?: TranscriptWord[];
  className?: string;
}

const HormoziCaptionsPanel: React.FC<HormoziCaptionsPanelProps> = ({
  assetId,
  transcript = [],
  className = ""
}) => {
  const {
    currentProject,
    isAIProcessing,
    generateHormoziCaptions,
    addNotification
  } = useVideoStore();

  const [settings, setSettings] = useState<HormoziCaptionSettings>(HORMOZI_CAPTION_PRESETS.direct);
  const [captions, setCaptions] = useState<HormoziCaption[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>(assetId || '');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Get available assets with transcript data
  const assetsWithTranscript = currentProject?.assets.filter(asset => 
    asset.type === 'video' && asset.aiMetadata?.transcript?.length
  ) || [];

  // Monitor processing progress
  useEffect(() => {
    if (isAIProcessing) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      return () => clearInterval(interval);
    } else {
      setGenerationProgress(0);
    }
  }, [isAIProcessing]);

  const handlePresetChange = (presetName: string) => {
    const preset = HORMOZI_CAPTION_PRESETS[presetName as keyof typeof HORMOZI_CAPTION_PRESETS];
    if (preset) {
      setSettings(preset);
    }
  };

  const handleGenerateCaptions = async () => {
    if (!selectedAsset) {
      addNotification({
        type: 'warning',
        title: 'No Asset Selected',
        message: 'Please select a video asset to generate captions'
      });
      return;
    }

    try {
      const result = await generateHormoziCaptions(selectedAsset, {
        ...settings,
        customPrompt: customPrompt.trim() || undefined
      });
      setCaptions(result);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: 'Failed to generate captions. Please try again.'
      });
    }
  };

  const handleCopyCaption = (caption: HormoziCaption) => {
    const fullText = `${caption.text}\n\n${caption.hashtags.join(' ')}\n\n${caption.ctaText}`;
    navigator.clipboard.writeText(fullText);
    
    addNotification({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Caption has been copied to your clipboard'
    });
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'direct':
        return <Target className="w-4 h-4" />;
      case 'urgent':
        return <Zap className="w-4 h-4" />;
      case 'storytelling':
        return <Users className="w-4 h-4" />;
      case 'controversial':
        return <TrendingUp className="w-4 h-4" />;
      case 'curiosity':
        return <Type className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'direct':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'storytelling':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'controversial':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'curiosity':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!currentProject) {
    return (
      <Card className={`${className} border-dashed`}>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center">
            <Type className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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
          <Type className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Hormozi Captions</h2>
          <p className="text-muted-foreground">
            Generate high-converting captions using Alex Hormozi's copywriting framework
          </p>
        </div>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="captions">Generated Captions</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Selection</CardTitle>
              <CardDescription>
                Choose a video with transcript data to generate captions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a video asset...</option>
                {assetsWithTranscript.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.aiMetadata?.transcript?.length || 0} words)
                  </option>
                ))}
              </select>
              {assetsWithTranscript.length === 0 && (
                <Alert className="mt-4">
                  <Type className="h-4 w-4" />
                  <AlertDescription>
                    No videos with transcript data found. Please upload a video and generate transcript first.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Presets</CardTitle>
              <CardDescription>
                Choose a proven caption style based on Hormozi's frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(HORMOZI_CAPTION_PRESETS).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant={settings.tone === preset.tone ? "default" : "outline"}
                    onClick={() => handlePresetChange(key)}
                    className="h-auto p-4 flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {getToneIcon(preset.tone)}
                      <span className="font-semibold capitalize">{preset.tone}</span>
                    </div>
                    <div className="text-xs text-muted-foreground text-left">
                      {preset.targetAudience} • {preset.length} • {preset.ctaType}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Settings</CardTitle>
              <CardDescription>
                Fine-tune the caption generation for your specific needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tone</label>
                  <Select 
                    value={settings.tone} 
                    onValueChange={(value: any) => setSettings(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct & Bold</SelectItem>
                      <SelectItem value="urgent">Urgent & Actionable</SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="controversial">Controversial</SelectItem>
                      <SelectItem value="curiosity">Curiosity-Driven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Length</label>
                  <Select 
                    value={settings.length} 
                    onValueChange={(value: any) => setSettings(prev => ({ ...prev, length: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                      <SelectItem value="medium">Medium (3-4 sentences)</SelectItem>
                      <SelectItem value="long">Long (5+ sentences)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Audience</label>
                  <Select 
                    value={settings.targetAudience} 
                    onValueChange={(value: any) => setSettings(prev => ({ ...prev, targetAudience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrepreneurs">Entrepreneurs</SelectItem>
                      <SelectItem value="marketers">Marketers</SelectItem>
                      <SelectItem value="creators">Content Creators</SelectItem>
                      <SelectItem value="general">General Audience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">CTA Type</label>
                  <Select 
                    value={settings.ctaType} 
                    onValueChange={(value: any) => setSettings(prev => ({ ...prev, ctaType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link Click</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="share">Share</SelectItem>
                      <SelectItem value="save">Save</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Include Emojis</label>
                    <p className="text-xs text-muted-foreground">
                      Add relevant emojis to increase engagement
                    </p>
                  </div>
                  <Switch
                    checked={settings.includeEmoji}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, includeEmoji: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Include Hashtags</label>
                    <p className="text-xs text-muted-foreground">
                      Generate relevant hashtags for discoverability
                    </p>
                  </div>
                  <Switch
                    checked={settings.includeHashtags}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, includeHashtags: checked }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Custom Prompt (Optional)
                </label>
                <Textarea
                  placeholder="Add specific instructions or focus areas for the captions..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Generation Button */}
          <Button
            onClick={handleGenerateCaptions}
            disabled={!selectedAsset || isAIProcessing}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isAIProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating Captions...
              </>
            ) : (
              <>
                <Type className="w-5 h-5 mr-2" />
                Generate Hormozi Captions
              </>
            )}
          </Button>

          {/* Processing Progress */}
          {isAIProcessing && (
            <Card className="border-primary/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analyzing transcript content</span>
                    <span className="text-primary font-medium">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Applying Hormozi's copywriting frameworks...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Captions Tab */}
        <TabsContent value="captions" className="space-y-4">
          {captions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Type className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No captions generated yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate captions to see AI-powered results
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {captions.map((caption, index) => (
                <motion.div
                  key={caption.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getToneIcon(caption.tone)}
                          <div>
                            <CardTitle className="text-lg">
                              Caption {index + 1}
                            </CardTitle>
                            <CardDescription>
                              Generated {formatDate(caption.createdAt)}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getToneColor(caption.tone)}>
                            {caption.tone}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span className={getViralScoreColor(caption.viralPotential)}>
                              {caption.viralPotential}%
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Main Caption Text */}
                      <div className="bg-background p-4 rounded-lg border">
                        <p className="text-foreground leading-relaxed">
                          {caption.text}
                        </p>
                      </div>

                      {/* Hashtags */}
                      {caption.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {caption.hashtags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Call to Action</span>
                        </div>
                        <p className="text-sm text-foreground">{caption.ctaText}</p>
                      </div>

                      {/* Engagement Metrics */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>Engagement Score: </span>
                          <span className={getViralScoreColor(caption.engagementScore)}>
                            {caption.engagementScore}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-muted-foreground" />
                          <span>Viral Potential: </span>
                          <span className={getViralScoreColor(caption.viralPotential)}>
                            {caption.viralPotential}%
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopyCaption(caption)}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Caption
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Hormozi Caption Templates</CardTitle>
              <CardDescription>
                Proven templates based on Alex Hormozi's $100M copywriting frameworks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Type className="h-4 w-4" />
                <AlertDescription>
                  Templates will be available to help you understand the structure of high-converting captions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HormoziCaptionsPanel;