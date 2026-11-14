"""Prepara los recursos de marca desde el JPEG conservado en original/."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path(__file__).parent / "original" / "chaski-polar.jpeg"
OUTPUT = ROOT / "public" / "assets" / "logo"
BACKGROUND = (7, 30, 51)


def recortar(image: Image.Image, padding: int = 12) -> Image.Image:
    bounds = image.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("No se encontro el logo")
    cropped = image.crop(bounds)
    canvas = Image.new("RGBA", (cropped.width + padding * 2, cropped.height + padding * 2))
    canvas.alpha_composite(cropped, (padding, padding))
    return canvas


def generar() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    rgb = np.asarray(Image.open(SOURCE).convert("RGB"), dtype=np.float64)
    # Zonas vacías arriba y debajo de la franja del logo.
    empty = np.concatenate((rgb[:300].reshape(-1, 3), rgb[740:].reshape(-1, 3)))
    background = np.median(empty, axis=0)
    white_pixels = rgb[(rgb[:, :, 0] > 210) & (rgb[:, :, 1] > 225) & (rgb[:, :, 2] > 230)]
    white = np.median(white_pixels, axis=0)
    turquoise = np.median(rgb[367:393, 394:420].reshape(-1, 3), axis=0)

    # Cada píxel se ajusta al segmento fondo–blanco o fondo–turquesa.
    # Se recupera el color de primer plano para no conservar el azul del JPEG en los bordes.
    fits = []
    for foreground in (white, turquoise):
        direction = foreground - background
        alpha = np.clip(np.sum((rgb - background) * direction, axis=2) / np.sum(direction**2), 0, 1)
        residual = np.sum((rgb - (background + alpha[:, :, None] * direction)) ** 2, axis=2)
        fits.append((alpha, residual))
    cyan = fits[1][1] < fits[0][1]
    alpha = np.where(cyan, fits[1][0], fits[0][0])
    # El intervalo elimina ruido de compresión y mantiene cobertura gradual en el contorno.
    alpha = np.clip((alpha - 0.035) / 0.93, 0, 1)
    foreground = np.where(cyan[:, :, None], turquoise, white)
    rgba = np.dstack((foreground, np.rint(alpha * 255))).astype(np.uint8)
    transparent = Image.fromarray(rgba)

    wordmark = recortar(transparent)
    mark = recortar(transparent.crop((90, 310, 480, 715)))
    icon = Image.new("RGBA", (384, 384))
    icon.alpha_composite(mark, ((icon.width - mark.width) // 2, (icon.height - mark.height) // 2))
    wordmark.save(OUTPUT / "chaski-polar-wordmark.png", optimize=True)
    icon.save(OUTPUT / "chaski-polar-icon.png", optimize=True)

    for size, name in [(32, "favicon-32.png"), (180, "apple-touch-icon.png"), (512, "icon-512.png")]:
        canvas = Image.new("RGBA", (size, size))
        draw = ImageDraw.Draw(canvas)
        if size == 32:
            draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=6, fill=(*BACKGROUND, 255))
        else:
            draw.rectangle((0, 0, size - 1, size - 1), fill=(*BACKGROUND, 255))
        canvas.alpha_composite(icon.resize((size, size), Image.Resampling.LANCZOS))
        canvas.save(OUTPUT / name, optimize=True)

    social = Image.new("RGBA", (1200, 630), (*BACKGROUND, 255))
    scaled = wordmark.resize((1000, round(wordmark.height * 1000 / wordmark.width)), Image.Resampling.LANCZOS)
    social.alpha_composite(scaled, ((1200 - scaled.width) // 2, 160))
    draw = ImageDraw.Draw(social)
    font_path = Path("C:/Windows/Fonts/segoeui.ttf")
    if not font_path.is_file():
        raise FileNotFoundError("Indica una fuente para el texto de la imagen social: " + str(font_path))
    font = ImageFont.truetype(str(font_path), 26)
    draw.text((600, 487), "NASA Space Apps Challenge 2026", font=font, fill=(163, 188, 203), anchor="mm")
    social.convert("RGB").save(OUTPUT / "chaski-polar-social.png", optimize=True)

    for name, color in [("Background", background), ("White", white), ("Turquoise", turquoise)]:
        print(f"{name}: #{''.join(f'{int(channel):02x}' for channel in color)}")
    print(f"Wordmark: {wordmark.size}; icon: {icon.size}; social: {social.size}")


if __name__ == "__main__":
    generar()
