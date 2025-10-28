import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Default backend URL for local development
  const backendUrl = 'http://localhost:5000';

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ["lucide-react"],
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      // Make environment variables available globally in the app
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl),
    },
  };
});
