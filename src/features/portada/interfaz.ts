import { porId } from "../../lib/lienzo";
import { SECCIONES, nombreCapa } from "./contenido";

export interface Interfaz {
  actualizar(progreso: number, y: number, enTransicion: boolean): void;
  detener(): void;
}

// Activa los paneles renderizados por React y mueve los medidores de profundidad.
export function crearSecciones(alEntrar: () => void): Interfaz {
  const contenedor = porId("secciones");
  const etiqueta = porId("mEtiqueta"), valor = porId("mValor"), marca = porId("marca"), capa = porId("mCapa"), pista = porId("pista");

  const botones = [...contenedor.querySelectorAll<HTMLButtonElement>('[data-entrar]')];
  botones.forEach(b => b.addEventListener('click', alEntrar));
  const nodos = SECCIONES.map((s, i) => ({ nodo: contenedor.children[i] as HTMLElement, de: s.de, a: s.a, panel: Boolean(s.variante) }));

  return {
    detener() { botones.forEach(b => b.removeEventListener("click", alEntrar)); },
    actualizar(progreso, y, enTransicion) {
      etiqueta.textContent = y > 30 ? "ORBIT" : y > 0 ? "ALTITUDE" : "DEPTH";
      valor.textContent = y > 30 ? "700 km" : y > 0 ? `${Math.round(y * 20)} m` : `${Math.round(-y * 5)} m`;
      marca.style.top = `calc(${progreso * 100}% - 6px)`;
      // sobre el cielo claro el panel necesita mas opacidad para leerse; bajo el agua puede ser mas transparente
      contenedor.style.setProperty("--panel-a", (0.5 + 0.4 * Math.max(0, Math.min(1, (y + 34) / 114))).toFixed(3));
      capa.textContent = nombreCapa(y);
      for (const { nodo, de, a, panel } of nodos) {
        const dentro = progreso >= de && progreso <= a;
        const borde = de === 0 ? a - progreso : Math.min(progreso - de, a - progreso);
        nodo.style.opacity = String(dentro ? panel ? 1 : Math.min(1, borde / 0.01) : 0);
        nodo.classList.toggle("activa", dentro);
        if (nodo.inert === dentro) {
          nodo.inert = !dentro;
          nodo.setAttribute("aria-hidden", String(!dentro));
        }
      }
      pista.style.opacity = progreso < 0.03 && !enTransicion ? "0.8" : "0";
    },
  };
}
