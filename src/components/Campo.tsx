// Campos dos formulários (dentro das janelas brancas).
//   <CampoTexto titulo="Nome completo *" icone={User} valor={nome} aoMudar={setNome} />
//   <CampoEscolha titulo="Estado do perfil" icone={CircleCheck} valor={estado} aoMudar={setEstado} opcoes={["Ativo","Inativo"]} />
//   <CampoTextoLongo titulo="Descrição" valor={descricao} aoMudar={setDescricao} />
import type { ReactNode } from "react";
import { ChevronDown, Eye, type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Título por cima do campo + mensagem de erro por baixo
export function Rotulo({ titulo, erro, children }: { titulo: string; erro?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col">
      {titulo && <span className="mb-2 text-[13px] font-semibold text-fundo">{titulo}</span>}
      {children}
      {erro && <span className="mt-1 text-xs font-medium text-perigo">{erro}</span>}
    </div>
  );
}

// Caixa com borda à volta do campo (com ícone à esquerda)
function Caixa({ icone: Icone, bloqueado, erro, children }: { icone?: LucideIcon; bloqueado?: boolean; erro?: string; children: ReactNode }) {
  const fundo = bloqueado ? "bg-campo-bloqueado" : "bg-white";
  const borda = erro ? "border-perigo" : "border-borda-campo focus-within:border-[1.5px] focus-within:border-azul";
  return (
    <div className={`flex h-12 items-center gap-2.5 rounded-xl border px-[15px] ${fundo} ${borda}`}>
      {Icone && <Icone className="size-[18px] shrink-0 text-fundo" strokeWidth={1.6} />}
      {children}
    </div>
  );
}

type CampoTextoProps = {
  titulo: string;
  valor: string;
  aoMudar?: (valor: string) => void;
  icone?: LucideIcon;
  textoExemplo?: string;
  tipo?: string; // "text", "email", "password", "tel"...
  bloqueado?: boolean; // campo só de leitura (fundo cinzento claro)
  erro?: string;
  depois?: ReactNode; // algo à direita dentro do campo (ex.: "Kz")
};

export function CampoTexto(props: CampoTextoProps) {
  return (
    <Rotulo titulo={props.titulo} erro={props.erro}>
      <Caixa icone={props.icone} bloqueado={props.bloqueado} erro={props.erro}>
        <Input
          type={props.tipo ?? "text"}
          value={props.valor}
          onChange={(e) => props.aoMudar?.(e.target.value)}
          placeholder={props.textoExemplo}
          readOnly={props.bloqueado}
        />
        {props.depois}
      </Caixa>
    </Rotulo>
  );
}

// Campo de palavra-passe com o "olho" para mostrar/esconder
export function CampoPalavraPasse(props: CampoTextoProps & { visivel: boolean; aoMudarVisivel: () => void }) {
  return (
    <CampoTexto
      {...props}
      tipo={props.visivel ? "text" : "password"}
      depois={
        <button type="button" onClick={props.aoMudarVisivel} className="cursor-pointer text-fundo" aria-label="Mostrar palavra-passe">
          <Eye className="size-[18px]" strokeWidth={1.6} />
        </button>
      }
    />
  );
}

type CampoEscolhaProps = {
  titulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  opcoes: string[];
  icone?: LucideIcon;
};

// Lista para escolher uma opção (select)
export function CampoEscolha(props: CampoEscolhaProps) {
  return (
    <Rotulo titulo={props.titulo}>
      <Caixa icone={props.icone}>
        <select
          value={props.valor}
          onChange={(e) => props.aoMudar(e.target.value)}
          className="h-full w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-fundo outline-none"
        >
          {props.opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none size-[18px] shrink-0 text-fundo" strokeWidth={1.6} />
      </Caixa>
    </Rotulo>
  );
}

type CampoTextoLongoProps = {
  titulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  altura?: number;
  erro?: string;
};

// Caixa de texto com várias linhas
export function CampoTextoLongo(props: CampoTextoLongoProps) {
  return (
    <Rotulo titulo={props.titulo} erro={props.erro}>
      <Textarea value={props.valor} onChange={(e) => props.aoMudar(e.target.value)} style={{ height: props.altura ?? 76 }} />
    </Rotulo>
  );
}
