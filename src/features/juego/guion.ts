/* Lo que dicen los guías en cada momento del juego. Las cifras salen de los datos reales del motor del mar.
   Cuidado científico: la Antártida y el Perú se conectan por los animales que migran, no por el mar
   (los análisis del proyecto no encontraron relación entre el fitoplancton antártico y el peruano). */
import type { Linea } from "./dialogo/estado";
import type { PuntoNara } from "./escenas/nara";
import type { Mes } from "./logica/cardumen";
import type { Mar } from "./motor/mar";

const MESES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const n1 = new Intl.NumberFormat("en", { maximumFractionDigits: 1, signDisplay: "exceptZero" });
const n2 = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

export const META_KIRI = 10;

/** Clorofila real del último verano antártico medido, como frase de ORBI */
function ultimoVeranoAntartico(mar: Mar): string {
  for (let i = mar.fechas.length - 1; i >= 0; i--) {
    const e = mar.estado("peninsula_antartica", i);
    const mes = Number(e.fecha.slice(5, 7));
    if (e.clorofila != null && (mes <= 3 || mes >= 11)) return `In ${MESES[mes - 1]} ${e.fecha.slice(0, 4)}, I measured ${n2.format(e.clorofila)} mg/m³ of chlorophyll off the Antarctic Peninsula.`;
  }
  return "";
}

export function introLumi(mar: Mar): Linea[] {
  const dato = ultimoVeranoAntartico(mar);
  return [
    { quien: "orbi", texto: "Hello, I’m ORBI, a satellite. From up here I measure the color of the sea: where there is phytoplankton, the sea looks greener." },
    ...(dato ? [{ quien: "orbi" as const, texto: `${dato} It is spring and the sea ice is beginning to open.` }] : []),
    { quien: "gaia", texto: "Lumi is a diatom, a type of phytoplankton. To grow, she needs light from above and nutrients rising from below." },
    { quien: "gaia", texto: "Collect the blue and green nutrient tokens and return to the light. The tokens are illustrative. Little sunlight reaches beneath the ice. When you are full, you will divide. Use WASD to swim, Space or Q to rise, and C or E to dive." },
  ];
}

export const finLumi: Linea[] = [
  { quien: "gaia", texto: "That is how a bloom begins: each cell divides again and again. Nutrients are plentiful here; light and iron are often scarce." },
  { quien: "orbi", texto: "And someone is coming to eat…" },
];

export function introKiri(): Linea[] {
  return [
    { quien: "gaia", texto: "Kiri is an Antarctic krill, a small crustacean that eats phytoplankton." },
    { quien: "gaia", texto: `Eat ${META_KIRI} green patches and dodge the penguins: if they catch you, you lose some of the food you ate.` },
    { quien: "kiri", texto: "Got it! I’ll stay away from the penguins." },
  ];
}

export const finKiri: Linea[] = [
  { quien: "gaia", texto: "Krill feeds penguins, seals and whales: it supports almost all Antarctic life." },
  { quien: "orbi", texto: "Here comes one of those whales. She is about to begin a very long journey." },
];

export const introNara: Linea[] = [
  { quien: "gaia", texto: "Nara is a humpback whale. In summer she eats krill in Antarctica; in winter she travels north to have her calf in warm waters off Ecuador and northern Peru." },
  { quien: "gaia", texto: "She eats very little on the journey and lives on stored fat. Use the currents (arrows) to save energy." },
  { quien: "orbi", texto: "Swim to the yellow ring off Piura." },
];

export const puntoNara: Record<PuntoNara, Linea[]> = {
  drake: [{ quien: "orbi", texto: "You are in the Antarctic Circumpolar Current. It circles the continent and pushes east. Leave it heading north." }],
  chile: [{ quien: "gaia", texto: "The Humboldt Current carries cold water north along the coast. Use it!" }],
  peru: [{ quien: "orbi", texto: "You are off Peru. Here the wind brings cold, nutrient-rich water to the surface, making these waters rich in anchoveta." }],
};

export const finNara: Linea[] = [
  { quien: "gaia", texto: "Nara reached northern Peru, like the humpback whales that arrive each year between June and October." },
  { quien: "gaia", texto: "The whale connects Antarctica and Peru, but anchoveta depend on the sea off their coast." },
  { quien: "orbi", texto: "In our data, Antarctic phytoplankton does not rise and fall together with Peru’s. Here, El Niño has the strongest influence." },
  { quien: "orbi", texto: "Look down there: a school of anchoveta. Anchi, it is your turn." },
];

/** Contexto de cada año de la campaña */
const CONTEXTO_ANIO: Record<number, Linea> = {
  2004: { quien: "gaia", texto: "A year of cold water and abundant food: a good time to learn." },
  1998: { quien: "gaia", texto: "This is the 1997–98 El Niño, one of the strongest on record. Get ready." },
  2000: { quien: "gaia", texto: "After the strong El Niño, the water cooled again. The school is smaller: it is time to rebuild." },
  2017: { quien: "gaia", texto: "A coastal El Niño arrives this year: a short, uneven event early in the year off Peru and Ecuador." },
  2023: { quien: "gaia", texto: "Another, longer coastal El Niño. The first anchoveta fishing season was suspended that year." },
  2026: { quien: "orbi", texto: "El Niño 2026 is underway. I have data through August: you will play from January to August." },
};

/** Lo que dicen los guías al empezar cada año del cardumen, con los datos reales de enero frente a Chimbote */
export function introCardumen(mar: Mar, anio: number, primera: boolean): Linea[] {
  const e = mar.estado("chimbote", mar.indice(anio, 1));
  const temp = e.anomaliaTemp == null ? "" : ` the sea was ${n1.format(e.anomaliaTemp)} °C compared with normal, and`;
  const lineas: Linea[] = [{ quien: "orbi", texto: `Year ${anio}. In January off Chimbote,${temp} food was at ${Math.round(e.alimento * 100)}% of normal.` }];
  const contexto = CONTEXTO_ANIO[anio];
  if (contexto) lineas.push(contexto);
  if (primera) lineas.unshift(
    { quien: "gaia", texto: "Anchi, you guide the school for one year. Eat the green patches: this is the phytoplankton ORBI measures from space." },
    { quien: "gaia", texto: "W, A, S and D move you relative to the camera; Space moves up and C down. Shift gives a boost. Press F to gather the school: it is better protected but eats less." },
    { quien: "gaia", texto: "Each coastal zone has its own food supply each month. If one runs out, look in another." },
  );
  return lineas;
}

/** Diálogos que aparecen la primera vez que ocurre algo durante el año del cardumen */
export function hitoCardumen(id: string, m: Mes): Linea[] {
  switch (id) {
    case "nino": return [
      { quien: "orbi", texto: `The Niño 1+2 index is ${n1.format(m.nino12 ?? 0)} °C: this is El Niño. Warm water brings fewer nutrients and phytoplankton declines, especially in Chimbote and Callao.` },
      { quien: "gaia", texto: "During El Niño the oxygen minimum zone sinks: there is more room below, but less food. Paita changes little and may be a refuge." },
    ];
    case "oxigeno_alto": return [{ quien: "gaia", texto: "The oxygen minimum zone has risen, pushing us toward the surface, where guanays (Peruvian cormorants) hunt. If you see a shadow above, dive." }];
    case "veda": return [{ quien: "orbi", texto: "Food on the central coast fell below half of normal: there is a fishing ban this month and purse seiners stay in port." }];
    case "red": return [{ quien: "gaia", texto: "A purse seiner is setting its net! Leave the circle or dive below the net. The school is easier to catch when grouped together." }];
    default: return [];
  }
}

/** Cierre de la campaña con los datos reales de 2026 */
export function finalCampana(mar: Mar): Linea[] {
  const ene = mar.indice(2026, 1);
  let max = -Infinity, mesMax = 1;
  for (let m = 1; m <= 12; m++) {
    const i = mar.indice(2026, m);
    const n = i >= 0 ? mar.estado("chimbote", i).nino12 : null;
    if (n != null && n > max) { max = n; mesMax = m; }
  }
  const inicio = ene >= 0 ? mar.estado("chimbote", ene).nino12 : null;
  const lineas: Linea[] = [];
  if (inicio != null && Number.isFinite(max)) lineas.push({ quien: "orbi", texto: `In 2026 the Niño 1+2 index went from ${n1.format(inicio)} °C in January to ${n1.format(max)} °C in ${MESES[mesMax - 1]}. The second 2026 anchoveta fishing season was canceled: zero quota.` });
  lineas.push(
    { quien: "gaia", texto: "Generation after generation, the school lived through the same years measured by satellites." },
    { quien: "orbi", texto: "This story is not over: satellites are still measuring." },
  );
  return lineas;
}
