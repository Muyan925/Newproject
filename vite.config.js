import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    //  http://localhost:5000/send-sms  --> http://localhost:3000/send-sms
    proxy: {
      '/send-sms': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }

  // server: {
  //   proxy: {
  //   http://localhost:5000/api/send-sms  --> http://localhost:3000/send-sms
  //   http://localhost:5000/api/login  --> http://localhost:3000/login
  //     // 代理 '/api' 路径的请求到 'http://localhost:3000'
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})