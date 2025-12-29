import { defineConfig } from '@solidjs/start/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite({ router }: { router: 'server' | 'client' | 'server-function' }) {
    if (router === 'server') {
    } else if (router === 'client') {
    } else if (router === 'server-function') {
    }
    return { plugins: [tailwindcss()] };
  },
  server: {
    preset: 'netlify',
  },
});
