import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Añade un alias para resolver "react-apexcharts"
      'react-apexcharts': 'react-apexcharts',
    },
  },
})