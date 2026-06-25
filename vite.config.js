import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/V-Log-USM/', // <--- Tambah baris ini (Pastikan ejaan besar/kecil sama dan ada slash di depan & belakang)
})