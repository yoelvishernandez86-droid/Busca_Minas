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
  cajasAledañas: CajaType[];
  onCambiar: (caja: CajaType) => void;
  onDescubrirCajasAledañas: (cajas: CajaType[]) => void;
};

function Caja({ caja, cajasAledañas, onCambiar, onDescubrirCajasAledañas }: CajaProps) {
  function descubrirCaja() {
    onCambiar({ ...caja, descubierta: true });
  }

  return (
    <article
      onClick={()=>{descubrirCaja(),onDescubrirCajasAledañas(cajasAledañas)}}
      className={`mine-box__caja${caja.descubierta ? " mine-box__caja--descubierta" : ""}`}
    >
      {caja.descubierta && caja.mina ? "💣" : ""}
    </article>
  );
}

export default Caja;
