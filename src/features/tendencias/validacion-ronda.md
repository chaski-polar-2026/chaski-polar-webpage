# Trend reference validation

Reproduce with `node src/features/tendencias/verificar-ronda.mjs` (Node 24).

Monthly data: `public/assets/data/tendencias-ronda.json`. Reference: `src/features/tendencias/referencia_tendencias_web.csv`. Whole-year averages use the panel functions `promediosAnuales` and `tendencia`, with no extreme-year exclusion for the reference comparison.

Tolerances: absolute slope difference below 0.001 per decade and absolute p-value difference below 0.005. Each row also checks the number of yearly values. Additional checks cover extreme-year filtering and sensitivity windows.

| Variable | Period | Sen/decade panel | Reference | p panel | p reference | Result |
|---|---|---:|---:|---:|---:|---|
| temp100 | 1998–2025 | 0.161354 | 0.1614 | 0.015097 | 0.0151 | PASS |
| temp100 | 2003–2025 | 0.260036 | 0.2600 | 0.001831 | 0.0018 | PASS |
| temp100 | 2010–2025 | 0.371961 | 0.3720 | 0.034340 | 0.0343 | PASS |
| sealevel | 1998–2025 | 0.025849 | 0.0258 | 0.000011 | 0.0000 | PASS |
| sealevel | 2003–2025 | 0.028648 | 0.0286 | 0.000019 | 0.0000 | PASS |
| sealevel | 2010–2025 | 0.026587 | 0.0266 | 0.013278 | 0.0133 | PASS |
| oxy100 | 1998–2025 | 1.596998 | 1.5970 | 0.417930 | 0.4179 | PASS |
| oxy100 | 2003–2025 | 5.362708 | 5.3627 | 0.003097 | 0.0031 | PASS |
| oxy100 | 2010–2025 | 3.566599 | 3.5666 | 0.499461 | 0.4995 | PASS |
| seaice | 1998–2025 | -0.428220 | -0.4282 | 0.020804 | 0.0208 | PASS |
| seaice | 2003–2025 | -0.644444 | -0.6444 | 0.005118 | 0.0051 | PASS |
| seaice | 2010–2025 | -1.220833 | -1.2208 | 0.002557 | 0.0026 | PASS |
| seaice | 1979–2025 | -0.024074 | -0.0241 | 0.727482 | 0.7275 | PASS |
| sst_long:norte_centro | 1998–2025 | 0.084112 | 0.0841 | 0.766964 | 0.7670 | PASS |
| sst_long:norte_centro | 2003–2025 | 0.120181 | 0.1202 | 0.751300 | 0.7513 | PASS |
| sst_long:norte_centro | 2010–2025 | -0.045192 | -0.0452 | 0.892558 | 0.8926 | PASS |
| sst_long:norte_centro | 1979–2025 | 0.009700 | 0.0097 | 0.868890 | 0.8689 | PASS |
| sst_long:norte_centro | 1950–2025 | 0.107903 | 0.1079 | 0.005351 | 0.0054 | PASS |
| sst_long:norte_centro | 1900–2025 | 0.072659 | 0.0727 | 0.000091 | 0.0001 | PASS |
| sst_long:costa_sur | 1998–2025 | 0.064049 | 0.0640 | 0.736976 | 0.7370 | PASS |
| sst_long:costa_sur | 2003–2025 | 0.076398 | 0.0764 | 0.791699 | 0.7917 | PASS |
| sst_long:costa_sur | 2010–2025 | 0.201861 | 0.2019 | 0.752642 | 0.7526 | PASS |
| sst_long:costa_sur | 1979–2025 | -0.062818 | -0.0628 | 0.441111 | 0.4411 | PASS |
| sst_long:costa_sur | 1950–2025 | 0.115989 | 0.1160 | 0.002777 | 0.0028 | PASS |
| sst_long:costa_sur | 1900–2025 | 0.100949 | 0.1009 | 0.000000 | 0.0000 | PASS |

25 reference rows. Max slope difference: 0.00004912; max p difference: 0.00004874.
Extreme-year exclusion, sensitivity windows, missing values and data-error checks passed.
