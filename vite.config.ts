// Enhanced Vite Configuration - ClipFlow AI
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Enable JSX runtime automatic import
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          // Add any additional babel plugins here
        ]
      }
    })
  ],
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/ui': path.resolve(__dirname, './src/components/ui'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    // Enable HMR
    hmr: {
      port: 3001,
    },
    // Proxy configuration for API calls
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Build configuration
  build: {
    // Source map configuration
    sourcemap: {
      hidden: true,
    },
    
    // Target configuration for browser compatibility
    target: 'esnext',
    
    // Minification configuration
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Rollup configuration
    rollupOptions: {
      output: {
        // Manual chunks configuration for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-tabs',
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
          ],
          'motion-vendor': ['framer-motion'],
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name!)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name!)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(assetInfo.name!)) {
            return `assets/media/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
      // External dependencies
      external: [],
    },
    
    // Asset inlining threshold
    assetsInlineLimit: 4096,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // CSS minification
    cssMinify: true,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
    open: false,
  },

  // Optimization configuration
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'zustand',
    ],
    exclude: [
      // Exclude large dependencies that should be loaded on demand
    ],
  },

  // Worker configuration
  worker: {
    format: 'es',
  },

  // JSON configuration
  json: {
    namedExports: true,
    strict: true,
  },

  // CSS configuration
  css: {
    // PostCSS configuration
    postcss: './postcss.config.js',
    
    // CSS modules configuration
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    
    // Preprocessor options
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  // Environment variables
  envPrefix: ['VITE_', 'CLIPFLOW_'],

  // Legacy build for older browsers
  esbuild: {
    // Drop console statements in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    
    // Target for transpilation
    target: 'es2020',
    
    // Enable source maps in development
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Format configuration
    legalComments: 'none',
  },

  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },

  // Experimental features
  experimentalFeatures: {
    hmrPartialAccept: true,
  },
});
