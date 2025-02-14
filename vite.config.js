import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // เพิ่มการตั้งค่าเหล่านี้
  server: {
    port: 5173, // port สำหรับ development
    open: true // เปิดเบราว์เซอร์อัตโนมัติเมื่อ start server
  },
  preview: {
    port: 5173 // port สำหรับ preview production build
  },
  build: {
    outDir: 'dist', // โฟลเดอร์สำหรับ production build
    sourcemap: true // สร้าง source map เพื่อการ debug
  },
  // กรณีต้องการแก้ปัญหา path import
  resolve: {
    alias: {
      '@': '/src' // สามารถ import จาก @/components ได้เลย
    }
  }
})