import { useState } from "react";
import Caja from "../components/caja";

function PantallaPrincipal() {
  const [numeroCajas, setNumeroCajas] = useState(8);
  const [cajas, setCajas] = useState([]);
  return (
    <div>
      <h1>¡Busca Minas!</h1>
      <section>
        <h3>Configuracion de la partida</h3>
        <ul>
          <li>Dificultad: Facil</li>
          <li>Numero de minas restantes: 24</li>
          <li>Numero de banderas restantes: 24</li>
          <li>Mejor tiempo hasta ahora en esta dificultad: 10:00</li>
        </ul>
      </section>
    </div>
  );
}

export default PantallaPrincipal;
