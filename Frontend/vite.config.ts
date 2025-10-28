import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Get the backend URL from environment variables or use default
  const backendUrl = mode === 'production' 
    ? 'https://eventwala-a-event-management-saas.onrender.com'  // Your backend URL on Render
    : 'http://localhost:5000';

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
          secure: true,
        },
      },
    },
    define: {
      // Make environment variables available globally in the app
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(backendUrl),
    },
  };
});
