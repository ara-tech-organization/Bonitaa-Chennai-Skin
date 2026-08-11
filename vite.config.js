import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  /*
   * WHERE THE APP IS MOUNTED. Two deployments, two answers — so this is not a
   * constant, and getting it wrong is what produces a blank white page: the
   * HTML loads, asks the wrong directory for /assets/index-<hash>.js, gets a
   * 404 instead of the bundle, and nothing ever mounts. No error on screen,
   * just paper.
   *
   * Default — Hostinger, in a `skin/` folder beside the hair site's `hair/`.
   * So the live URL is /skin/, `npm run dev` serves http://localhost:5173/skin/,
   * and public/.htaccess rewrites the app's clean paths inside that folder.
   *
   *   ⚠ If this is ever moved to a subdomain root (skin.bonitaa.co.in) or to
   *   public_html itself, build with BASE_PATH=/ and change RewriteBase in
   *   public/.htaccess to match. The two have to agree.
   *
   * Override — GitHub Pages serves a *project* site from /<repo>/, so the
   * workflow sets BASE_PATH from the repository name.
   */
  base: process.env.BASE_PATH || '/skin/',
  plugins: [react()],
})
