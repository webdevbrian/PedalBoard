import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isApp = mode === 'app';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@pedalboard': path.resolve(__dirname, './src'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    build: isApp
      ? {
          outDir: 'dist-app',
          rollupOptions: {
            input: path.resolve(__dirname, 'index.html'),
          },
        }
      : {
          lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'Pedalboard',
            formats: ['es', 'cjs'],
            fileName: (format) => `pedalboard.${format === 'es' ? 'mjs' : 'js'}`,
          },
          rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
        },
    server: {
      port: 3000,
      open: true,
    },
  };
});
