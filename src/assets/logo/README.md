# Chaski Polar brand assets

The source JPEG is preserved byte for byte in `original/chaski-polar.jpeg`. The archived emblem is in `archive/chaski-polar.png`.

The transparent wordmark and icon are in `public/assets/logo/`. They use a soft alpha mask fitted to the sampled background and foreground colors, with the blue matte removed from the edge pixels.

| Sample | Color |
|---|---|
| JPEG background | `#061f35` |
| White lettering and whale | `#ebf8fe` |
| Turquoise dot | `#3ed2c6` |
| Website background | `#071e33` |

The white wordmark is intended for dark backgrounds. It has low contrast on a light background. The favicon and application icons include a dark background so the whale remains visible with either browser theme.

The header displays the 1330 × 375 wordmark at 144 × 40 CSS pixels and the 384 × 384 icon inside a 36 × 32 CSS-pixel box. Both provide enough source resolution for 2× and 3× displays. The 512-pixel application icon is resampled from the raster icon; these files do not provide vector geometry.

Rebuild the assets with the installed Pillow and numpy packages:

```powershell
python src/assets/logo/generar.py
```

The social image is 1200 × 630 pixels. The generator uses the installed Segoe UI font for its small challenge label.

Open Graph and Twitter image URLs use a site-relative path by default. Set the deployment's public origin when building to produce absolute metadata URLs:

```powershell
$env:PUBLIC_SITE_URL = 'https://your-site.example'
corepack pnpm build
```

This variable is read from the build process. No private configuration file is required. The source repository is https://github.com/chaski-polar-2026/chaski-polar-webpage.
