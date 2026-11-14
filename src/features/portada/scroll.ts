// Relación entre el scroll y la altura de la cámara. y = 0 es la superficie del mar.
export const Y_ESPACIO = 80;
export const Y_FONDO = -40;

// [progreso, altura]: cada tramo dura lo necesario para que su texto coincida con la capa visible
export const TRAMOS: readonly (readonly [number, number])[] = [[0, Y_ESPACIO], [0.12, 40], [0.22, 25], [0.31, 0], [0.42, -4.5], [0.52, -5], [0.63, -9], [0.72, -30], [0.82, -33], [1, Y_FONDO]];

export function posicionScroll(progreso: number): number {
  const recorrido = document.getElementById('portada-recorrido')!;
  // Redondear hacia arriba evita quedar un subpíxel antes del inicio del panel.
  return Math.ceil(recorrido.offsetTop + progreso * (recorrido.offsetHeight - innerHeight));
}

export function alturaEn(p: number): number {
  for (let i = 0; i < TRAMOS.length - 1; i++) {
    const [pa, ya] = TRAMOS[i]!, [pb, yb] = TRAMOS[i + 1]!;
    if (p <= pb) return ya + ((yb - ya) * (p - pa)) / (pb - pa);
  }
  return Y_FONDO;
}

export interface EstadoScroll {
  /** 0 arriba, 1 al fondo */
  progreso: number;
}

export function seguirScroll(): EstadoScroll & { detener(): void } {
  const estado = { progreso: 0, detener: () => {} };
  const recorrido = document.getElementById("portada-recorrido")!;
  const leer = () => {
    const max = recorrido.offsetHeight - innerHeight;
    estado.progreso = max > 0 ? Math.max(0, Math.min(1, (scrollY - recorrido.offsetTop) / max)) : 0;
  };
  const restauracion = history.scrollRestoration;
  history.scrollRestoration = "manual";
  if (!location.hash) scrollTo(0, 0);
  addEventListener("scroll", leer, { passive: true });
  addEventListener("resize", leer);
  leer();
  estado.detener = () => { removeEventListener("scroll", leer); removeEventListener("resize", leer); history.scrollRestoration = restauracion; };
  return estado;
}
