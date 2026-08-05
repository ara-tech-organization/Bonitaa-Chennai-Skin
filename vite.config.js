import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  /*
   * Two deployments, two roots — so this is not a constant.
   *
   * Hostinger serves the site at the domain root, where `/` is correct and
   * public/.htaccess rewrites the app's clean paths back to index.html.
   *
   * GitHub Pages serves a *project* site from `/<repo>/`, so every asset has
   * to resolve under that sub-path. Leaving this at `/` is exactly what renders
   * a blank white page there: index.html loads, asks the domain root for
   * /assets/index-<hash>.js, gets the organisation's 404 instead of the bundle,
   * and nothing ever mounts — no error on screen, just paper.
   *
   * The Pages workflow sets BASE_PATH from the repository name. Local builds
   * and the Hostinger upload do not, so they keep the root.
   */
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
