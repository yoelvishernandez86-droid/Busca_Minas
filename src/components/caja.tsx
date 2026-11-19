import "./caja.css";

// Datos que necesita cada casilla para representar su estado en el tablero.
export type CajaType = {
  id: number;
  posicion: string;
  mina: boolean;
  bandera: boolean;
  descubierta: boolean;
  minasAlrededor: number;
  mostrarNumero: boolean;
};

// La casilla avisa de las acciones; la pantalla principal aplica las reglas del juego.
type CajaProps = {
  caja: CajaType;
  onDescubrir: (cajaID: number) => void;
  onPonerBandera: (cajaID: number) => void;
};

// El clic descubre la casilla y el botón derecho alterna la bandera sin abrir el menú.
function Caja({ caja, onDescubrir, onPonerBandera }: CajaProps) {
  return (
    <article
      onClick={() => onDescubrir(caja.id)}
      onContextMenu={(event) => {
        if (event.button === 2) {
          event.preventDefault();
          onPonerBandera(caja.id);
        }
      }}
      className={`mine-box__caja${
        caja.descubierta ? " mine-box__caja--descubierta" : ""
      }${caja.bandera ? " mine-box__caja--bandera" : ""}`}
    >
      {/* La etiqueta permite identificar la bandera también con un lector de pantalla. */}
      {caja.bandera && (
        <span className="mine-box__bandera" role="img" aria-label="Bandera">
          🚩
        </span>
      )}

      {/* Las minas y las pistas se muestran cuando la casilla está descubierta. */}
      {caja.descubierta && caja.mina && "💣"}

      {caja.descubierta &&
        caja.mostrarNumero &&
        caja.minasAlrededor > 0 &&
        caja.minasAlrededor}
    </article>
  );
}

export default Caja;
