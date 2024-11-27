import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',  // This enables JSX syntax for .js files
    include: [
      // Add your src directory here
      'src/**/*.js',
      'src/**/*.jsx'
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',  // This ensures JSX syntax is enabled
      },
    },
  },
});
