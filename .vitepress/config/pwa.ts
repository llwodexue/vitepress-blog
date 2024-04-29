import type { VitePWAOptions } from 'vite-plugin-pwa'
import fg from 'fast-glob'
import { resolve } from 'path'
import { name, keywords } from './meta'

/**
 * Vite Plugin PWA uses Workbox  library to build the service worker
 * can find more information on Workbox section.
 * @see https://vite-plugin-pwa.netlify.app/
 */
export const pwa: Partial<VitePWAOptions> = {
  // outDir: '../dist',
  registerType: 'prompt',
  includeAssets: fg.sync('**/*.{png,svg,gif,ico,txt}', {
    cwd: resolve(__dirname, '../../public')
  }),
  manifest: {
    id: '/',
    name,
    short_name: name,
    description: keywords,
    theme_color: '#009ff7',
    icons: [
      {
        src: '/icons/rem128x128.png',
        sizes: '128x128',
        type: 'image/png'
      },
      {
        src: '/icons/rem192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icons/rem512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}
