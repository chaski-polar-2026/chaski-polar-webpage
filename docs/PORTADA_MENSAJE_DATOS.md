# Opening message and verified-data strip

The opening reuses the existing 3D scene and the evidence recorded in [PORTADA_IMPACTO_FUENTES.md](PORTADA_IMPACTO_FUENTES.md). No reference image was copied or used as an asset; no new image with unverified rights was added.

The title is below the opening globe. Its scale and height alone change while the first text is visible; between scroll progress 0.03 and 0.04 the globe smoothly returns to its original framing. Camera, `TRAMOS`, 1700svh journey length, underwater scene and game code are unchanged. The original depth rail/HUD and panel fade controller remain in use. The primary button still enters `/explorer` through its existing transition; the secondary link remains `/juego`.

The subtitle is “Is the change real? Ocean trends off Peru, tested.” The support line names six ocean variables and checks against El Nino.

## Shared records, not a second calculation

`FRANJA_PORTADA` filters the existing `HALLAZGOS_PORTADA.tarjetas` by their compact-strip metadata; all three entries are the same object references. Figures and the “More than” qualifier are rendered from those records. Both altimetry descriptions use one interval string. No second SST calculation or test-count calculation was introduced.

| Opening item | Value and visible source | Existing evidence |
| --- | --- | --- |
| Sea level | +3.0 cm per decade; 95% interval 2.2-3.7 cm/decade; C3S altimetry | Data repo `RESULTADOS_ALTIMETRIA.md`: 2.995 [2.242, 3.745], 1998-2025, no years excluded. |
| Core record | 28 years; 1998-2025; Six-variable review | Inclusive period and `RESULTADOS_RONDA_SEIS_VARIABLES.md`; some checks have longer records. |
| Tests | More than 2,300 statistical tests; Published result tables | Existing count: 896 + 1200 + 48 + 162 = 2306, rounded down; the four CSV paths are in the linked evidence document. |

The opening uses a compact strip without the large icon-card layout. The later results panel remains separated by other journey sections and keeps all four full cards, including the approximate 29-46% reduction in one-month SST error. That fourth metric is deliberately not repeated in the opening: its retrospective comparison and temperature-only caveat need space. No Kadko, nitrate magnitude, Jones estimate, fishing prediction or Antarctic discovery claim was added.

## Visual checks

Checked at 1440x900, 390x844 and 390x667 in Chromium. The title, buttons, strip and depth HUD have separate bounds; no horizontal overflow was found. At the three later card-panel midpoints, one panel is active and the opening is hidden and inert. The intro uses existing dark blue, pale text and cyan; a filled main button and bordered secondary button keep their grouping. On short mobile screens only the opening scroll hint is hidden to prevent crowding; the HUD is retained.

## Performance comparison (2026-11-15)

Before: main `c969761`. After: `3e21c51`. Same Chromium session and Vite development server, each viewport reloaded, six seconds of warm-up, then three six-second scripted scrolls from 0 to 90%, with a 700 ms reset between runs. Measurements are `requestAnimationFrame` intervals, not a GPU profiler or physical-device frame-rate measurement.

| Viewport | Median of run mean intervals, before / after | Median of run p95 intervals, before / after |
| --- | --- | --- |
| 1440x900 | 19.57 / 14.70 ms | 34.60 / 20.90 ms |
| 390x844 | 12.53 / 7.53 ms | 27.90 / 13.80 ms |

No regression was observed in these runs, but this does not establish a causal speed improvement. Adaptive rendering ended at 1080x675 before and 1440x900 after on desktop; mobile stayed at 390x844. Cache, JIT and host load were not held fixed. The implementation adds no animation loop, texture or rendering dependency. Raw measurements and screenshots accompany the external task report in `NASA/guias`.
