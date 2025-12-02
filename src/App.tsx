// Enhanced Main App Component - ClipFlow AI with Homepage and Dashboard
import React, { useState, useEffect } from 'react';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import VideoEditor from './components/VideoEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Settings,
  Plus,
  Upload,
  Clock
} from 'lucide-react';
import { useVideoStore } from './store/videoStore';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';


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
        {/* Direct Video Editor - No Tabs */}
        <VideoEditor onBackToDashboard={onBackToDashboard} />
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
