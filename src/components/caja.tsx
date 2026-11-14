import "./caja.css";

export type CajaType = {
  id: number;
  posicion: string;
  mina: boolean;
  bandera: boolean;
  descubierta: boolean;
};

type CajaProps = {
  caja: CajaType;
  onCambiar: (caja: CajaType) => void;
};

function Caja({ caja, onCambiar }: CajaProps) {
  function descubrirCaja() {
    onCambiar({ ...caja, descubierta: true });
  }

  return (
    <article
      onClick={descubrirCaja}
      className={`mine-box__caja${caja.descubierta ? " mine-box__caja--descubierta" : ""}`}
    >
      {caja.descubierta && caja.mina ? "💣" : ""}
    </article>
  );
}

export default Caja;
