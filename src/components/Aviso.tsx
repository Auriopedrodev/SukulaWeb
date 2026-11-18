// Aviso que aparece no canto do ecrã depois de uma ação
// (ex.: "Informação alterada com sucesso"). Desaparece sozinho ao fim de 4 segundos.
// Uso:
//   const [aviso, setAviso] = useState<DadosAviso | null>(null);
//   setAviso({ titulo: "Cliente removido", texto: "..." });
//   <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
import { useEffect } from "react";
import { CircleCheck, X } from "lucide-react";

export type DadosAviso = {
  titulo: string;
  texto: string;
};

type Props = {
  aviso: DadosAviso | null;
  aoFechar: () => void;
  noTopo?: boolean; // true = canto de cima (usado no Login)
};

export default function Aviso({ aviso, aoFechar, noTopo = false }: Props) {
  // Fecha sozinho depois de 4 segundos
  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(aoFechar, 4000);
    return () => clearTimeout(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aviso]);

  if (!aviso) return null;

  const posicao = noTopo ? "top-8 w-[380px]" : "bottom-8 w-[400px]";
  return (
    <div
      className={`sombra-janela animar-aviso fixed right-8 z-[60] flex items-center gap-3.5 rounded-[14px] border border-painel-borda bg-white py-[17px] pl-[17px] pr-6 ${posicao}`}
    >
      <div className="flex size-10 shrink-0 items-center justify-center">
        <CircleCheck className="size-5 text-cartao-titulo" strokeWidth={1.7} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-cartao-titulo">{aviso.titulo}</p>
        <p className="mt-[3px] text-xs text-cartao-texto">{aviso.texto}</p>
      </div>
      <button onClick={aoFechar} className="cursor-pointer text-cartao-texto" aria-label="Fechar aviso">
        <X className="size-4" strokeWidth={1.7} />
      </button>
    </div>
  );
}
