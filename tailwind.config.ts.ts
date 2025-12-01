// Enhanced Tailwind Configuration - ClipFlow AI
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  
  darkMode: 'class',
  
  theme: {
    extend: {
      // Custom color palette for video editor
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        
        // Video Editor Specific Colors
        'editor-panel': 'hsl(var(--editor-panel))',
        'editor-panel-light': 'hsl(var(--editor-panel-light))',
        'timeline-bg': 'hsl(var(--timeline-bg))',
        'timeline-grid': 'hsl(var(--timeline-grid))',
        'clip-bg': 'hsl(var(--clip-bg))',
        'clip-bg-hover': 'hsl(var(--clip-bg-hover))',
        'clip-selected': 'hsl(var(--clip-selected))',
        'waveform-color': 'hsl(var(--waveform-color))',
        'playhead-color': 'hsl(var(--playhead-color))',
        
        // AI Feature Colors
        'ai-accent': 'hsl(var(--ai-accent))',
        'ai-highlight': 'hsl(var(--ai-highlight))',
        'ai-warning': 'hsl(var(--ai-warning))',
        'ai-error': 'hsl(var(--ai-error))',
        
        // Semantic Colors
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
      },
      
      // Font family configuration
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      // Font size scale with video editor optimizations
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'caption-xs': ['0.7rem', { lineHeight: '1rem' }],
        'caption-sm': ['0.8rem', { lineHeight: '1.1rem' }],
        'caption-lg': ['1.1rem', { lineHeight: '1.4rem' }],
        'editor-timeline': ['0.75rem', { lineHeight: '1rem' }],
      },
      
      // Spacing scale optimized for video editor
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        'timeline-clip': '64px',
        'timeline-track': '80px',
        'timeline-ruler': '30px',
      },
      
      // Custom border radius values
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'sharp': '4px',
        'editor-clip': '4px',
        'editor-panel': '8px',
        'editor-modal': '12px',
      },
      
      // Custom box shadows for video editor UI
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'editor-panel': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'editor-floating': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'ai-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'ai-glow-strong': '0 0 30px rgba(139, 92, 246, 0.5)',
        'success-glow': '0 0 20px rgba(34, 197, 94, 0.3)',
        'warning-glow': '0 0 20px rgba(234, 179, 8, 0.3)',
        'error-glow': '0 0 20px rgba(239, 68, 68, 0.3)',
      },
      
      // Custom animations for AI features and video editor
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'ai-pulse': 'aiPulse 2s ease-in-out infinite',
        'ai-glow': 'aiGlow 3s ease-in-out infinite',
        'waveform': 'waveform 1s ease-in-out infinite',
        'timeline-scrub': 'timelineScrub 0.1s ease-out',
        'notification-enter': 'notificationEnter 0.3s ease-out',
        'notification-exit': 'notificationExit 0.3s ease-in',
        'loading-dots': 'loadingDots 1.4s ease-in-out infinite',
        'spinner': 'spinner 1s linear infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
      },
      
      // Keyframe definitions for custom animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-8px)' },
          '70%': { transform: 'translateY(-4px)' },
          '90%': { transform: 'translateY(-2px)' },
        },
        aiPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        aiGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.3)' },
        },
        waveform: {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        },
        timelineScrub: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        notificationEnter: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        notificationExit: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        loadingDots: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        spinner: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      
      // Custom backdrop blur values
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
        'editor': '8px',
      },
      
      // Custom blur values for video effects
      blur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
        'subtle': '1px',
        'strong': '8px',
      },
      
      // Aspect ratios for video formats
      aspectRatio: {
        'video': '16 / 9',
        'vertical': '9 / 16',
        'square': '1 / 1',
        'classic': '4 / 3',
        'cinema': '21 / 9',
        'phone': '9 / 19.5',
      },
      
      // Custom z-index values for video editor UI layers
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'notification': '1080',
        'playhead': '10',
        'timeline-grid': '1',
        'timeline-clips': '2',
        'ai-overlay': '50',
      },
      
      // Grid template columns for video editor layout
      gridTemplateColumns: {
        'editor-sidebar': '280px 1fr 320px',
        'ai-panel': '1fr 300px',
        'export-modal': '400px 1fr',
      },
      
      // Custom grid template rows
      gridTemplateRows: {
        'editor-header': '60px 1fr 80px',
        'timeline': '30px 1fr',
      },
      
      // Breakpoints optimized for video editing
      screens: {
        'xs': '475px',
        '3xl': '1920px',
        '4xl': '2560px',
        'editor-sm': '768px',
        'editor-md': '1024px',
        'editor-lg': '1440px',
        'editor-xl': '1920px',
      },
      
      // Custom transition timing functions
      transitionTimingFunction: {
        'editor': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ai': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // Video editor specific dimensions
      width: {
        'timeline': '100%',
        'timeline-ruler': '100%',
        'video-preview': '100%',
        'sidebar-collapsed': '60px',
        'sidebar-expanded': '280px',
      },
      
      height: {
        'timeline': '80px',
        'timeline-track': '80px',
        'timeline-ruler': '30px',
        'video-container': '100%',
        'ai-panel': '100%',
        'editor-header': '60px',
        'editor-footer': '80px',
      },
    },
  },
  
  // Plugin configuration
  plugins: [
    require('tailwindcss-animate'),
    
    // Custom plugin for video editor utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities
      const newUtilities = {
        '.timeline-clip': {
          height: '64px',
          top: '8px',
          position: 'absolute',
          'border-radius': '4px',
          'background-color': theme('colors.clip-bg.DEFAULT'),
          'border': `1px solid ${theme('colors.border')}`,
          cursor: 'pointer',
          'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'background-color': theme('colors.clip-bg.hover'),
            'border-color': theme('colors.primary'),
            transform: 'translateY(-1px)',
            'box-shadow': theme('boxShadow.md'),
          },
          '&.selected': {
            'border-color': theme('colors.clip-selected'),
            'box-shadow': '0 0 0 2px hsla(var(--clip-selected), 0.3)',
          },
        },
        
        '.ai-feature-highlight': {
          'animation': 'aiPulse 2s ease-in-out infinite',
        },
        
        '.ai-glow-effect': {
          'animation': 'aiGlow 3s ease-in-out infinite',
        },
        
        '.notification-enter': {
          'animation': 'notificationEnter 0.3s ease-out',
        },
        
        '.notification-exit': {
          'animation': 'notificationExit 0.3s ease-in',
        },
      };
      
      // Custom components
      const newComponents = {
        '.btn-editor': {
          'padding': '8px 16px',
          'border-radius': '8px',
          'font-size': '14px',
          'font-weight': '500',
          'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'transform': 'translateY(-1px)',
            'box-shadow': theme('boxShadow.md'),
          },
        },
        
        '.card-editor': {
          'background-color': theme('colors.card.DEFAULT'),
          'border': `1px solid ${theme('colors.border')}`,
          'border-radius': '12px',
          'box-shadow': theme('boxShadow.editor-panel'),
          'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        
        '.editor-panel': {
          'background-color': theme('colors.editor-panel'),
          'border-top': `1px solid ${theme('colors.border')}`,
        },
        
        '.timeline-track': {
          'background': 'transparent',
          'border-bottom': `1px solid ${theme('colors.timeline-grid')}`,
          'min-height': '80px',
          'position': 'relative',
        },
        
        '.waveform': {
          'height': '60px',
          'width': '100%',
          'background': 'transparent',
          'position': 'relative',
          '&::before': {
            content: '""',
            'position': 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '1px',
            'background-color': theme('colors.waveform-color'),
            'transform': 'translateY(-50%)',
          },
        },
      };
      
      addUtilities(newUtilities);
      addComponents(newComponents);
    },
  ],
  
  // Safelist for dynamic classes
  safelist: [
    'animate-fade-in',
    'animate-slide-in',
    'animate-ai-pulse',
    'animate-ai-glow',
    'animate-notification-enter',
    'animate-notification-exit',
    'shadow-ai-glow',
    'shadow-ai-glow-strong',
    'shadow-success-glow',
    'shadow-warning-glow',
    'shadow-error-glow',
    // Video format classes
    'aspect-video',
    'aspect-vertical',
    'aspect-square',
    // Status classes
    'bg-success',
    'bg-warning',
    'bg-error',
    'bg-info',
    'text-success',
    'text-warning',
    'text-error',
    'text-info',
    // Animation variants
    'animate-pulse-slow',
    'animate-bounce-subtle',
    'animate-waveform',
    'animate-timeline-scrub',
    // Layout variants
    'grid-cols-editor-sidebar',
    'grid-cols-ai-panel',
    'grid-cols-export-modal',
    'grid-rows-editor-header',
    'grid-rows-timeline',
  ],
  
  // Prefix for custom classes
  prefix: '',
  
  // Important selector configuration
  important: false,
  
  // Separator configuration
  separator: ':',
  
  // Core plugins configuration
  corePlugins: {
    preflight: true,
  },
};

export default config;