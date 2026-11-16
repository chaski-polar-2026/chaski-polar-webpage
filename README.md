# Chaski Polar

**Is the change real? Ocean trends off Peru, tested.**

Chaski Polar is an open, interactive educational web platform built for the NASA Space Apps Challenge 2026, challenge *"Be An Earth System Trend Detective!"*. Its case study asks: *"Is the Southern Ocean Connected to Peru's Upwelling System? Testing Trends and Long-Lag Associations, 1998–2025."*

It turns satellite and fisheries records into something people can explore and question: a 3D globe, a trend tester, species cards for small-scale fishing communities and educational games. The analysis behind it lives in a separate repository.

- **Live site:** https://chaski-polar-2026-webpage.vercel.app
- **This repository (website and games):** https://github.com/chaski-polar-2026/chaski-polar-webpage
- **Analysis repository (data processing and statistical tests):** https://github.com/chaski-polar-2026/data-treatment

> All relationships shown are statistical **associations, not proof of causation**. The site does not issue fishing alerts, identify fishing windows or forecast catches.

## What is in the site

| Route | What it is |
|---|---|
| `/` | **Landing page.** A scroll-driven descent from satellite orbit to the seabed in 3D (Three.js). Each layer shows one verified result. |
| `/explorer` | **Explorer.** A 3D globe with monthly data for 1998–2026 (Illustrated, Detailed and Satellite views), a timeline, guided tour and stories, year comparison, zone maps with the real coastline, and El Niño scenarios. Study areas: the Humboldt system and Peruvian sea, fish biological response, and the Southern Ocean and Antarctica. |
| `/research` | **Research.** Findings, a trend tester (choose a variable, region, source and period, then see how the result changes), trend map, short-term outlook, anchoveta response, IMARPE survey records, the Antarctica–Peru question, and sources and methods. The menu link "Trends" jumps to the trend sections of this page. |
| `/fishers` | **For fishers.** Plain-language context for coastal communities: species cards with recorded depth, season and temperature context, guides and diagrams. It is informational only. |
| `/juego` | **Games.** *Cardumen: the anchoveta saga* (anchoveta school survival, month by month), prologue scenes (Lumi, Kiri, Nara) and an analyst's desk where documents are checked and stamped between generations. An extra pixel-art game, *From Ice to Anchovy*, is at `/extra-game/juego.html`. |
| `/about` | Question, data, methods, limits, use of AI, team, license and credits. |
| `/help` | FAQ, glossary and a teacher's guide. |

## Run it locally

Requires [Node.js](https://nodejs.org) 20 or newer and [pnpm](https://pnpm.io) (bundled with Node through `corepack`).

```bash
corepack pnpm install
corepack pnpm dev       # development server (http://localhost:5173)
corepack pnpm build     # type check + production build in dist/
corepack pnpm lint      # code style check
corepack pnpm preview   # preview the production build
```

The build must finish without errors (`tsc -b && vite build`). To deploy on Vercel, import the repository; `vercel.json` makes routes such as `/explorer` work on reload.

## How to try it (a 5-minute tour)

1. Open `/`, scroll down through the layers, then press **Enter the explorer**.
2. In `/explorer`, drag the globe, switch **Illustrated / Detailed / Satellite**, pick a study area on the left and move the month slider. Click a zone to open its map, data and species context. The **Guide** button starts a guided tour.
3. In `/research`, open **Test a trend**, change the start year or exclude El Niño years, and watch the result change. Each result has its documentation and CSV download.
4. In `/fishers`, open a species card to read the recorded context. Open `/about` for methods, limits and credits.
5. In `/juego`, press **Start the journey**. Move with `WASD` or the arrow keys, rise with `Space` or `Q`, dive with `C` or `E`. Press `Space` or `Enter` to advance dialogue.

Handy game options (URL parameters):

- `/juego?rapido=20` speeds up game time (up to 20×).
- `/juego?generacion=3` starts the campaign at generation 3.
- To reach the analyst's desk quickly, open `/juego?rapido=20`, choose **Go to the anchoveta campaign**, skip dialogue and wait for the first year to end.

## Project structure

```
index.html                      application entry point
public/assets/                  data (series, monitor, scenarios, satellite maps), globe textures,
                                species and scene illustrations, 3D models
public/extra-game/              the extra pixel-art game (plain HTML/JS)
scripts/                        small preparation and verification scripts (trend reference, evidence, desk)
docs/                           project notes, guides and design documents
src/
  App.tsx                       routes; each page is loaded separately
  pages/                        landing, explorer, research, fishers, about, help, game, 404
  components/                   shared header, layout, UI pieces and icons
  contexts/DataContext.tsx      data loading for the explorer
  data/, lib/                   data readers and validation, globe atlas, colors, statistics
  features/
    portada/                    landing 3D scene, scroll, texts, transition
    explorer/                   globe, timeline, side panel, zone maps, species conditions
    research/, tendencias/,
    prediccion/, insights/,
    cruceros/, eventos/, nino/,
    physical-chain/, fuentes/   sections of the Research page
    pescadores/                 "For fishers" page, species cards, maps and guides
    juego/                      voxel game engine, scenes, HUD, dialogue, analyst's desk
    help/, guias/, recorrido/   Help page, in-page guides and guided tours
```

- Landing texts: `src/features/portada/contenido.ts`. Duration of each descent segment: `src/features/portada/scroll.ts`.
- Variables shown on the globe: `src/features/explorer/lib/variables.ts`.
- All data loading goes through `src/contexts/DataContext.tsx` and `src/data/loaders/`, so changing a data source does not affect the components.
- Species context (recorded depth, season, temperature, El Niño notes): `src/features/explorer/data/especies.json`.

## Data and sources

- **Chlorophyll:** [ESA Ocean Colour CCI v6](https://climate.esa.int/en/projects/ocean-colour/) (includes NASA SeaWiFS and MODIS-Aqua).
- **Sea surface temperature:** [NOAA Coral Reef Watch](https://coralreefwatch.noaa.gov/) v3.1.
- **El Niño 1+2 and SAM:** [NOAA PSL](https://psl.noaa.gov/data/climateindices/).
- **Antarctic sea ice:** [NSIDC Sea Ice Index G02135](https://nsidc.org/data/g02135).
- **Air over Antarctica and the coast:** [NASA POWER](https://power.larc.nasa.gov/).
- **Nutrients:** [World Ocean Atlas 2023](https://www.ncei.noaa.gov/access/world-ocean-atlas-2023/).
- **Fisheries:** [FAO Global Production](https://www.fao.org/fishery/en/collection/global_production), BCRP landings and IMARPE survey records.
- **Conditions monitor:** CMEMS reanalysis, OC-CCI, ICEN (IGP/ENFEN) and IMARPE anchoveta biomass.
- **El Niño scenarios:** built from monthly climatology and historical slopes against ICEN, following an assumed trajectory. They are scenarios, not forecasts.
- **Country outlines and coastline:** [Natural Earth](https://www.naturalearthdata.com/) (public domain).
- **Earth texture and relief:** NASA Blue Marble and elevation map, from [three-globe](https://github.com/vasturiano/three-globe).

The statistical tests, preregistered scripts and input checksums are in the analysis repository (`data-treatment`, see `docs/REPRODUCIR.md` there).

## Scope and limitations

- **The games are educational simulations with illustrative rules.** They use real environmental data (satellite chlorophyll and Niño 1+2) to set food and situations, but they are not a calibrated population model.
- **The conditions monitor describes associations and data coverage.** It is not an alert or a fishing forecast.
- **Species information describes what was recorded** in a given place and time; it is not a limit or an optimum.
- **Phytoplankton carbon** is shown as its own series. Game food is computed from chlorophyll, not carbon.
- **Temperature and oxygen at 100–200 m** remain future work for the explorer and the game.
- **Illustrations and maps are schematic** and not to scale.

## Use of AI

AI assistants were used as support for development, analysis, debugging and writing (OpenAI Codex and Anthropic Claude Code). The species, port, Antarctic, krill and penguin illustrations were generated with Google Gemini and then cleaned up by the team (background removal, cropping, compression). **No AI or machine-learning model runs in the live app**: the site and games call no AI service, the outlooks use simple regressions and persistence, and all interface text is fixed.

## Team

- S. Nikol A. Solaligue Limache: biologist and project lead.
- Ariana Cardenas Huaman: web and game development, data treatment and data science, interface design and integration.
- Aroon A. Delgado Huaychani: data treatment and analysis, and work on the website.
- Denis Quispe Condori: support in searching for data and images, and testing of the website and game.

## License

- **Source code:** [MIT License](LICENSE).
- **Texts, tables and datasets processed by the team:** CC BY 4.0 (reuse with credit to the Chaski Polar team); see [LICENSE-DATOS.md](LICENSE-DATOS.md).
- **Logo:** may be used if the Chaski Polar team is credited.
- **AI-generated illustrations** are not covered by these licenses.
- **Source datasets** keep the terms of their agencies (NASA, ESA, NOAA, Copernicus, NSIDC, FAO, BCRP, IMARPE). Fonts, maps and textures keep their own open licenses.

## Technology

[React](https://react.dev) and [TypeScript](https://www.typescriptlang.org) with [Vite](https://vite.dev); [Three.js](https://threejs.org) for the landing page and the games; [react-globe.gl](https://github.com/vasturiano/react-globe.gl) for the globe; [Recharts](https://recharts.org) for charts; [Zustand](https://zustand-demo.pmnd.rs) for state.
