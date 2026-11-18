// Caixa "Importar nova imagem" dos formulários (foto de perfil).
// O ficheiro escolhido é devolvido em aoEscolher(ficheiro) para depois ser enviado à API.
import { useRef, type ReactNode, type RefObject } from "react";
import { Upload } from "lucide-react";

type Props = {
  previsualizacao: ReactNode; // avatar com iniciais ou foto
  textoBotao: string; // "Alterar imagem"
  aoEscolher: (ficheiro: File) => void;
  nomeFicheiro?: string;
};

export default function CarregarImagem({ previsualizacao, textoBotao, aoEscolher, nomeFicheiro }: Props) {
  const escolhedor = useRef<HTMLInputElement>(null);
  return (
    <div className="flex h-[82px] items-center gap-4 rounded-xl border border-borda-upload bg-campo-bloqueado pl-[17px] pr-[17px]">
      {previsualizacao}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-fundo">{nomeFicheiro || "Importar nova imagem"}</p>
        <p className="mt-1 text-[11px] text-cinza">JPG ou PNG · até 5 MB · formato quadrado</p>
      </div>
      <BotaoEscolherFicheiro texto={textoBotao} aoClicar={() => escolhedor.current?.click()} />
      <EscolhedorEscondido referencia={escolhedor} aoEscolher={aoEscolher} />
    </div>
  );
}

// Botão branco com o ícone de enviar
export function BotaoEscolherFicheiro({ texto, aoClicar }: { texto: string; aoClicar: () => void }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-borda bg-white px-[19px] text-sm font-semibold text-fundo"
    >
      <Upload className="size-5" strokeWidth={1.6} />
      {texto}
    </button>
  );
}

// <input type="file"> escondido (o botão de cima abre-o)
export function EscolhedorEscondido({
  referencia,
  aoEscolher,
}: {
  referencia: RefObject<HTMLInputElement | null>;
  aoEscolher: (ficheiro: File) => void;
}) {
  return (
    <input
      ref={referencia}
      type="file"
      accept="image/png,image/jpeg"
      className="hidden"
      onChange={(e) => {
        const ficheiro = e.target.files?.[0];
        if (ficheiro) aoEscolher(ficheiro);
      }}
    />
  );
}
