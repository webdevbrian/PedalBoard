import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false, // Disable auto-clean to avoid Windows file locking issues
  external: ['react', 'react-dom'],
  minify: true,
  treeshake: true,
});
