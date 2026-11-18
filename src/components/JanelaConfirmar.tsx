// Janela de confirmação: "Remover cliente?", "Remover lavandaria?", "Terminar sessão?"...
// Uso:
//   <JanelaConfirmar aberta={...} aoFechar={...} aoConfirmar={...}
//     titulo="Remover cliente?" texto="..." textoBotao="Sim, remover cliente">
//     (opcional) caixa azul com o item a remover
//   </JanelaConfirmar>
import type { ReactNode } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type Props = {
  aberta: boolean;
  aoFechar: () => void;
  aoConfirmar: () => void;
  titulo: string;
  texto: string;
  textoBotao: string;
  tipo?: "remover" | "sair";
  aCarregar?: boolean;
  children?: ReactNode;
};

export default function JanelaConfirmar(props: Props) {
  const sair = props.tipo === "sair";
  return (
    <Dialog open={props.aberta} onOpenChange={(abrir) => !abrir && props.aoFechar()}>
      <DialogContent style={{ maxWidth: 460 }}>
        {/* Ícone */}
        <div className="mx-auto flex size-14 items-center justify-center">
          {sair ? (
            <LogOut className="size-[26px] text-cartao-titulo" strokeWidth={1.7} />
          ) : (
            <Trash2 className="size-[26px] text-perigo" strokeWidth={1.7} />
          )}
        </div>

        <DialogTitle className="mt-5 text-center text-xl font-bold text-cartao-titulo">{props.titulo}</DialogTitle>
        <DialogDescription className="mt-2 text-center text-sm leading-[21px] text-cartao-texto">{props.texto}</DialogDescription>

        {props.children && <div className="mt-5">{props.children}</div>}

        <div className="mt-5 flex flex-col gap-2.5">
          <Button
            size="grande"
            variant="perigo"
            className={sair ? "bg-perigo-claro" : ""}
            onClick={props.aoConfirmar}
            disabled={props.aCarregar}
          >
            {props.aCarregar ? "A processar..." : props.textoBotao}
          </Button>
          <Button size="grande" variant="painel" onClick={props.aoFechar}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Caixa azul que mostra o item que vai ser removido (nome + texto pequeno)
export function ItemARemover({ imagem, titulo, texto }: { imagem: ReactNode; titulo: string; texto: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-fundo p-3.5">
      {imagem}
      <div>
        <p className="text-sm font-semibold text-claro">{titulo}</p>
        <p className="mt-[3px] text-xs text-claro-2">{texto}</p>
      </div>
    </div>
  );
}
