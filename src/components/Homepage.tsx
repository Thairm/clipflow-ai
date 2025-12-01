import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Clock, 
  Users, 
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Grid3X3
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface HomepageProps {
  onLaunchApp: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onLaunchApp }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {/* Grid Background Pattern */}
      <div 
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header */}
      <motion.header 
        className="relative z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onLaunchApp}>
                Features
              </Button>
              <Button onClick={onLaunchApp} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Launch App
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <div className="container mx-auto text-center">
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">• v1.0 is now live for creators</span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">Create viral clips</span>
            <br />
            <span className="text-primary">10x faster</span>
            <span className="text-yellow-400"> with AI</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            The all-in-one editor for creators. Upload your video, edit the text transcript, 
            and let AI generate subtitles and B-roll instantly.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button 
              size="lg" 
              onClick={onLaunchApp}
              className="flex items-center gap-2 px-8 py-4 text-lg"
            >
              Start New Project
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={onLaunchApp}
              className="flex items-center gap-2 px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1,000+ creators</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>4.9/5 rating</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="relative z-10 py-24 px-6 bg-card/30 backdrop-blur-sm"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <div className="container mx-auto">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="text-primary">ClipFlow AI</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI-driven features that transform your video editing workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="border-border/40 hover:border-primary/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">AI-Powered Editing</h3>
                  <p className="text-muted-foreground">
                    Automatically identify the best moments in your content with advanced AI analysis
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-border/40 hover:border-primary/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">10x Faster</h3>
                  <p className="text-muted-foreground">
                    Cut editing time by 90% with intelligent automation and smart suggestions
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-border/40 hover:border-primary/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Viral Ready</h3>
                  <p className="text-muted-foreground">
                    Optimize your content for different platforms with built-in viral score analysis
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative z-10 py-24 px-6"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <div className="container mx-auto text-center">
          <motion.div
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your <span className="text-primary">Content Creation</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators who are already using ClipFlow AI to create viral content
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={onLaunchApp}
                className="flex items-center gap-2 px-8 py-4 text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-8 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free tier available</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 bg-card/30 backdrop-blur-sm py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold">ClipFlow AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2025 ClipFlow AI</span>
              <Button variant="ghost" size="sm" onClick={onLaunchApp}>
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" onClick={onLaunchApp}>
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;