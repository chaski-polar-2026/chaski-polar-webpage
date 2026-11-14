import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

// PUBLIC_SITE_URL se recibe del proceso de compilación; no requiere archivos de configuración privados.
function socialImageMetadata(): Plugin {
  const image = '/assets/logo/chaski-polar-social.png'
  const configured = process.env.PUBLIC_SITE_URL?.trim()
  let url = image
  if (configured) {
    const base = new URL(configured)
    if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password) throw new Error('PUBLIC_SITE_URL must be an HTTP(S) site URL without credentials')
    url = new URL(image, base).href
  }
  return {
    name: 'social-image-metadata',
    transformIndexHtml(html) {
      return html.replaceAll('__SOCIAL_IMAGE_URL__', url.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    socialImageMetadata(),
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
