// Enhanced AI-Powered Video Store for ClipFlow AI
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  Project,
  ProjectAsset,
  TimelineClip,
  TimelineTrack,
  AISummary,
  AutoClipResult,
  HormoziCaption,
  ViralShortProject,
  ExportProgress,
  AIProcessingJob,
  Notification,
  UserPreferences,
  PerformanceMetrics,
  MemoryManager
} from '../types';

interface VideoStoreState {
  // Core Project State
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  
  // AI Features State
  aiSummaries: AISummary[];
  autoClipResults: AutoClipResult[];
  viralShortProjects: ViralShortProject[];
  processingJobs: AIProcessingJob[];
  
  // Export System
  exportProgress: ExportProgress | null;
  exportQueue: ExportProgress[];
  
  // Performance & Memory
  performanceMetrics: PerformanceMetrics;
  memoryManager: MemoryManager;
  
  // UI State
  notifications: Notification[];
  userPreferences: UserPreferences;
  isAIProcessing: boolean;
  currentProcessingJob: AIProcessingJob | null;
  
  // Editor State
  selectedClips: string[];
  selectedTracks: string[];
  playheadTime: number;
  isPlaying: boolean;
  zoomLevel: number;
  
  // Actions
  // Project Management
  createProject: (name: string, aspectRatio: string) => void;
  loadProject: (projectId: string) => void;
  saveProject: () => Promise<void>;
  updateProject: (updates: Partial<Project>) => void;
  
  // Asset Management
  addAsset: (file: File) => Promise<ProjectAsset>;
  removeAsset: (assetId: string) => void;
  updateAsset: (assetId: string, updates: Partial<ProjectAsset>) => void;
  
  // Timeline Management
  addTrack: (type: 'video' | 'audio' | 'text' | 'overlay') => string;
  removeTrack: (trackId: string) => void;
  addClip: (trackId: string, assetId: string, startTime: number, endTime: number) => TimelineClip;
  removeClip: (clipId: string) => void;
  updateClip: (clipId: string, updates: Partial<TimelineClip>) => void;
  
  // AI Features
  generateAISummary: (assetId: string) => Promise<AISummary>;
  analyzeViralPotential: (assetId: string) => Promise<AISummary>;
  generateAutoClips: (assetId: string, settings?: any) => Promise<AutoClipResult>;
  generateHormoziCaptions: (assetId: string, settings?: any) => Promise<HormoziCaption[]>;
  createViralShort: (sourceProjectId: string, settings?: any) => Promise<ViralShortProject>;
  
  // Export System
  startExport: (projectId: string, settings: any) => Promise<string>;
  cancelExport: (exportId: string) => void;
  retryExport: (exportId: string) => void;
  
  // Performance
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  optimizeMemory: () => void;
  clearCache: () => void;
  
  // UI State Management
  setSelectedClips: (clipIds: string[]) => void;
  setSelectedTracks: (trackIds: string[]) => void;
  setPlayheadTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (notificationId: string) => void;
  
  // Preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Error Handling
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// Enhanced Memory Manager
const createMemoryManager = (): MemoryManager => {
  const cache = new Map<string, any>();
  const maxCacheSize = 512; // 512MB default
  
  return {
    cacheSize: 0,
    maxCacheSize,
    
    purgeOldAssets: () => {
      // Remove least recently used assets
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => (a[1].lastAccessed || 0) - (b[1].lastAccessed || 0));
      
      const toRemove = entries.slice(0, Math.floor(entries.length * 0.3));
      toRemove.forEach(([key]) => {
        cache.delete(key);
      });
      
      // Recalculate cache size
      const newSize = Array.from(cache.values())
        .reduce((total, item) => total + (item.size || 0), 0);
      
      return newSize;
    },
    
    optimizeMemory: () => {
      // Force garbage collection simulation
      if (window.gc) {
        window.gc();
      }
      
      // Purge old assets
      const purgedSize = memoryManager.purgeOldAssets();
      memoryManager.cacheSize = purgedSize;
    },
    
    getAvailableMemory: () => {
      if ('memory' in performance) {
        return (performance as any).memory.jsHeapSizeLimit;
      }
      return 1024; // Fallback
    }
  };
};

const memoryManager = createMemoryManager();

// Default User Preferences
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  autoSave: true,
  autoSaveInterval: 30,
  defaultExportSettings: {
    format: 'mp4',
    quality: '1080p',
    fps: 30,
    codec: 'h264',
    audioCodec: 'aac',
    audioBitrate: 128,
    optimizeFor: 'quality'
  },
  timelineZoom: 1,
  showWaveforms: true,
  showThumbnails: true,
  keyboardShortcuts: {
    'space': 'toggle_play',
    'cmd+s': 'save_project',
    'cmd+z': 'undo',
    'cmd+shift+z': 'redo',
    'delete': 'delete_selected',
    'cmd+a': 'select_all'
  },
  aiSettings: {
    autoClipEnabled: true,
    captionGenerationEnabled: true,
    viralAnalysisEnabled: true,
    processingPriority: 'speed'
  }
};

// Main Store Implementation
export const useVideoStore = create<VideoStoreState>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    currentProject: null,
    projects: [],
    isLoading: false,
    error: null,
    
    // AI Features
    aiSummaries: [],
    autoClipResults: [],
    viralShortProjects: [],
    processingJobs: [],
    
    // Export System
    exportProgress: null,
    exportQueue: [],
    
    // Performance & Memory
    performanceMetrics: {
      renderTime: 0,
      memoryUsage: 0,
      fps: 60,
      droppedFrames: 0,
      bufferSize: 0,
      lastUpdated: new Date()
    },
    memoryManager,
    
    // UI State
    notifications: [],
    userPreferences: defaultPreferences,
    isAIProcessing: false,
    currentProcessingJob: null,
    
    // Editor State
    selectedClips: [],
    selectedTracks: [],
    playheadTime: 0,
    isPlaying: false,
    zoomLevel: 1,
    
    // Project Management Actions
    createProject: (name: string, aspectRatio: string) => {
      const newProject: Project = {
        id: `project_${Date.now()}`,
        name,
        aspectRatio: aspectRatio as any,
        duration: 0,
        tracks: [
          {
            id: `track_video_${Date.now()}`,
            name: 'Video Track 1',
            type: 'video',
            clips: [],
            visible: true
          },
          {
            id: `track_audio_${Date.now()}`,
            name: 'Audio Track 1',
            type: 'audio',
            clips: [],
            visible: true
          }
        ],
        assets: [],
        settings: {
          fps: 30,
          resolution: aspectRatio === '16:9' ? { width: 1920, height: 1080 } : 
                     aspectRatio === '9:16' ? { width: 1080, height: 1920 } :
                     { width: 1920, height: 1080 },
          backgroundColor: '#000000',
          gridSnap: true,
          magneticTimeline: true,
          rippleEdit: false,
          showSafeArea: true,
          audioSampleRate: 44100,
          previewQuality: 'medium'
        },
        createdAt: new Date(),
        lastModified: new Date(),
        version: 1,
        isPublic: false,
        tags: []
      };
      
      set(state => ({
        currentProject: newProject,
        projects: [...state.projects, newProject]
      }));
      
      get().addNotification({
        type: 'success',
        title: 'Project Created',
        message: `${name} has been created successfully`
      });
    },
    
    loadProject: (projectId: string) => {
      const state = get();
      const project = state.projects.find(p => p.id === projectId);
      
      if (project) {
        set({ currentProject: project });
        get().addNotification({
          type: 'success',
          title: 'Project Loaded',
          message: `${project.name} is now active`
        });
      } else {
        get().setError('Project not found');
      }
    },
    
    saveProject: async () => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) {
        get().setError('No project to save');
        return;
      }
      
      set({ isLoading: true });
      
      try {
        // Simulate save operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const updatedProject = {
          ...currentProject,
          lastModified: new Date(),
          version: currentProject.version + 1
        };
        
        set(state => ({
          currentProject: updatedProject,
          projects: state.projects.map(p => 
            p.id === currentProject.id ? updatedProject : p
          ),
          isLoading: false
        }));
        
        get().addNotification({
          type: 'success',
          title: 'Project Saved',
          message: `${currentProject.name} has been saved`
        });
      } catch (error) {
        get().setError('Failed to save project');
      }
    },
    
    updateProject: (updates: Partial<Project>) => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) {
        get().setError('No project to update');
        return;
      }
      
      const updatedProject = { ...currentProject, ...updates };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
    },
    
    // Asset Management
    addAsset: async (file: File): Promise<ProjectAsset> => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) {
        throw new Error('No active project');
      }
      
      const asset: ProjectAsset = {
        id: `asset_${Date.now()}`,
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : 
              file.type.startsWith('audio/') ? 'audio' : 'image',
        filePath: URL.createObjectURL(file),
        fileSize: file.size,
        duration: 0, // Will be populated after processing
        format: file.type,
        metadata: {
          originalFile: file
        },
        uploadedAt: new Date(),
        lastModified: new Date()
      };
      
      // Add asset to project
      const updatedProject = {
        ...currentProject,
        assets: [...currentProject.assets, asset]
      };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
      
      get().addNotification({
        type: 'success',
        title: 'Asset Added',
        message: `${file.name} has been added to the project`
      });
      
      return asset;
    },
    
    removeAsset: (assetId: string) => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) return;
      
      const updatedProject = {
        ...currentProject,
        assets: currentProject.assets.filter(a => a.id !== assetId)
      };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
      
      get().addNotification({
        type: 'info',
        title: 'Asset Removed',
        message: 'Asset has been removed from the project'
      });
    },
    
    updateAsset: (assetId: string, updates: Partial<ProjectAsset>) => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) return;
      
      const updatedProject = {
        ...currentProject,
        assets: currentProject.assets.map(a => 
          a.id === assetId ? { ...a, ...updates } : a
        )
      };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
    },
    
    // Timeline Management
    addTrack: (type: 'video' | 'audio' | 'text' | 'overlay') => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) return '';
      
      const trackId = `track_${type}_${Date.now()}`;
      const newTrack: TimelineTrack = {
        id: trackId,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Track ${currentProject.tracks.length + 1}`,
        type,
        clips: [],
        visible: true
      };
      
      const updatedProject = {
        ...currentProject,
        tracks: [...currentProject.tracks, newTrack]
      };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
      
      return trackId;
    },
    
    removeTrack: (trackId: string) => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) return;
      
      const updatedProject = {
        ...currentProject,
        tracks: currentProject.tracks.filter(t => t.id !== trackId)
      };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
    },
    
    addClip: (trackId: string, assetId: string, startTime: number, endTime: number) => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) throw new Error('No active project');
      
      const clip: TimelineClip = {
        id: `clip_${Date.now()}`,
        assetId,
        startTime,
        endTime,
        trackId,
        volume: 1,
        speed: 1,
        effects: []
      };
      
      const updatedProject = {
        ...currentProject,
        tracks: currentProject.tracks.map(track => 
          track.id === trackId 
            ? { ...track, clips: [...track.clips, clip] }
            : track
        )
      };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
      
      return clip;
    },
    
    removeClip: (clipId: string) => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) return;
      
      const updatedProject = {
        ...currentProject,
        tracks: currentProject.tracks.map(track => ({
          ...track,
          clips: track.clips.filter(c => c.id !== clipId)
        }))
      };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
    },
    
    updateClip: (clipId: string, updates: Partial<TimelineClip>) => {
      const state = get();
      const { currentProject } = state;
      
      if (!currentProject) return;
      
      const updatedProject = {
        ...currentProject,
        tracks: currentProject.tracks.map(track => ({
          ...track,
          clips: track.clips.map(clip => 
            clip.id === clipId ? { ...clip, ...updates } : clip
          )
        }))
      };
      
      set(state => ({
        currentProject: updatedProject,
        projects: state.projects.map(p => 
          p.id === currentProject.id ? updatedProject : p
        )
      }));
    },
    
    // AI Features
    generateAISummary: async (assetId: string): Promise<AISummary> => {
      set({ isAIProcessing: true });
      
      const job: AIProcessingJob = {
        id: `job_${Date.now()}`,
        type: 'analyze_viral',
        status: 'processing',
        progress: 0,
        input: { assetId },
        startedAt: new Date()
      };
      
      set({ currentProcessingJob: job });
      
      try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const summary: AISummary = {
          id: `summary_${Date.now()}`,
          viralScore: Math.floor(Math.random() * 100),
          suggestedClips: [],
          summary: 'AI-generated analysis of viral potential',
          keyMoments: [],
          audienceEngagement: {
            predictedRetention: 75,
            peakAttentionPoints: [15, 45, 90],
            dropOffRisks: [30, 60],
            optimalClipLength: 30
          },
          conversionOpportunities: [],
          generatedAt: new Date(),
          model: 'ClipFlow-AI-v2'
        };
        
        set(state => ({
          aiSummaries: [...state.aiSummaries, summary],
          isAIProcessing: false,
          currentProcessingJob: null
        }));
        
        get().addNotification({
          type: 'success',
          title: 'AI Analysis Complete',
          message: 'Viral potential analysis has been generated'
        });
        
        return summary;
      } catch (error) {
        set({ isAIProcessing: false, currentProcessingJob: null });
        get().setError('AI analysis failed');
        throw error;
      }
    },
    
    analyzeViralPotential: async (assetId: string): Promise<AISummary> => {
      return get().generateAISummary(assetId);
    },
    
    generateAutoClips: async (assetId: string, settings = {}): Promise<AutoClipResult> => {
      set({ isAIProcessing: true });
      
      const job: AIProcessingJob = {
        id: `job_${Date.now()}`,
        type: 'auto_clip',
        status: 'processing',
        progress: 0,
        input: { assetId, settings },
        startedAt: new Date()
      };
      
      set({ currentProcessingJob: job });
      
      try {
        // Simulate AI auto-clipping processing
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        const result: AutoClipResult = {
          clips: [
            {
              id: `clip_${Date.now()}_1`,
              startTime: 0,
              endTime: 30,
              title: 'Strong Opening Hook',
              description: 'High engagement potential opening',
              viralScore: 85,
              clipType: 'highlight',
              confidence: 0.92,
              hashtags: ['#viral', '#highlight', '#hook']
            },
            {
              id: `clip_${Date.now()}_2`,
              startTime: 45,
              endTime: 75,
              title: 'Key Insight Moment',
              description: 'Valuable content highlight',
              viralScore: 78,
              clipType: 'insight',
              confidence: 0.89,
              hashtags: ['#insight', '#value', '#learning']
            }
          ],
          processingTime: 4.2,
          totalAnalyzed: 300,
          confidence: 0.91
        };
        
        set(state => ({
          autoClipResults: [...state.autoClipResults, result],
          isAIProcessing: false,
          currentProcessingJob: null
        }));
        
        get().addNotification({
          type: 'success',
          title: 'Auto Clips Generated',
          message: `${result.clips.length} clips have been suggested by AI`
        });
        
        return result;
      } catch (error) {
        set({ isAIProcessing: false, currentProcessingJob: null });
        get().setError('Auto-clip generation failed');
        throw error;
      }
    },
    
    generateHormoziCaptions: async (assetId: string, settings = {}): Promise<HormoziCaption[]> => {
      set({ isAIProcessing: true });
      
      try {
        // Simulate Hormozi caption generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const captions: HormoziCaption[] = [
          {
            id: `caption_${Date.now()}_1`,
            text: 'This is the fastest way to 10x your revenue in 90 days or less...',
            hashtags: ['#entrepreneur', '#business', '#revenue', '#growth'],
            tone: 'direct',
            ctaText: 'Comment "YES" if you want the exact system',
            engagementScore: 92,
            viralPotential: 88,
            createdAt: new Date()
          },
          {
            id: `caption_${Date.now()}_2`,
            text: 'Most people are making this $100K mistake that keeps them broke...',
            hashtags: ['#mistake', '#money', '#wealth', '#mindset'],
            tone: 'controversial',
            ctaText: 'Share if this resonates with you',
            engagementScore: 87,
            viralPotential: 85,
            createdAt: new Date()
          }
        ];
        
        set({ isAIProcessing: false });
        
        get().addNotification({
          type: 'success',
          title: 'Captions Generated',
          message: 'Hormozi-style captions have been created'
        });
        
        return captions;
      } catch (error) {
        set({ isAIProcessing: false });
        get().setError('Caption generation failed');
        throw error;
      }
    },
    
    createViralShort: async (sourceProjectId: string, settings = {}): Promise<ViralShortProject> => {
      set({ isAIProcessing: true });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const viralShort: ViralShortProject = {
          id: `viral_${Date.now()}`,
          name: `Viral Short ${Date.now()}`,
          sourceVideoId: sourceProjectId,
          clips: [],
          settings: {
            targetPlatform: 'tiktok',
            verticalFormat: true,
            maxDuration: 60,
            includeTextOverlays: true,
            autoTrim: true,
            optimizeFor: 'viral'
          },
          exportSettings: {
            format: 'mp4',
            quality: '1080p',
            fps: 30,
            codec: 'h264',
            audioCodec: 'aac',
            audioBitrate: 128,
            optimizeFor: 'quality'
          },
          createdAt: new Date(),
          thumbnailUrls: []
        };
        
        set(state => ({
          viralShortProjects: [...state.viralShortProjects, viralShort],
          isAIProcessing: false
        }));
        
        get().addNotification({
          type: 'success',
          title: 'Viral Short Created',
          message: 'New viral short project has been generated'
        });
        
        return viralShort;
      } catch (error) {
        set({ isAIProcessing: false });
        get().setError('Viral short creation failed');
        throw error;
      }
    },
    
    // Export System
    startExport: async (projectId: string, settings: any): Promise<string> => {
      const exportId = `export_${Date.now()}`;
      
      const exportJob: ExportProgress = {
        id: exportId,
        projectId,
        status: 'preparing',
        progress: 0,
        currentStep: 'Initializing export...',
        estimatedTimeRemaining: 0
      };
      
      set(state => ({
        exportProgress: exportJob,
        exportQueue: [...state.exportQueue, exportJob]
      }));
      
      // Simulate export process
      const steps = [
        { status: 'encoding', progress: 20, step: 'Encoding video...' },
        { status: 'finalizing', progress: 60, step: 'Finalizing file...' },
        { status: 'uploading', progress: 80, step: 'Preparing download...' },
        { status: 'completed', progress: 100, step: 'Export complete!' }
      ];
      
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const updatedExport = {
          ...exportJob,
          status: step.status as any,
          progress: step.progress,
          currentStep: step.step,
          outputUrl: step.status === 'completed' ? `https://example.com/exports/${exportId}.mp4` : undefined
        };
        
        set(state => ({
          exportProgress: updatedExport,
          exportQueue: state.exportQueue.map(e => 
            e.id === exportId ? updatedExport : e
          )
        }));
      }
      
      get().addNotification({
        type: 'success',
        title: 'Export Complete',
        message: 'Your video has been exported successfully'
      });
      
      return exportId;
    },
    
    cancelExport: (exportId: string) => {
      set(state => ({
        exportQueue: state.exportQueue.filter(e => e.id !== exportId),
        exportProgress: state.exportProgress?.id === exportId ? null : state.exportProgress
      }));
    },
    
    retryExport: (exportId: string) => {
      // Implementation for retrying failed exports
      get().startExport(exportId, {});
    },
    
    // Performance Management
    updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => {
      set(state => ({
        performanceMetrics: {
          ...state.performanceMetrics,
          ...metrics,
          lastUpdated: new Date()
        }
      }));
    },
    
    optimizeMemory: () => {
      memoryManager.optimizeMemory();
      get().addNotification({
        type: 'info',
        title: 'Memory Optimized',
        message: 'Application memory has been optimized'
      });
    },
    
    clearCache: () => {
      memoryManager.purgeOldAssets();
      get().addNotification({
        type: 'info',
        title: 'Cache Cleared',
        message: 'Temporary files have been cleared'
      });
    },
    
    // UI State Management
    setSelectedClips: (clipIds: string[]) => set({ selectedClips: clipIds }),
    setSelectedTracks: (trackIds: string[]) => set({ selectedTracks: trackIds }),
    setPlayheadTime: (time: number) => set({ playheadTime: Math.max(0, time) }),
    setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
    setZoomLevel: (zoom: number) => set({ zoomLevel: Math.max(0.1, Math.min(10, zoom)) }),
    
    // Notification Management
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => {
      const fullNotification: Notification = {
        ...notification,
        id: `notification_${Date.now()}`,
        createdAt: new Date()
      };
      
      set(state => ({
        notifications: [...state.notifications, fullNotification]
      }));
      
      // Auto-remove notification after duration
      if (notification.duration) {
        setTimeout(() => {
          get().removeNotification(fullNotification.id);
        }, notification.duration);
      }
    },
    
    removeNotification: (notificationId: string) => {
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== notificationId)
      }));
    },
    
    // Preferences
    updatePreferences: (preferences: Partial<UserPreferences>) => {
      set(state => ({
        userPreferences: { ...state.userPreferences, ...preferences }
      }));
    },
    
    // Error Handling
    setError: (error: string | null) => {
      set({ error });
      if (error) {
        get().addNotification({
          type: 'error',
          title: 'Error',
          message: error
        });
      }
    },
    setLoading: (loading: boolean) => set({ isLoading: loading })
  }))
);

// Subscribe to auto-save
useVideoStore.subscribe(
  (state) => state.currentProject,
  (project) => {
    if (project && useVideoStore.getState().userPreferences.autoSave) {
      // Auto-save logic would go here
      console.log('Auto-saving project:', project.name);
    }
  }
);

// Subscribe to performance monitoring
setInterval(() => {
  const performance = useVideoStore.getState().performanceMetrics;
  const memoryManager = useVideoStore.getState().memoryManager;
  
  // Update memory usage
  if ('memory' in performance) {
    useVideoStore.getState().updatePerformanceMetrics({
      memoryUsage: (performance as any).memory || 0
    });
  }
}, 5000); // Update every 5 seconds

export default useVideoStore;
