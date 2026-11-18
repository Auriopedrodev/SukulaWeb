// Os botões de ação das tabelas: ver (olho), editar (lápis) e remover (lixo)
// Se não passar "aoVer", o olho não aparece.
import { Eye, Pencil, Trash2 } from "lucide-react";

type Props = {
  aoVer?: () => void;
  aoEditar: () => void;
  aoRemover: () => void;
  corIcones?: string; // cor do olho e do lápis (classe Tailwind)
};

export default function BotoesAcoes({ aoVer, aoEditar, aoRemover, corIcones = "text-fundo" }: Props) {
  const estilo = "flex size-[34px] cursor-pointer items-center justify-center rounded-[10px] hover:bg-borda/60";
  return (
    <div className="flex items-center justify-end gap-2">
      {aoVer && (
        <button className={`${estilo} ${corIcones}`} onClick={aoVer} aria-label="Ver detalhes">
          <Eye className="size-4" strokeWidth={1.6} />
        </button>
      )}
      <button className={`${estilo} ${corIcones}`} onClick={aoEditar} aria-label="Editar">
        <Pencil className="size-4" strokeWidth={1.6} />
      </button>
      <button className={`${estilo} text-perigo`} onClick={aoRemover} aria-label="Remover">
        <Trash2 className="size-4" strokeWidth={1.6} />
      </button>
    </div>
  );
}
