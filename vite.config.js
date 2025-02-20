import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
 plugins: [react()],
 server: {
   port: 5173,
   open: true,
   proxy: {
     '/api': {
       target: 'https://book-app-backend-alpha.vercel.app',
       changeOrigin: true,
       secure: false
     }
   }
 },
 preview: {
   port: 5173
 },
 build: {
   outDir: 'dist',
   sourcemap: true
 },
 resolve: {
   alias: {
     '@': '/src'
   }
 }
})