import "./caja.css";

export type CajaType = {
  id: number;
  posicion: string;
  mina: boolean;
  bandera: boolean;
  descubierta: boolean;
  minasAlrededor: number;
  mostrarNumero: boolean;
};

type CajaProps = {
  caja: CajaType;
  onDescubrir: (cajaID: number) => void;
  onPonerBandera: (cajaID: number) => void;
};

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
      {caja.bandera && (
        <span className="mine-box__bandera" role="img" aria-label="Bandera">
          🚩
        </span>
      )}

      {caja.descubierta && caja.mina && "💣"}

      {caja.descubierta &&
        caja.mostrarNumero &&
        caja.minasAlrededor > 0 &&
        caja.minasAlrededor}
    </article>
  );
}

export default Caja;
