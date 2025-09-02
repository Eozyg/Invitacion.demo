// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    assetsInclude: ['**/*.mp4', '**/*.webm', '**/*.ogg'],
    server: {
      fs: {
        allow: ['..', './public']
      }
    }
  }
});
