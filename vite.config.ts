// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'GitHub Actions Progress View Sidebar',
  description: '',
  version: '1.0',
  icons: {
    // "16": "",
    // "32": "",
    // "48": "",
    // "128": "",
  },
  content_scripts: [
    {
      js: ['src/content_scripts/main.ts'],
      matches: ['https://github.com/*'],
    },
  ],
});

export default defineConfig({
  plugins: [crx({ manifest })],
});
