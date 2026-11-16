/* Composición original para Cardumen: vals acuático de consola, en tres voces.
   Notas MIDI; cada casilla es una corchea y el cero deja respirar la melodía. */
const COMPASES = [
  { acorde: [48, 55, 60, 64], melodia: [76, 0, 79, 81, 79, 76] },
  { acorde: [47, 55, 59, 62], melodia: [74, 0, 71, 74, 79, 0] },
  { acorde: [45, 52, 57, 60], melodia: [72, 76, 81, 0, 79, 76] },
  { acorde: [43, 53, 59, 62], melodia: [74, 0, 77, 76, 74, 71] },
  { acorde: [41, 53, 57, 60], melodia: [69, 72, 77, 79, 81, 0] },
  { acorde: [40, 52, 55, 59], melodia: [79, 76, 74, 0, 71, 67] },
  { acorde: [38, 53, 57, 60], melodia: [69, 74, 77, 0, 76, 72] },
  { acorde: [43, 53, 59, 62], melodia: [71, 74, 79, 0, 74, 0] },
  { acorde: [48, 55, 60, 64], melodia: [79, 0, 84, 83, 81, 79] },
  { acorde: [47, 55, 59, 62], melodia: [78, 79, 83, 0, 81, 79] },
  { acorde: [45, 52, 57, 60], melodia: [76, 0, 72, 76, 81, 84] },
  { acorde: [40, 52, 56, 62], melodia: [83, 0, 80, 76, 74, 0] },
  { acorde: [41, 53, 57, 60], melodia: [81, 79, 77, 0, 72, 69] },
  { acorde: [43, 53, 59, 62], melodia: [71, 74, 79, 77, 74, 71] },
  { acorde: [48, 55, 60, 64], melodia: [72, 0, 76, 79, 76, 0] },
  { acorde: [43, 53, 59, 62], melodia: [74, 71, 67, 0, 71, 74] },
]

/** Programa por adelantado con el reloj de audio para no depender de los FPS. */
export function iniciarMusica(c: AudioContext, destino: AudioNode): () => void {
  const mezcla = c.createGain()
  mezcla.gain.value = document.hidden ? 0 : 1
  const filtro = c.createBiquadFilter()
  filtro.type = 'lowpass'
  filtro.frequency.value = 2800
  const eco = c.createDelay(1)
  eco.delayTime.value = 60 / 108 / 2 * 1.5
  const retorno = c.createGain()
  retorno.gain.value = 0.18
  mezcla.connect(filtro).connect(destino)
  filtro.connect(eco).connect(retorno).connect(destino)

  const voces = new Set<OscillatorNode>()
  const corchea = 60 / 108 / 2
  let paso = 0
  let siguiente = c.currentTime + 0.08
  let detenido = false

  function tocar(midi: number, tiempo: number, duracion: number, tipo: OscillatorType, volumen: number) {
    const voz = c.createOscillator()
    const envolvente = c.createGain()
    voz.type = tipo
    voz.frequency.value = 440 * 2 ** ((midi - 69) / 12)
    envolvente.gain.setValueAtTime(0, tiempo)
    envolvente.gain.linearRampToValueAtTime(volumen, tiempo + 0.012)
    envolvente.gain.exponentialRampToValueAtTime(0.0001, tiempo + duracion)
    voz.connect(envolvente).connect(mezcla)
    voces.add(voz)
    voz.onended = () => { voces.delete(voz); voz.disconnect(); envolvente.disconnect() }
    voz.start(tiempo)
    voz.stop(tiempo + duracion + 0.02)
  }

  function programar() {
    if (detenido || document.hidden || c.state !== 'running') return
    // Tras una suspensión se retoma sin reproducir de golpe las notas atrasadas.
    if (siguiente < c.currentTime) siguiente = c.currentTime + 0.04
    while (siguiente < c.currentTime + 0.25) {
      const compas = COMPASES[Math.floor(paso / 6) % COMPASES.length]
      const pulso = paso % 6
      const melodia = compas.melodia[pulso]
      if (melodia) tocar(melodia, siguiente, corchea * 1.65, 'square', 0.075)
      // Arpegio ascendente y descendente, como burbujas bajo la melodía.
      const indice = [1, 2, 3, 2, 1, 3][pulso]
      tocar(compas.acorde[indice] + 12, siguiente, corchea * 0.8, 'triangle', 0.055)
      if (pulso % 2 === 0) {
        tocar(compas.acorde[pulso === 2 ? 1 : 0], siguiente, corchea * 1.7, 'triangle', 0.14)
      }
      paso = (paso + 1) % (COMPASES.length * 6)
      siguiente += corchea
    }
  }

  function visibilidad() {
    mezcla.gain.setTargetAtTime(document.hidden ? 0 : 1, c.currentTime, 0.08)
    if (!document.hidden) { siguiente = c.currentTime + 0.08; programar() }
  }

  const reloj = window.setInterval(programar, 100)
  document.addEventListener('visibilitychange', visibilidad)
  programar()
  return () => {
    detenido = true
    clearInterval(reloj)
    document.removeEventListener('visibilitychange', visibilidad)
    for (const voz of voces) voz.stop()
    mezcla.disconnect()
    filtro.disconnect()
    eco.disconnect()
    retorno.disconnect()
  }
}
