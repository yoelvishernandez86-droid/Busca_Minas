import { useState } from "react";
import Caja, { type CajaType } from "../components/caja";
import VictoriaODerrota from "../components/victoriaODerrota";
import "./pantallaPrincipal.css";

// Busca las casillas vecinas, incluidas las diagonales, sin cruzar los bordes.
function sacarCajasAledañas(
  cajaID: number,
  cajas: CajaType[],
  numeroCajas: number,
): CajaType[] {
  const fila = Math.floor(cajaID / numeroCajas);
  const columna = cajaID % numeroCajas;

  return cajas.filter((caja) => {
    const filaVecina = Math.floor(caja.id / numeroCajas);
    const columnaVecina = caja.id % numeroCajas;

    return (
      caja.id !== cajaID &&
      Math.abs(filaVecina - fila) <= 1 &&
      Math.abs(columnaVecina - columna) <= 1
    );
  });
}

// Prepara un tablero nuevo con un 15 % de minas y las pistas de cada casilla.
function crearCajas(numeroCajas: number): CajaType[] {
  const totalCajas = numeroCajas * numeroCajas;
  const numeroMinas = Math.round(totalCajas * 0.15);
  const posiciones = Array.from({ length: totalCajas }, (_, i) => i);

  // Barajamos las posiciones para repartir las minas sin repetir casillas.
  for (let i = posiciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [posiciones[i], posiciones[j]] = [posiciones[j], posiciones[i]];
  }

  const posicionesConMina = new Set(posiciones.slice(0, numeroMinas));

  // Todas las casillas empiezan tapadas y sin bandera.
  const cajasNuevas: CajaType[] = Array.from(
    { length: totalCajas },
    (_, i) => ({
      id: i,
      posicion: `${i}`,
      mina: posicionesConMina.has(i),
      bandera: false,
      descubierta: false,
      minasAlrededor: 0,
      mostrarNumero: false,
    }),
  );

  // Cada pista indica cuántas minas hay en las casillas vecinas.
  return cajasNuevas.map((caja) => ({
    ...caja,
    minasAlrededor: sacarCajasAledañas(
      caja.id,
      cajasNuevas,
      numeroCajas,
    ).filter((vecina) => vecina.mina).length,
  }));
}

function PantallaPrincipal() {
  // El tablero inicial se genera al montar la pantalla.
  const [numeroCajas, setNumeroCajas] = useState(8);
  const [cajas, setCajas] = useState<CajaType[]>(() => crearCajas(8));

  // El límite de banderas coincide con el número de minas.
  const totalCajas = numeroCajas * numeroCajas;
  const numeroMinas = Math.round(totalCajas * 0.15);
  const banderasDisponibles = numeroMinas;
  const banderasUsadas = cajas.filter((caja) => caja.bandera).length;

  // Se pierde al abrir una mina y se gana al marcar todas, siempre que no haya derrota.
  const derrota = cajas.some((caja) => caja.mina && caja.descubierta);
  const victoria =
    !derrota &&
    cajas.filter((caja) => caja.mina && caja.bandera).length === numeroMinas;
  const partidaTerminada = victoria || derrota;

  // Conserva el tamaño y borra el progreso al generar otras casillas.
  function reiniciarPartida() {
    setCajas(crearCajas(numeroCajas));
  }

  // Cambiar el tamaño también inicia una partida desde cero.
  function cambiarNumeroCajas(nuevoNumero: number) {
    if (partidaTerminada) return;

    setNumeroCajas(nuevoNumero);
    setCajas(crearCajas(nuevoNumero));
  }

  function descubrirCaja(cajaID: number) {
    // Tras ganar o perder, el tablero deja de aceptar jugadas.
    if (partidaTerminada) return;

    setCajas((cajasActuales) => {
      const cajaPulsada = cajasActuales.find((caja) => caja.id === cajaID);

      // Una bandera protege la casilla de clics accidentales.
      if (!cajaPulsada || cajaPulsada.bandera || cajaPulsada.descubierta) {
        return cajasActuales;
      }

      // Recorremos las casillas pendientes sin repetir las ya revisadas.
      const porRevisar: CajaType[] = [cajaPulsada];
      const idsDescubiertos = new Set<number>();

      while (porRevisar.length > 0) {
        const caja = porRevisar.pop()!;

        if (caja.bandera || caja.descubierta || idsDescubiertos.has(caja.id)) {
          continue;
        }

        idsDescubiertos.add(caja.id);

        // Una casilla sin minas alrededor destapa también sus vecinas seguras.
        if (!caja.mina && caja.minasAlrededor === 0) {
          const vecinas = sacarCajasAledañas(
            caja.id,
            cajasActuales,
            numeroCajas,
          );

          for (const vecina of vecinas) {
            if (
              !vecina.mina &&
              !vecina.bandera &&
              !idsDescubiertos.has(vecina.id)
            ) {
              porRevisar.push(vecina);
            }
          }
        }
      }

      // Aplicamos todos los descubrimientos en una sola actualización del tablero.
      return cajasActuales.map((caja) =>
        idsDescubiertos.has(caja.id)
          ? {
              ...caja,
              descubierta: true,
              mostrarNumero: !caja.mina && caja.minasAlrededor > 0,
            }
          : caja,
      );
    });
  }

  // Solo se marcan casillas tapadas; quitar una bandera siempre libera su hueco.
  function ponerBandera(id: number) {
    if (partidaTerminada) return;

    setCajas((cajasActuales) =>
      cajasActuales.map((caja) =>
        caja.id === id &&
        !caja.descubierta &&
        (caja.bandera === false ? banderasUsadas < banderasDisponibles : caja)
          ? { ...caja, bandera: !caja.bandera }
          : caja,
      ),
    );
  }

  return (
    <div className="pantalla-principal">
      <h1>¡Busca Minas!</h1>

      {/* El tamaño se puede cambiar mientras la partida está en curso. */}
      <section className="configuracion-partida">
        <h3>Configuración de la partida</h3>

        <label>
          Cajas por lado:
          <select
            className="selector-cajas"
            value={numeroCajas}
            disabled={partidaTerminada}
            onChange={(evento) =>
              cambiarNumeroCajas(Number(evento.target.value))
            }
          >
            <option value={8}>8 * 8</option>
            <option value={9}>9 * 9</option>
            <option value={10}>10 * 10</option>
          </select>
        </label>

        <p>Minas: {numeroMinas}</p>
      </section>

      {/* Cada casilla comunica sus clics a la lógica de esta pantalla. */}
      <section className="mine-box" data-columnas={numeroCajas}>
        {cajas.map((caja) => (
          <Caja
            key={caja.id}
            caja={caja}
            onDescubrir={descubrirCaja}
            onPonerBandera={ponerBandera}
          />
        ))}
      </section>

      {/* El resultado se calcula desde el tablero y se restablece al reiniciar. */}
      <VictoriaODerrota
        Victoria={victoria}
        Derrota={derrota}
        onReiniciar={reiniciarPartida}
      />
    </div>
  );
}

export default PantallaPrincipal;
