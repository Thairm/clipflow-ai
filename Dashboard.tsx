// Dashboard Component - Central Hub for ClipFlow AI
import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Wand2, 
  Sparkles, 
  Settings,
  User,
  Moon,
  Sun,
  Zap,
  Play,
  Upload,
  TrendingUp,
  Type,
  Download,
  Plus,
  Clock,
  Star,
  CreditCard,
  Brain
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useVideoStore } from '../store/videoStore';

// Theme Context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (undefined === context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Update document class for global theme switching
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={isDarkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Dashboard Props Interface
interface DashboardProps {
  onBackToHome: () => void;
  onOpenEditor: () => void;
}

// Navigation Item Interface
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

// AI Tools Section Component
const AIToolsSection: React.FC = () => {
  const { addNotification } = useVideoStore();

  const aiTools = [
    {
      id: 'auto-clip',
      title: 'Auto Clip Generation',
      description: 'AI identifies the best moments in your video for viral clips',
      icon: Wand2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/20'
    },
    {
      id: 'viral-analysis',
      title: 'Viral Content Analysis',
      description: 'Analyze your content potential using AI algorithms',
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20'
    },
    {
      id: 'smart-captions',
      title: 'Smart Captions',
      description: 'Generate high-converting captions with Hormozi style',
      icon: Type,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20'
    },
    {
      id: 'ai-thumbnails',
      title: 'AI Thumbnails',
      description: 'Create eye-catching thumbnails automatically',
      icon: Sparkles,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20'
    }
  ];

  const handleToolClick = (toolId: string, toolTitle: string) => {
    addNotification({
      type: 'info',
      title: `${toolTitle} Selected`,
      message: 'Feature coming soon! This AI tool will be available in the next update.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Tools</h2>
          <p className="text-muted-foreground">Powerful AI features to enhance your content</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Brain className="w-3 h-3" />
          4 Tools Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${tool.borderColor} ${tool.bgColor}`}
                  onClick={() => handleToolClick(tool.id, tool.title)}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <Button variant="outline" size="sm">
                      Try Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            AI Processing Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">247</div>
              <div className="text-sm text-muted-foreground">Clips Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">12.5s</div>
              <div className="text-sm text-muted-foreground">Avg Process Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// AI Video Generation Section Component
const AIVideoGenerationSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Video Generation</h2>
          <p className="text-muted-foreground">Generate videos using artificial intelligence</p>
        </div>
        <Badge variant="outline" className="border-orange-400 text-orange-400">
          Coming Soon
        </Badge>
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="p-12 text-center">
          <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI Video Generation</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create complete videos from text prompts, scripts, or concepts using cutting-edge AI technology.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Features coming soon:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Text-to-Video</Badge>
              <Badge variant="secondary">Script Generator</Badge>
              <Badge variant="secondary">Scene Builder</Badge>
              <Badge variant="secondary">Voice Synthesis</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Settings Section Component
const SettingsSection: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Customize your ClipFlow AI experience</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Information</p>
                  <p className="text-sm text-muted-foreground">Update your account details</p>
                </div>
                <Button variant="outline" size="sm">Edit Profile</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Subscription</p>
                  <p className="text-sm text-muted-foreground">Manage your subscription plan</p>
                </div>
                <Button variant="outline" size="sm">Manage Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Default Quality</p>
                  <p className="text-sm text-muted-foreground">Set default export quality</p>
                </div>
                <Badge variant="secondary">1080p</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Format</p>
                  <p className="text-sm text-muted-foreground">Default file format</p>
                </div>
                <Badge variant="secondary">MP4</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC<DashboardProps> = ({ onBackToHome, onOpenEditor }) => {
  const [activeSection, setActiveSection] = useState<string>('ai-tools');
  const { isDarkMode, toggleTheme } = useTheme();

  const navigationItems: NavigationItem[] = [
    {
      id: 'ai-tools',
      label: 'AI Tools',
      icon: Wand2,
      color: 'text-blue-400',
      description: 'AI-powered editing features'
    },
    {
      id: 'video-editor',
      label: 'Video Editor',
      icon: Video,
      color: 'text-green-400',
      description: 'Professional video editing'
    },
    {
      id: 'ai-generation',
      label: 'AI Video Generation',
      icon: Sparkles,
      color: 'text-purple-400',
      description: 'Generate videos with AI'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-400',
      description: 'App preferences & account'
    }
  ];

  const handleVideoEditorClick = () => {
    onOpenEditor();
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'ai-tools':
        return <AIToolsSection />;
      case 'video-editor':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Video Editor</h2>
                <p className="text-muted-foreground">Professional timeline-based video editing</p>
              </div>
              <Button onClick={handleVideoEditorClick}>
                <Play className="w-4 h-4 mr-2" />
                Launch Editor
              </Button>
            </div>
            
            <Card className="border-2 border-dashed">
              <CardContent className="p-12 text-center">
                <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Professional Video Editor</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Access the full-featured timeline editor with multi-track support, effects, and precision controls.
                </p>
                <Button onClick={handleVideoEditorClick} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Project
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'ai-generation':
        return <AIVideoGenerationSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <AIToolsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-72 bg-card border-r flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ClipFlow AI
              </h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                activeSection === item.id 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-muted/50'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className={`w-5 h-5 ${
                activeSection === item.id ? item.color : 'text-muted-foreground'
              }`} />
              <div className="flex-1">
                <div className={`font-medium ${
                  activeSection === item.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t space-y-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="User" />
              <AvatarFallback>CF</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">ClipFlow User</div>
              <div className="text-xs text-muted-foreground">Pro Plan</div>
            </div>
          </div>

          {/* Credits Display */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Credits</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-primary">247</span>
              <span className="text-xs text-muted-foreground">remaining</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <Button 
            variant="outline" 
            onClick={toggleTheme}
            className="w-full justify-start gap-2"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                Dark Mode
              </>
            )}
          </Button>

          {/* Back to Homepage */}
          <Button 
            variant="ghost" 
            onClick={onBackToHome}
            className="w-full justify-start gap-2 text-muted-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Online
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Favorites
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Wrapper Component with Theme Provider
const DashboardWithTheme: React.FC<DashboardProps> = (props) => {
  return (
    <ThemeProvider>
      <Dashboard {...props} />
    </ThemeProvider>
  );
};

export default DashboardWithTheme;