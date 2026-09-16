import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { markdownProjects } from './plugins/markdown-projects';

export default defineConfig({
  plugins: [markdownProjects(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'plugins/**/*.test.ts'],
  },
});
