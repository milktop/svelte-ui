import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  // Examples import the library by its package name, as an app would.
  resolve: { alias: { '@milktop/svelte-ui': fileURLToPath(new URL('../src/index.js', import.meta.url)) } },
  server: { fs: { allow: ['..'] } },
})
