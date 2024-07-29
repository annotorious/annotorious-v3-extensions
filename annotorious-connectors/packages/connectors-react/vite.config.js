import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

import * as packageJson from './package.json';

export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ['./src/'],
      entryRoot: './src'
    })
  ],
  server: {
    open: '/test/index.html'
  },
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: (format) => `annotorious-connectors-react.${format}.js`
    },
    rollupOptions: {
      external: [
        ...Object.keys(packageJson.peerDependencies),
        '@annotorious/core',
        '@annotorious/annotorious',
        '@annotorious/openseadragon'
      ],
      output: {
        preserveModules: true,
        assetFileNames: 'annotorious-connectors-react.[ext]'
      }
    },
    sourcemap: true
  }
});