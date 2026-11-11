import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://irondesign.ir/wp-content/uploads/',
  plugins: [react()],
})
