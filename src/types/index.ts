// Enhanced AI-Powered Types for ClipFlow AI
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export interface TranscriptWord {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  speakerId?: string;
  confidence: number; // 0-1, speech recognition confidence
  emotion?: 'neutral' | 'excited' | 'calm' | 'urgent' | 'confident';
  emphasis?: boolean;
}

export interface AISummary {
  id: string;
  viralScore: number; // 0-100, AI-calculated viral potential
  suggestedClips: SuggestedClip[];
  summary: string;
  keyMoments: KeyMoment[];
  audienceEngagement: EngagementData;
  conversionOpportunities: ConversionOpportunity[];
  generatedAt: Date;
  model: string; // AI model used for generation
}

export interface SuggestedClip {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  description: string;
  viralScore: number;
  clipType: 'highlight' | 'jump_scare' | 'call_to_action' | 'emotional_peak' | 'funny_moment';
  confidence: number;
  hashtags: string[];
  thumbnailUrl?: string;
}

export interface KeyMoment {
  timestamp: number;
  type: 'laugh' | 'shock' | 'insight' | 'question' | 'statistic' | 'story';
  description: string;
  importance: number; // 1-10
  potentialHook: string;
}

export interface EngagementData {
  predictedRetention: number; // percentage
  peakAttentionPoints: number[];
  dropOffRisks: number[];
  optimalClipLength: number; // seconds
}

export interface ConversionOpportunity {
  timestamp: number;
  type: 'cta' | 'urgency' | 'value_prop' | 'social_proof';
  text: string;
  confidence: number;
  expectedCVR: number; // conversion rate
}

// AI Auto Clipping Types
export interface AutoClipSettings {
  minClipLength: number; // seconds
  maxClipLength: number; // seconds
  sensitivity: number; // 1-10, higher = more clips
  prioritizeViral: boolean;
  includeCaptions: boolean;
  generateThumbnails: boolean;
}

export interface AutoClipResult {
  clips: SuggestedClip[];
  processingTime: number;
  totalAnalyzed: number; // seconds
  confidence: number;
}

// Hormozi Caption Types
export interface HormoziCaptionSettings {
  tone: 'direct' | 'urgent' | 'storytelling' | 'controversial' | 'curiosity';
  length: 'short' | 'medium' | 'long';
  includeEmoji: boolean;
  includeHashtags: boolean;
  ctaType: 'link' | 'comment' | 'share' | 'save';
  targetAudience: 'entrepreneurs' | 'marketers' | 'creators' | 'general';
}

export interface HormoziCaption {
  id: string;
  text: string;
  hashtags: string[];
  tone: string;
  ctaText: string;
  engagementScore: number;
  viralPotential: number;
  createdAt: Date;
}

// Viral Shorts Types
export interface ViralShortsSettings {
  targetPlatform: 'tiktok' | 'youtube_shorts' | 'instagram_reels' | 'all';
  verticalFormat: boolean;
  maxDuration: number; // seconds
  includeTextOverlays: boolean;
  autoTrim: boolean;
  optimizeFor: 'retention' | 'viral' | 'conversion';
}

export interface ViralShortProject {
  id: string;
  name: string;
  sourceVideoId: string;
  clips: ViralShortClip[];
  settings: ViralShortsSettings;
  exportSettings: ExportSettings;
  createdAt: Date;
  thumbnailUrls: string[];
}

export interface ViralShortClip {
  id: string;
  startTime: number;
  endTime: number;
  order: number;
  textOverlays: TextOverlay[];
  transitions: Transition[];
  audioLevel: number;
  thumbnailUrl?: string;
}

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  style: TextStyle;
  animation: TextAnimation;
}

export interface Transition {
  type: 'fade' | 'slide' | 'zoom' | 'cut';
  duration: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

// Enhanced TextStyle and Animation Types
export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  fontWeight: 'normal' | 'bold' | 'bolder';
  textAlign: 'left' | 'center' | 'right';
  padding: number;
  borderRadius: number;
  stroke?: {
    color: string;
    width: number;
  };
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface TextAnimation {
  type: 'pop' | 'fade' | 'slide' | 'pulse' | 'wiggle' | 'typewriter' | 'bounce';
  duration: number;
  delay: number;
  easing: string;
}

// Export and Multi-format Support
export interface ExportSettings {
  format: 'mp4' | 'mov' | 'avi' | 'webm' | 'mkv';
  quality: '480p' | '720p' | '1080p' | '4k';
  bitrate?: number; // Custom bitrate if needed
  fps: 24 | 30 | 60;
  codec: 'h264' | 'h265' | 'vp9' | 'av1';
  audioCodec: 'aac' | 'mp3' | 'opus';
  audioBitrate: number;
  optimizeFor: 'size' | 'quality' | 'speed';
  watermark?: WatermarkSettings;
}

export interface WatermarkSettings {
  text?: string;
  imageUrl?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number; // 0-1
  size: 'small' | 'medium' | 'large';
}

export interface ExportProgress {
  id: string;
  projectId: string;
  status: 'preparing' | 'encoding' | 'finalizing' | 'uploading' | 'completed' | 'error';
  progress: number; // 0-100
  currentStep: string;
  estimatedTimeRemaining: number; // seconds
  outputUrl?: string;
  error?: string;
}

// Enhanced Project and Asset Types
export interface ProjectAsset {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image' | 'text' | 'ai_generated';
  filePath: string;
  fileSize: number;
  duration?: number; // for video/audio
  dimensions?: { width: number; height: number };
  format: string;
  metadata: Record<string, any>;
  aiMetadata?: {
    transcript?: TranscriptWord[];
    summaries?: AISummary[];
    captions?: HormoziCaption[];
    viralScore?: number;
    tags?: string[];
  };
  uploadedAt: Date;
  lastModified: Date;
}

export interface TimelineClip {
  id: string;
  assetId: string;
  startTime: number;
  endTime: number;
  trackId: string;
  volume?: number;
  speed?: number; // 0.5x, 1x, 1.5x, 2x
  effects: Effect[];
  locked?: boolean;
  muted?: boolean;
  color?: string;
  name?: string;
  thumbnails?: string[]; // Generated thumbnail URLs
  waveformData?: number[]; // For audio visualization
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'overlay';
  clips: TimelineClip[];
  locked?: boolean;
  muted?: boolean;
  visible?: boolean;
  height?: number;
  color?: string;
}

export interface Effect {
  id: string;
  type: 'color_correction' | 'blur' | 'brightness' | 'contrast' | 'saturation' | 'vignette' | 'chroma_key';
  intensity: number;
  parameters: Record<string, any>;
  startTime?: number;
  endTime?: number;
}

// AI Processing Types
export interface AIProcessingJob {
  id: string;
  type: 'auto_clip' | 'generate_captions' | 'analyze_viral' | 'transcribe' | 'summarize';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  input: any;
  output?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  estimatedTimeRemaining?: number;
}

// Web Worker Types
export interface WorkerMessage {
  id: string;
  type: string;
  data: any;
}

export interface WorkerResponse {
  id: string;
  type: string;
  success: boolean;
  data?: any;
  error?: string;
}

// Performance and Memory Management
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number; // MB
  fps: number;
  droppedFrames: number;
  bufferSize: number;
  networkUsage?: number; // KB/s
  lastUpdated: Date;
}

export interface MemoryManager {
  cacheSize: number; // MB
  maxCacheSize: number; // MB
  purgeOldAssets: () => void;
  optimizeMemory: () => void;
  getAvailableMemory: () => number;
}

// Notification System
export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number; // ms, null = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: Date;
}

// User Preferences
export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  autoSave: boolean;
  autoSaveInterval: number; // seconds
  defaultExportSettings: ExportSettings;
  timelineZoom: number;
  showWaveforms: boolean;
  showThumbnails: boolean;
  keyboardShortcuts: Record<string, string>;
  aiSettings: {
    autoClipEnabled: boolean;
    captionGenerationEnabled: boolean;
    viralAnalysisEnabled: boolean;
    processingPriority: 'speed' | 'quality';
  };
}

// Main Project Type
export interface Project {
  id: string;
  name: string;
  description?: string;
  aspectRatio: AspectRatio;
  duration: number; // total project duration
  tracks: TimelineTrack[];
  assets: ProjectAsset[];
  settings: ProjectSettings;
  aiData?: {
    autoClipResults?: AutoClipResult[];
    viralAnalysis?: AISummary[];
    captions?: HormoziCaption[];
  };
  createdAt: Date;
  lastModified: Date;
  version: number;
  collaborators?: string[];
  isPublic: boolean;
  tags: string[];
}

export interface ProjectSettings {
  fps: number;
  resolution: { width: number; height: number };
  backgroundColor: string;
  gridSnap: boolean;
  magneticTimeline: boolean;
  rippleEdit: boolean;
  showSafeArea: boolean;
  audioSampleRate: number;
  previewQuality: 'low' | 'medium' | 'high';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
