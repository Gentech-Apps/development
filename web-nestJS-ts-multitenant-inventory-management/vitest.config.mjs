import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import path from 'path';

process.env.TZ = 'UTC';

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    globals: true,
    setupFiles: ['./vitest.faketimers.js'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      root: './',
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      exclude: ['**/node_modules/**', '**/dist/**'],
    },
    clearMocks: true,
    poolMatchGlobs: [
      ['**/*.service.spec.ts', 'forks'],
      ['**/*.guard.spec.ts', 'forks'],
      ['**/*.controller.spec.ts', 'forks'],
      ['**/*.spec.ts', 'threads'],
    ],
    poolOptions: {
      forks: {
        isolate: false,
        singleFork: true,
      },
      threads: {
        isolate: false,
        useAtomics: true,
      },
    },
    snapshotFormat: {
      printFunctionName: true,
    },
  },
  // By default Vitest/Vite uses esbuild which doesn't support decorators, so we use swc instead.
  // https://docs.nestjs.com/recipes/swc
  plugins: [swc.vite({ module: { type: 'es6' } })],
  resolve: {
    alias: {
      '@modules': path.resolve(__dirname, './src/modules'),
    },
  },
});
