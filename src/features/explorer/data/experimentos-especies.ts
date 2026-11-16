// Resultados documentados en data_treatment_new/docs/02_datos/condiciones_especies/reporte.md.
// Los puntos ensayados y las temperaturas seleccionadas no son límites generales de la especie.
type Experimento = {
  etapa: string
  lugar: string
  valores: { variable: string; valor: string; detalle: string }[]
  resultado: string
  alcance: string
  contexto: string
  limites: string
  fuente: { nombre: string; enlace: string; localizador: string }
  resumen?: boolean
}

export const EXPERIMENTOS: Partial<Record<string, Experimento>> = {
  anchoveta: {
    etapa: 'Larvae',
    lugar: 'Peru',
    valores: [{ variable: 'Temperature', valor: '18.5 °C', detalle: 'Tested with plentiful food' }],
    resultado: 'Warm, well-fed larvae grew faster in some comparisons. Results differed between batches.',
    alcance: 'A feeding trial with larvae; no preferred temperature range was established.',
    contexto: 'Larvae came from adults caught off Lima. The study compared two temperatures and different food supplies during the first month of life.',
    limites: 'One warm, well-fed batch did not grow significantly faster than the cold, well-fed batch. Temperature and food must be read together; satellite chlorophyll is not a measurement of larval prey.',
    fuente: { nombre: 'Ofelio et al. · 2023', enlace: 'https://doi.org/10.1038/s41598-023-43168-w', localizador: 'Results, Figure 1 and Table 1' },
  },
  concha_abanico: {
    etapa: 'Scallops of different sizes',
    lugar: 'Chile',
    valores: [{ variable: 'Salinity', valor: '27 and 30 ‰', detalle: 'Two tested values at 12 °C' }],
    resultado: 'Both treatments left a positive energy balance available for growth.',
    alcance: 'Two tested salinities, rather than the lower and upper limits of a favourable range.',
    contexto: 'Cultured scallops from Chiloé were acclimated to different salinities. The study measured food intake and energy costs at a constant temperature.',
    limites: 'Energy available for growth is not a direct measurement of population growth. Higher salinities were not assessed in this comparison; 30 ‰ is not a species maximum.',
    fuente: { nombre: 'Navarro & González · 1998', enlace: 'https://doi.org/10.1016/S0044-8486(98)00310-X', localizador: 'Section 3.6, Figure 6 and Discussion' },
  },
  pulpo: {
    etapa: 'Paralarvae · 1–4 days old',
    lugar: 'Chile',
    valores: [{ variable: 'Selected temperature', valor: '21.3–23.9 °C', detalle: 'Approximate selection interval' }],
    resultado: 'Paralarvae selected temperatures averaging 22.8 °C in a laboratory gradient.',
    alcance: 'A behavioural preference in early life, not a result for adult octopus.',
    contexto: 'Offspring of females collected in Coloso, Antofagasta, moved along a horizontal temperature gradient. Selected temperatures varied with age; the paralarvae were fasting.',
    limites: 'The interval describes temperatures selected in this experiment. It is not a tolerance range or a demonstrated optimum for survival or growth.',
    fuente: { nombre: 'Zúñiga et al. · 2013', enlace: 'https://doi.org/10.1016/j.jtherbio.2012.11.003', localizador: 'Section 2.1, Figure 5 and Discussion' },
  },
  perico: {
    etapa: 'Juveniles',
    lugar: 'Miami, USA',
    valores: [{ variable: 'Temperature', valor: '28 °C', detalle: 'Best treatment for the measured traits' }],
    resultado: 'This treatment had the highest sustained swimming performance and absolute aerobic scope among the temperatures tested.',
    alcance: 'A result for juveniles in this trial; no favourable range for Peru was established.',
    contexto: 'Laboratory-reared juveniles from adults caught off Miami were acclimated to four temperatures and tested in a swimming tunnel.',
    limites: 'A single treatment cannot define a full optimum range. Optimal swimming speed, a different measure, did not differ significantly between temperatures.',
    fuente: { nombre: 'Heuer et al. · 2021', enlace: 'https://doi.org/10.3389/fmars.2021.654276', localizador: 'Table 1, Results and Figures 1–3' },
  },
  caballa: {
    etapa: 'Eggs',
    lugar: 'Laboratory study',
    valores: [
      { variable: 'Temperature', valor: '20–24 °C', detalle: 'Reported higher hatching' },
      { variable: 'Salinity', valor: '33–35 psu', detalle: 'Reported higher hatching' },
    ],
    resultado: 'The study abstract reports the highest hatching rates under these temperature and salinity conditions.',
    alcance: 'Egg hatching only. The full methods still need review before applying these values elsewhere.',
    contexto: 'A Korean research team tested temperature and salinity during egg development and hatching under laboratory conditions. These values are explicitly reported in the English abstract.',
    limites: 'Broodstock origin, replication and the combined effects of both variables have not been verified from the full article. The findings do not establish conditions for adult fish in Peru.',
    fuente: { nombre: 'Hwang et al. · 2008', enlace: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001293507', localizador: 'English abstract · Journal of Aquaculture 21(4), 234–238' },
    resumen: true,
  },
  corvina: {
    etapa: 'Juveniles',
    lugar: 'Chile',
    valores: [{ variable: 'Dissolved oxygen', valor: '7.8 mg/L', detalle: 'Oxygenated reference treatment' }],
    resultado: 'During low-oxygen exposure, mucus lost some antibacterial activity compared with this oxygenated treatment.',
    alcance: 'An immune-function comparison, not a minimum oxygen requirement.',
    contexto: 'Researchers compared oxygenated water with short and repeated low-oxygen exposures in cultured juveniles. Mucus activity was tested against two bacterial pathogens.',
    limites: 'Responses depended on the pathogen and treatment, and recovered after reoxygenation. This comparison establishes neither a lower requirement nor an upper favourable limit.',
    fuente: { nombre: 'Vega et al. · 2024', enlace: 'https://doi.org/10.3390/ani14132014', localizador: 'Sections 2.2–2.3 and Figure 3' },
  },
}
