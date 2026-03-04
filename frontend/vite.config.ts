import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path' // Add this import

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      // Force Vitest to use your project's single instance of React
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
});