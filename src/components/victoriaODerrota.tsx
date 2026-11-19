import { useEffect, useId, useRef } from "react";
import "./victoriaODerrota.css";

// La pantalla principal entrega el resultado y la acción para empezar otra partida.
type VictoriaODerrotaProps = {
  Victoria: boolean;
  Derrota: boolean;
  onReiniciar: () => void;
};

export default function VictoriaODerrota({
  Victoria,
  Derrota,
  onReiniciar,
}: VictoriaODerrotaProps) {
  const dialogoRef = useRef<HTMLDialogElement>(null);
  // Cada modal enlaza su título y descripción sin repetir identificadores.
  const id = useId();
  const mostrarResultado = Victoria || Derrota;

  useEffect(() => {
    const dialogo = dialogoRef.current;

    if (!mostrarResultado || !dialogo) {
      return;
    }

    // El diálogo bloquea el fondo y mantiene el foco; también detenemos el scroll.
    const desbordamientoAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogo.showModal();

    // Al reiniciar o desmontar el componente, cerramos el modal y recuperamos el scroll.
    return () => {
      dialogo.close();
      document.body.style.overflow = desbordamientoAnterior;
    };
  }, [mostrarResultado]);

  // Escape no cierra el resultado: la partida solo continúa al reiniciar.
  return (
    <dialog
      ref={dialogoRef}
      className={`resultado-partida${Derrota ? " resultado-partida--derrota" : ""}`}
      aria-labelledby={`${id}-titulo`}
      aria-describedby={`${id}-descripcion`}
      onCancel={(evento) => evento.preventDefault()}
    >
      <span className="resultado-partida__icono" aria-hidden="true">
        {Derrota ? "💣" : "🏆"}
      </span>
      <h2 id={`${id}-titulo`}>{Derrota ? "¡Has perdido!" : "¡Victoria!"}</h2>
      <p id={`${id}-descripcion`}>
        {Derrota
          ? "Has descubierto una mina. Reinicia la partida para volver a intentarlo."
          : "¡Has ganado la partida! Reinicia para volver a jugar."}
      </p>
      {/* El foco empieza en la única acción disponible. */}
      <button type="button" onClick={onReiniciar} autoFocus>
        Reiniciar partida
      </button>
    </dialog>
  );
}
