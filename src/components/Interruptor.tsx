// Interruptor ligado/desligado (ex.: lavandaria "Ativa" / "Inativa")
type Props = {
  ligado: boolean;
  aoMudar?: (ligado: boolean) => void;
};

export default function Interruptor({ ligado, aoMudar }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      onClick={() => aoMudar?.(!ligado)}
      className={`relative h-5 w-9 shrink-0 cursor-pointer rounded-[10px] ${ligado ? "bg-interruptor" : "bg-interruptor-off"}`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-all ${
          ligado ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
