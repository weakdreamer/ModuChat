import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8765,
    host: true,  // 监听所有IPv4和IPv6地址
    allowedHosts: true,  // 允许所有主机访问（仅用于开发测试）
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true
      },
      '/ws': {
        target: 'ws://localhost:5173',
        ws: true,
        changeOrigin: true
      }
    }
  }
})
