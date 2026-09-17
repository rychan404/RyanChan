import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { markdownProjects } from './plugins/markdown-projects';
import { routeHeads } from './plugins/route-heads';

export default defineConfig({
  plugins: [markdownProjects(), react(), routeHeads()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'plugins/**/*.test.ts'],
  },
});
