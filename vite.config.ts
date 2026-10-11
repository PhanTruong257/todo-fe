import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    build: {
      target: ['es2020', 'safari14', 'ios14'],
      cssTarget: ['safari14', 'ios14'],
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_TARGET || 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  }
})
