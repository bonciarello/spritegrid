import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: './',
  plugins: [svelte()],
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4599'),
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4599'),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
