# Comparar: primera experiencia de análisis para pesca artesanal

## Necesidad y alcance

El usuario inicial es un pescador o patrón artesanal que conoce su zona, pero necesita interpretar los registros ambientales. La prioridad propuesta es reconocer cambios de temperatura y clorofila, situarlos en una época del año y contrastar zonas. Es una hipótesis de diseño apoyada en el reporte de visión; todavía no es una necesidad validada mediante entrevistas con usuarios.

Los datos disponibles son resúmenes mensuales de áreas amplias. Permiten aprender del pasado; no permiten decidir si salir hoy, calcular capturas, elegir profundidad ni dimensionar una flota. El viento mensual tampoco sustituye un reporte de oleaje y navegación.

## Preguntas que organiza la interfaz

| Pregunta del usuario | Comparación | Conclusión posible |
| --- | --- | --- |
| ¿Cómo era este mes en otro año? | Misma zona, parámetro y mes; dos años | Cuánto cambió el valor y cómo se sitúa junto al promedio histórico del mismo mes |
| ¿Cómo suele cambiar el ambiente durante el año? | Dos meses de una zona; promedios históricos | Diferencia estacional descriptiva, calculada con años presentes en ambos meses |
| ¿Pasaba lo mismo en otra zona? | Mismo mes, año y parámetro; dos zonas | Diferencia ambiental regional, sin clasificar zonas como mejores para pescar |
| ¿Cambió también otra señal del ambiente? | Temperatura y clorofila para las mismas selecciones A y B | Lectura conjunta con unidades separadas; dos puntos no demuestran correlación |

Temperatura y clorofila se priorizan por su interpretación y disponibilidad. Viento, salinidad y nivel del mar siguen disponibles con explicaciones específicas. El resultado consolidado respalda estudiar El Niño y el fitoplancton peruano, pero una comparación de dos fechas no reproduce esos análisis ni valida recomendaciones de captura.

## Decisiones de UX implementadas

- Tres botones de propósito: Entre años, Entre meses y Entre zonas.
- Mostrar únicamente los desplegables necesarios para cada pregunta.
- Etiquetas A/B consistentes en controles, valores, interpretación, tabla y botones del globo.
- Resultado en unidades físicas, explicación breve y fechas visibles.
- Promedio histórico con número de años y extremos reales de cobertura; los huecos no se rellenan.
- Entre meses: años comunes dentro de 1998–2025, calculados por parámetro. Las coberturas de temperatura y clorofila se muestran por separado.
- Botones para intercambiar A/B y recuperar fechas recientes con datos. Los registros ausentes siguen explícitos.
- Tendencia descriptiva en un desplegable secundario, solo en Entre años; mínimo seis registros, sin afirmar significancia.
- Conservar las selecciones al volver desde Datos; botón explícito para usar una nueva zona seleccionada en el globo.
- Controles táctiles de al menos 44 px, selectores nativos y foco de teclado visible.

## Validación con usuarios que sigue pendiente

Pedir a un pescador que encuentre una diferencia entre dos años, explique qué significa y distinga el histórico de un pronóstico. Después, pedirle comparar dos meses y dos zonas. Observar si entiende A/B, las unidades, la cobertura y qué dato falta para tomar una decisión de faena. No evaluar solo si le gusta la apariencia.

## Referencias del proyecto

- `data_treatment/docs/REPORTE_VISION_PESCA_ARTESANAL.md`: necesidad, perfiles y supuestos pendientes.
- `data_treatment/docs/pruebas_pendientes/REPORTE_CONSOLIDADO_RESULTADOS.md`: asociaciones y límites científicos.
- `src/features/explorer/lib/modelo.ts` y `variables.ts`: datos que realmente están disponibles en esta web; no se añadieron fuentes ni se modificaron datos.

## Lectura temporal con gráficos

Entre años y Entre meses muestran una línea con los puntos intermedios en orden cronológico. En años se conserva el mes elegido para cada año; en meses se usan los registros disponibles de los años comunes a A/B y se expone el número de años por punto. El intervalo mensual no cruza diciembre hacia el año siguiente. Los datos ausentes interrumpen la línea.

A y B se señalan sobre el gráfico. Sus valores, zona y referencias se presentan debajo en filas con alineación izquierda/derecha. Una tabla desplegable permite leer todos los puntos sin depender del gráfico. Entre zonas conserva sus cuadros; los dos selectores de zona comparten una fila.
