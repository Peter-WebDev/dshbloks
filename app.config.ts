import netlify from '@netlify/vite-plugin';
import { defineConfig } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite({ router }: { router: 'server' | 'client' | 'server-function' }) {
    if (router === 'server') {
    } else if (router === 'client') {
    } else if (router === 'server-function') {
    }
    return { plugins: [tailwindcss(), netlify()] };
  },
  server: {
    preset: 'netlify',
  },
});
