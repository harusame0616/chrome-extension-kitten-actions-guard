// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Kitten Actions Guard',
  description: 'GitHub で Actions が完了するまでレビュー依頼できないようにする',
  version: '1.0.2',
  icons: {
    '16': 'assets/icons/16x16.png',
    '32': 'assets/icons/32x32.png',
    '48': 'assets/icons/48x48.png',
    '128': 'assets/icons/128x128.png',
  },
  content_scripts: [
    {
      js: ['src/content_scripts/main.ts'],
      matches: ['https://github.com/*'],
    },
  ],
  action: {
    default_title: 'disable review guard',
  },
  permissions: ['activeTab'],
  background: {
    service_worker: 'src/background/main.ts',
  },
});

export default defineConfig({
  plugins: [crx({ manifest })],
});
