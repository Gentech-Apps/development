import { Plugin } from 'rollup';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

process.env.TZ = 'UTC';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    alias: {
      '@src': './src',
      '@test': './test',
    },
    exclude: ['**/node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/node_modules/**'],
    },
    fakeTimers: {
      toFake: ['Date'],
      now: new Date('2023-05-19T00:00:00.000Z'),
    },
    clearMocks: true,
    onConsoleLog: () => true,
    logHeapUsage: true,
  },
  // By default Vitest/Vite uses esbuild which doesn't support decorators, so we use swc instead.
  // https://docs.nestjs.com/recipes/swc
  plugins: [swc.vite() as Plugin],
});
