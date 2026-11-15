import { useEffect, useState } from "react";
import Caja, { type CajaType } from "../components/caja";
import "./pantallaPrincipal.css";

function PantallaPrincipal() {
  const [numeroCajas, setNumeroCajas] = useState(8);
  const [cajas, setCajas] = useState<CajaType[]>([]);

  function sacarCajasAledañas(
    cajaID: number,
    cajas: CajaType[]
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

  const descubrirCajasAledañas = (cajasAledañas: CajaType[]) => {
    const cajasAledañasSinMinasAlrededor = cajasAledañas.filter((caja) => {
      return (
        !caja.mina &&
        sacarCajasAledañas(caja.id, cajas).every(
          (cajaAledaña) => !cajaAledaña.mina
        )
      );
    });

    setCajas((cajasActuales) =>
      cajasActuales.map((caja) =>
        cajasAledañasSinMinasAlrededor.some(
          (adyacente) => adyacente.id === caja.id
        )
          ? { ...caja, descubierta: true }
          : caja
      )
    );
  };

  function actualizarCaja(cajaActualizada: CajaType) {
    setCajas((cajasActuales) =>
      cajasActuales.map((caja) =>
        caja.posicion === cajaActualizada.posicion ? cajaActualizada : caja,
      ),
    );
  }

  const totalCajas = numeroCajas * numeroCajas;
  const numeroMinas = Math.round(totalCajas * 0.15);

  useEffect(() => {
    // Creamos una lista con las posiciones posibles: 0, 1, 2...
    const posiciones = Array.from({ length: totalCajas }, (_, i) => i);

    // Mezclamos las posiciones al azar
    for (let i = posiciones.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [posiciones[i], posiciones[j]] = [posiciones[j], posiciones[i]];
    }

    // Las primeras posiciones mezcladas serán las minas
    const posicionesConMina = new Set(posiciones.slice(0, numeroMinas));

    // Creamos todas las cajas y actualizamos el estado una sola vez
    const cajasNuevas: CajaType[] = Array.from(
      { length: totalCajas },
      (_, i) => ({
        id: i,
        posicion: `${i}`,
        mina: posicionesConMina.has(i),
        bandera: false,
        descubierta: false,
      }),
    );

    setCajas(cajasNuevas);
  }, [totalCajas, numeroMinas]);

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
          <Caja key={caja.posicion} caja={caja} cajasAledañas={sacarCajasAledañas(caja.id, cajas)} onDescubrirCajasAledañas={descubrirCajasAledañas} onCambiar={actualizarCaja} />
        ))}
      </section>
    </div>
  );
}

export default PantallaPrincipal;
