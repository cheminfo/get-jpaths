import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts', 'src/**/*.js'],
      provider: 'v8',
    },
    setupFiles: [
      // 'vitest.setup.ts',
    ],
  },
});
