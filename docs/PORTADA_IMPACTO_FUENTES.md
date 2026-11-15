# Homepage impact cards: local evidence

Reviewed 2026-11-15. No new external measurements or literature estimates were used. The data repository is `chaski-polar-2026/data-treatment`; the analysis files below were read locally in `NASA/repos/data-treatment-2026`. The tables were not changed or reanalysed.

| Card | Verified source and calculation | Visible value |
| --- | --- | --- |
| Sea level | Data repo: `docs/pruebas_pendientes/RESULTADOS_ALTIMETRIA.md`, Trends table, Altimetria SLA / start 1998 / no excluded years. Sen slope 2.995 cm/decade, 95% interval [2.242, 3.745], 28 annual values, 1998-2025. Product C3S DUACS monthly L4, vNov2024; this is satellite altimetry, not GLORYS reanalysis. | +3.0 cm per decade; 95% interval 2.2-3.7 cm/decade. |
| Years and variables | Inclusive core period: 2025 - 1998 + 1 = 28 years. Data repo: `RESULTADOS_RONDA_SEIS_VARIABLES.md` lists six variables: sea level, Antarctic sea ice, long-record SST, oxygen at 100-200 m, temperature at 100-200 m and coastal wind. Some checks use longer periods; not every source shares the same coverage. | 28 years; six variables reviewed; core record 1998-2025. |
| Statistical tests | Count data rows, excluding headers, in the four published primary result tables listed below. Do not count raw/partial columns, robustness repetitions or surrogate draws as extra tests. | More than 2,300; total is 2,306, rounded down to a hundred. |
| Temperature outlook | Web repo: `src/features/prediccion/perspectiva_acierto.json`, `variable=SST`, `model=nino`, `horizon_months=1`. `mae_improvement * 100`: Paita 36.96%, Chimbote 46.46%, Callao 46.38%, Pisco 44.10%, Ilo 29.15%. The component computes the minimum/maximum from this JSON and rounds to whole percentages. | Approx. 29-46% less error versus predicting a normal month; historical tests only; outlook for sea temperature only. |

## Test count

All paths are relative to the data repository. Each result row represents a tested combination; the total is not a count of independent discoveries.

| Table under `data/tablas_pruebas_pendientes/` | Rows | Published report under `docs/pruebas_pendientes/` |
| --- | ---: | --- |
| `bloque1_teleconexion.csv` | 896 | `RESULTADOS_TELECONEXION_Y_PERSPECTIVA.md` |
| `bloque5_nutrientes_todas.csv` | 1200 | `RESULTADOS_NUTRIENTES_LARGO_PLAZO.md` |
| `antartida_vecinos.csv` | 48 | `RESULTADOS_ANTARTIDA_VECINOS.md` |
| `ronda_seis_variables.csv` | 162 | `RESULTADOS_RONDA_SEIS_VARIABLES.md` |
| Total | 2306 | 896 + 1200 + 48 + 162 |

Blocks 1 and 5 detect no robust link under their criteria. The neighbours report labels its one FDR survivor exploratory, not a finding; its conclusion does not support a robust Antarctic link. The homepage does not claim Antarctic discoveries or predict catches.

## Open-data and methods cards

`src/features/fuentes/FuentesSection.tsx` lists ESA OC-CCI v6 (including NASA SeaWiFS/MODIS-Aqua sensors), NOAA Coral Reef Watch/ERSST, Copernicus Marine reanalyses, and NSIDC G02135 sea ice. It also documents Mann-Kendall, Sen slopes and Benjamini-Hochberg multiple-test correction. OC-CCI is attributed to ESA, with NASA sensors, rather than presented as a NASA-only product. Copernicus reanalyses are labelled as such.

The existing web source section did not link the data-code repository. The traceability card therefore links to `/research#fuentes`, as requested, rather than introducing a new external destination. Reproducibility code and documentation were verified locally in the data repo (`scripts/reproducir_pruebas.py` and `docs/REPRODUCIR.md`).

## Layout and exclusions

The three existing `reto`, `cifras` and `metodo` windows are reused, at scroll progress 0.12-0.22, 0.42-0.52 and 0.72-0.82. `SECCIONES` timings, `TRAMOS`, 1700svh scroll length, camera, scene and activation/parallax code are unchanged. The question uses two columns on desktop and stacks on mobile; the fishing row remains hidden by `MOSTRAR_PESCA=false`.

No Kadko, nitrate or Jones estimates are included. No optimum, fishing prediction or catch likelihood is claimed. No reference screenshots were attached to this request; the implementation follows its written description and the existing palette, fonts and motion.
