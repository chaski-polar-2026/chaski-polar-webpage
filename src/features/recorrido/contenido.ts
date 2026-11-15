export const FAQ = [
  [
    "What is chlorophyll?",
    "Chlorophyll is the green pigment of phytoplankton, the tiny algae at the base of the sea food web. Satellites estimate it from the color of the water."
  ],
  [
    "Does more chlorophyll mean more fish?",
    "Not necessarily. Chlorophyll shows food at the base of the web. It does not measure how many fish there are."
  ],
  [
    "What is El Niño?",
    "A periodic warming of the Pacific. Off Peru, warmer water is associated with less chlorophyll in the central coast. The page shows associations, not proof of cause."
  ],
  [
    "What do the colors mean?",
    "For temperature, turbidity, wind, salinity, sea level, sea ice and the SAM index, colors show how far the value is from the usual level: blue is below and red is above. For chlorophyll, currents, nutrients and oxygen, colors show the amount itself. The legend tells you which one applies."
  ],
  [
    "Is this a forecast?",
    "No. The page shows what has been measured. Any outlook is labeled as such and shows how well that method worked in the past."
  ],
  [
    "Can I use this to decide whether to go fishing?",
    "No. It does not describe waves, wind at sea, port closures or fish presence. Always follow the maritime authority and official bulletins."
  ],
  [
    "What does \"statistically significant\" mean?",
    "A change that is unlikely to be only chance. A trend can disappear if you change the start year, so we show several periods."
  ],
  [
    "What is a reanalysis?",
    "A model that combines measurements with physics to fill the whole ocean. It is useful but it is not a direct measurement."
  ],
  [
    "Where does the data come from?",
    "NASA, ESA, NOAA, Copernicus Marine and NSIDC. See Sources on the Research page. Each series shows its period."
  ],
  [
    "Why is there no data for some zones or months?",
    "The data may not exist or may be uncertain. Missing never means zero."
  ],
  [
    "What about red tides?",
    "A red tide is a popular name for a harmful algal bloom: fast growth of certain microscopic algae that can harm marine life or people. IMARPE linked 40 such blooms between December 2016 and May 2017 to the unusually warm sea of the 2017 coastal El Niño (Sánchez et al., 2021). This page cannot detect them: it shows monthly averages for broad zones, and satellites cannot tell a harmful bloom from a harmless one. For alerts, follow IMARPE and the health authorities."
  ]
] as const;
export const PASOS = [
  {
    "selector": "#globo",
    "titulo": "The globe",
    "texto": "Each point is a zone. Drag to rotate; tap a zone to see its data."
  },
  {
    "selector": ".timeline-legend",
    "titulo": "The colors",
    "texto": "For temperature, wind, salinity, sea level and sea ice, blue is below the usual level and red is above. For chlorophyll, currents, nutrients and oxygen, colors show the amount itself. Check the legend for the selected measure."
  },
  {
    "selector": ".timeline-panel",
    "titulo": "The time bar",
    "texto": "Move through the months and years. The marks show strong El Niño events."
  },
  {
    "selector": "#variable-actual, #panel-datos h2, #tab-datos",
    "titulo": "The data panel",
    "texto": "Here you can read the value for the selected zone, with a short sentence that explains it."
  },
  {
    "selector": "#tab-comparar",
    "titulo": "Compare",
    "texto": "Compare two years, two months or two zones for the same measure."
  },
  {
    "selector": ".relato-orientacion a[href=\"/research\"]",
    "titulo": "Research and limits",
    "texto": "For tests and sources, open Research. This page describes the sea. It is not a forecast and not fishing or safety advice."
  }
] as const;
