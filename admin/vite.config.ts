import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served statically at admin-session.dlgiovani.dev; base './' keeps asset URLs
// relative so the bundle works at the subdomain root. In dev, /api is proxied to
// the backend so the app calls it same-origin (nginx does this in production).
const BACKEND = process.env.BACKEND ?? 'http://127.0.0.1:8000';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': { target: BACKEND, changeOrigin: true },
    },
  },
});
