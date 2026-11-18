// Janela (modal) com título e botão de fechar "X".
// Usada para: Detalhes, Adicionar e Editar.
// Uso:
//   <Janela aberta={aberta} aoFechar={fechar} titulo="Editar cliente" largura={780}>
//     ...campos...
//   </Janela>
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Props = {
  aberta: boolean;
  aoFechar: () => void;
  titulo: string;
  largura: number; // largura em píxeis (igual ao Figma)
  tituloClaro?: boolean; // true = título azul #0080CB (janelas de "Detalhes")
  escura?: boolean; // true = janela azul escura com título branco
  children: ReactNode;
};

export default function Janela({ aberta, aoFechar, titulo, largura, tituloClaro = false, escura = false, children }: Props) {
  let corTitulo = tituloClaro ? "text-cartao-titulo" : "text-fundo";
  if (escura) corTitulo = "text-white";
  return (
    <Dialog open={aberta} onOpenChange={(abrir) => !abrir && aoFechar()}>
      <DialogContent style={{ maxWidth: largura }} className={escura ? "bg-fundo" : ""}>
        <div className="mb-5 flex items-center justify-between">
          <DialogTitle className={`text-xl font-bold ${corTitulo}`}>{titulo}</DialogTitle>
          <button onClick={aoFechar} className={`cursor-pointer ${corTitulo}`} aria-label="Fechar">
            <X className="size-[22px]" strokeWidth={1.8} />
          </button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}

// Linha de botões no fundo das janelas (alinhados à direita)
export function BotoesJanela({ children }: { children: ReactNode }) {
  return <div className="mt-5 flex justify-end gap-3">{children}</div>;
}
