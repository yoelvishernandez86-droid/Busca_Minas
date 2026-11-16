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
};

function Caja({ caja, onDescubrir }: CajaProps) {
  return (
    <article
      onClick={() => onDescubrir(caja.id)}
      className={`mine-box__caja${
        caja.descubierta ? " mine-box__caja--descubierta" : ""
      }`}
    >
      {caja.bandera && !caja.descubierta && "🚩"}

      {caja.descubierta && caja.mina && "💣"}

      {caja.descubierta &&
        caja.mostrarNumero &&
        caja.minasAlrededor > 0 &&
        caja.minasAlrededor}
    </article>
  );
}

export default Caja;