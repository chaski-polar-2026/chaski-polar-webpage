// Referencias y alcance contrastados con el reporte documental de las doce especies.
const EXPERIMENTALES = [
  {
    autores: 'Ofelio, C., Moyano, M., Sswat, M., Rioual, F., Moullec, F., Aguirre-Velarde, A. & Peck, M. A. (2023)',
    titulo: "Temperature and prey density drive growth and otolith formation of the world's most valuable fish stock",
    publicacion: 'Scientific Reports, 13, 16001',
    enlace: 'https://doi.org/10.1038/s41598-023-43168-w',
    alcance: 'Anchoveta larvae: temperature, food supply and growth. Results differed between batches; no general preferred range was established.',
  },
  {
    autores: 'Zúñiga, O., Olivares, A., Rojo, M., Chimal, M. E., Díaz, F., Uriarte, I. & Rosas, C. (2013)',
    titulo: 'Thermoregulatory behavior and oxygen consumption of Octopus mimus paralarvae: The effect of age',
    publicacion: 'Journal of Thermal Biology, 38(2), 86–91',
    enlace: 'https://doi.org/10.1016/j.jtherbio.2012.11.003',
    alcance: 'Pulpo: temperature selected by fasting paralarvae aged 1–4 days. Behavioural preference, not an optimum for adult octopus.',
  },
  {
    autores: 'Navarro, J. M. & González, C. M. (1998)',
    titulo: 'Physiological responses of the Chilean scallop Argopecten purpuratus to decreasing salinities',
    publicacion: 'Aquaculture, 167(3–4), 315–327',
    enlace: 'https://doi.org/10.1016/S0044-8486(98)00310-X',
    alcance: 'Concha de abanico: salinity and energy available for growth under laboratory conditions. Tested values do not define the full favourable range.',
  },
  {
    autores: 'Heuer, R. M., Stieglitz, J. D., Pasparakis, C., Enochs, I. C., Benetti, D. D. & Grosell, M. (2021)',
    titulo: 'The Effects of Temperature Acclimation on Swimming Performance in the Pelagic Mahi-Mahi (Coryphaena hippurus)',
    publicacion: 'Frontiers in Marine Science, 8, 654276',
    enlace: 'https://doi.org/10.3389/fmars.2021.654276',
    alcance: 'Perico juveniles: swimming performance and aerobic scope after temperature acclimation in Miami. Not a validated range for Peru.',
  },
  {
    autores: 'Hwang, H.-K., Kim, D.-H., Park, M.-W., Yoon, S.-J. & Lee, Y.-H. (2008)',
    titulo: 'Effects of Water Temperature and Salinity on the Egg and Larval of Chub Mackerel Scomber japonicus',
    publicacion: 'Journal of Aquaculture, 21(4), 234–238 · UCI G704-000924.2008.21.4.014',
    enlace: 'https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001293507',
    alcance: 'Caballa: temperature and salinity associated with higher egg hatching. English abstract reviewed; full methods still need review.',
  },
  {
    autores: 'Vega, B., Toro-Araneda, T., Alvarado, J. F., Cárcamo, C. B., Guzmán, F., Acosta, F., Oliva, M., Serrano, E., Galarza, J. I. & Álvarez, C. A. (2024)',
    titulo: 'Effects of Hypoxia on the Antibacterial Activity of Epidermal Mucus from Chilean Meagre (Cilus gilberti)',
    publicacion: 'Animals, 14(13), 2014',
    enlace: 'https://doi.org/10.3390/ani14132014',
    alcance: 'Corvina juveniles: mucus antibacterial activity during low-oxygen exposure and reoxygenation. Not a minimum oxygen requirement.',
  },
]

const CONTEXTO = [
  {
    autores: 'Castillo, P. R. et al. (2022)',
    titulo: 'Characteristics of anchoveta (Engraulis ringens) schools in the optimum zone and the physiological stress zone of its distribution between 2011 and 2021',
    publicacion: 'Fisheries Oceanography, 31(5), 510–523',
    enlace: 'https://doi.org/10.1111/fog.12601',
    alcance: 'Abstract reviewed. Oceanographic zones and school observations were not adopted as physiological limits.',
  },
  {
    autores: 'Valdez, C., Grados, D., Pozada, M., Gutiérrez, M. & Peraltilla, S. (2023)',
    titulo: 'Seasonal oceanographic preferent ranges of jack mackerel (Trachurus murphyi) habitat off the Peruvian coast between 1992 and 2023',
    publicacion: 'SPRFMO Scientific Committee · SC11–HM04_rev1',
    enlace: 'https://www.sprfmo.int/assets/Meetings/02-SC/11th-SC-2023/Habitat-Monitoring/SC11-HM04_rev1-PER-Seasonal-oceanographic-preferent-ranges-of-JM-habitat-off-Peruvian-coast-between-1992-2023.pdf',
    alcance: 'Technical document reviewed. Seasonal ranges derived from fishing hauls do not establish physiological benefits.',
  },
  {
    autores: 'Torrejón-Magallanes, J., Grados, D. & Lau-Medrano, W. (2019)',
    titulo: 'Spatio-temporal distribution modeling of dolphinfish (Coryphaena hippurus) in the Pacific Ocean off Peru using artisanal longline fishery data',
    publicacion: 'Deep-Sea Research Part II, 169–170, 104665',
    enlace: 'https://doi.org/10.1016/j.dsr2.2019.104665',
    alcance: 'Abstract reviewed. Habitat associations based on catch per unit effort were not treated as evidence of wellbeing.',
  },
  {
    autores: 'Saldarriaga Mendoza, M., Perez, A. & Palacios León, J. (2018)',
    titulo: 'Importancia de las características oceanográficas sobre la estructura poblacional del recurso merluza (Merluccius gayi peruanus) durante otoño del 2014 y 2015',
    publicacion: 'Informe Instituto del Mar del Perú, 45(1)',
    enlace: 'https://repositorio.imarpe.gob.pe/items/349fb341-cee6-405f-bd11-b71c19d0b951',
    alcance: 'Abstract reviewed. Depth-specific habitat observations by age are not general favourable ranges.',
  },
  {
    autores: 'Staaf, D. J., Zeidberg, L. D. & Gilly, W. F. (2011)',
    titulo: 'Effects of temperature on embryonic development of the Humboldt squid Dosidicus gigas',
    publicacion: 'Marine Ecology Progress Series, 441, 165–175',
    enlace: 'https://doi.org/10.3354/meps09389',
    alcance: 'Reference and excerpts located; full text not retrieved. No numerical range was adopted for pota.',
  },
  {
    autores: 'Ttito Sánchez, H. K. (2022)',
    titulo: 'Situación poblacional del bonito (Sarda chiliensis chiliensis) ante la explotación pesquera en el litoral peruano',
    publicacion: 'Undergraduate thesis · Universidad Nacional Mayor de San Marcos',
    enlace: 'https://hdl.handle.net/20.500.12672/18426',
    alcance: 'Repository record and abstract reviewed. No experimental environmental limits were adopted.',
  },
  {
    autores: 'Espino, M. (1990)',
    titulo: 'El Niño: su impacto sobre los peces demersales del Perú',
    publicacion: 'Boletín Instituto del Mar del Perú, 14(2)',
    enlace: 'https://revistas.imarpe.gob.pe/index.php/boletin/article/download/190/181/350',
    alcance: 'Source documented in the data catalogue. Bottom-temperature cruise records for cachema and lorna are observations, not optima.',
  },
  {
    autores: 'Guo, C. et al. (2021)',
    titulo: 'Fish Specialize Their Metabolic Performance to Maximize Bioenergetic Efficiency in Their Local Environment: Conspecific Comparison Between Two Stocks of Pacific Chub Mackerel (Scomber japonicus)',
    publicacion: 'Frontiers in Marine Science, 8, 613965',
    enlace: 'https://doi.org/10.3389/fmars.2021.613965',
    alcance: 'Methods, results and discussion reviewed. Differences between stocks and sizes do not establish an optimum for Peruvian caballa.',
  },
  {
    autores: 'Ramajo, L. et al. (2019)',
    titulo: 'Physiological responses of juvenile Chilean scallops (Argopecten purpuratus) to isolated and combined environmental drivers of coastal upwelling',
    publicacion: 'ICES Journal of Marine Science, 76(6), 1836–1849',
    enlace: 'https://doi.org/10.1093/icesjms/fsz080',
    alcance: 'Abstract reviewed. Improvements in some physiological traits coexisted with earlier and higher mortality; no extra thresholds were adopted.',
  },
  {
    autores: 'Zapata, M. A. & Vieyra, E. G. (2017 volume; editorial record published in 2018)',
    titulo: 'Adaptación al cautiverio y cultivo experimental de Cynoscion analis (cachema)',
    publicacion: 'Manglar, 14(2), 87–94',
    enlace: 'https://doi.org/10.17268/manglar.2017.012',
    alcance: 'Abstract and published passages reviewed. Tank averages in a captivity trial are not demonstrated favourable environmental limits.',
  },
  {
    autores: 'Atoche-Suclupe, D. & Castillo, D. (2024)',
    titulo: 'Feeding of Sciaena deliciosa (Perciformes: Sciaenidae): A seasonal analysis in north-central Peru',
    publicacion: 'Revista de Biología Marina y Oceanografía, 59(3), 216–227',
    enlace: 'https://doi.org/10.22370/rbmo.2024.59.3.4893',
    alcance: 'Published passages reviewed. Seasonal diet and environmental context do not establish favourable temperature limits for lorna.',
  },
]

function Referencias({ referencias }: { referencias: typeof EXPERIMENTALES }) {
  return <ol className="bibliografia-lista">
    {referencias.map(r => <li key={r.enlace}>
      <p className="bibliografia-autores">{r.autores}.</p>
      <cite><a href={r.enlace} target="_blank" rel="noreferrer">{r.titulo}</a></cite>
      <p className="bibliografia-publicacion">{r.publicacion}.</p>
      <p className="bibliografia-alcance">{r.alcance}</p>
    </li>)}
  </ol>
}

export default function BibliografiaEspecies() {
  return <section className="seccion bibliografia-especies" id="species-bibliography" aria-labelledby="species-bibliography-title">
    <h2 id="species-bibliography-title">Species bibliography</h2>
    <p>Studies behind the experimental findings in Explorer and For fishers. Results apply to the life stage and conditions studied; they do not predict catches or define general favourable ranges.</p>
    <h3>Sources used in the experimental cards</h3>
    <Referencias referencias={EXPERIMENTALES} />
    <p className="bibliografia-datos">Associated dataset: Heuer et al. (2020), <a href="https://doi.org/10.7266/n7-xd7p-yj29" target="_blank" rel="noreferrer">Effects of temperature on swim performance of mahi-mahi (Coryphaena hippurus)</a>, GRIIDC. Dataset metadata were consulted; the data were not reanalysed.</p>
    <details className="bibliografia-contexto">
      <summary>Other studies reviewed ({CONTEXTO.length})</summary>
      <p>These sources informed the review of all 12 species. Their habitat observations, fishery associations or incomplete evidence were not added as experimental favourable ranges.</p>
      <Referencias referencias={CONTEXTO} />
    </details>
    <p className="bibliografia-fecha">Literature review: 15 November 2026. Original publication titles are retained.</p>
  </section>
}
