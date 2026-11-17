import { useEffect, useState } from "react";
import Caja, { type CajaType } from "../components/caja";
import "./pantallaPrincipal.css";

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

function PantallaPrincipal() {
  const [numeroCajas, setNumeroCajas] = useState(8);
  const [cajas, setCajas] = useState<CajaType[]>([]);
  const totalCajas = numeroCajas * numeroCajas;
  const numeroMinas = Math.round(totalCajas * 0.15);
  const [banderas, setBanderas] = useState(numeroMinas);

  useEffect(() => {
    const posiciones = Array.from({ length: totalCajas }, (_, i) => i);

    // Mezclamos las posiciones.
    for (let i = posiciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [posiciones[i], posiciones[j]] = [posiciones[j], posiciones[i]];
    }

    const posicionesConMina = new Set(posiciones.slice(0, numeroMinas));

    // Primero creamos todas las casillas.
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

    // Después contamos las minas de sus vecinas.
    const cajasConNumeros = cajasNuevas.map((caja) => ({
      ...caja,
      minasAlrededor: sacarCajasAledañas(
        caja.id,
        cajasNuevas,
        numeroCajas,
      ).filter((vecina) => vecina.mina).length,
    }));

    setCajas(cajasConNumeros);
  }, [numeroCajas, totalCajas, numeroMinas]);

  function descubrirCaja(cajaID: number) {
    setCajas((cajasActuales) => {
      const cajaPulsada = cajasActuales.find((caja) => caja.id === cajaID);

      if (!cajaPulsada || cajaPulsada.bandera || cajaPulsada.descubierta) {
        return cajasActuales;
      }

      const porRevisar: CajaType[] = [cajaPulsada];
      const idsDescubiertos = new Set<number>();

      while (porRevisar.length > 0) {
        const caja = porRevisar.pop()!;

        if (caja.bandera || caja.descubierta || idsDescubiertos.has(caja.id)) {
          continue;
        }

        idsDescubiertos.add(caja.id);

        // Solo las casillas vacías expanden el descubrimiento.
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

  function ponerBandera(id: number) {
    setCajas((cajasActuales) =>
      cajasActuales.map((caja) =>
        caja.id === id ? { ...caja, bandera: !caja.bandera } : caja,
      ),
    );
  }

  return (
    <div className="pantalla-principal">
      <h1>¡Busca Minas!</h1>

      <section className="configuracion-partida">
        <h3>Configuración de la partida</h3>

        <label>
          Cajas por lado:
          <select
            className="selector-cajas"
            value={numeroCajas}
            onChange={(evento) => setNumeroCajas(Number(evento.target.value))}
          >
            <option value={8}>8 * 8</option>
            <option value={9}>9 * 9</option>
            <option value={10}>10 * 10</option>
          </select>
        </label>

        <p>Minas: {numeroMinas}</p>
      </section>

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
    </div>
  );
}

export default PantallaPrincipal;
