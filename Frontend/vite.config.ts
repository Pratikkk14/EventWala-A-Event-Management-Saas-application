import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd());
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:4000';

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
