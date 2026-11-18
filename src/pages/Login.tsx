// Telas O, O1, O2 e U4.1 - Login do Administrador
// - O   : formulário vazio
// - O1  : dados preenchidos
// - O2  : erro "Palavra-passe incorreta"
// - U4.1: aviso "Sessão terminada" (quando vem do botão "Terminar sessão")
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Phone, TriangleAlert } from "lucide-react";
import fotoLogin from "@/assets/imagens/foto-login.jpg";
import simboloSukula from "@/assets/imagens/logo-sukula-simbolo.png";
import { entrar } from "@/api/conta";
import { mensagemDeErro } from "@/api/configuracao";
import Aviso, { type DadosAviso } from "@/components/Aviso";

export default function Login() {
  const navegar = useNavigate();
  const local = useLocation();

  // Valores do formulário
  const [utilizador, setUtilizador] = useState("");
  const [palavraPasse, setPalavraPasse] = useState("");
  const [verPalavraPasse, setVerPalavraPasse] = useState(false);

  // Erros e estado do botão
  const [erroUtilizador, setErroUtilizador] = useState("");
  const [erroPalavraPasse, setErroPalavraPasse] = useState("");
  const [aEntrar, setAEntrar] = useState(false);

  // U4.1 - mostra "Sessão terminada" se viemos do botão "Terminar sessão"
  const [aviso, setAviso] = useState<DadosAviso | null>(
    local.state?.sessaoTerminada ? { titulo: "Sessão terminada", texto: "Inicie sessão novamente para aceder ao painel." } : null
  );

  // Validação simples com useState
  function validar() {
    let valido = true;
    setErroUtilizador("");
    setErroPalavraPasse("");
    if (utilizador.trim() === "") {
      setErroUtilizador("Indique o seu e-mail ou número de telefone.");
      valido = false;
    }
    if (palavraPasse === "") {
      setErroPalavraPasse("Indique a sua palavra-passe.");
      valido = false;
    }
    return valido;
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    if (!validar()) return;
    setAEntrar(true);
    try {
      await entrar(utilizador, palavraPasse);
      navegar("/");
    } catch (erro) {
      setErroPalavraPasse(mensagemDeErro(erro)); // tela O2
    } finally {
      setAEntrar(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 md:justify-start md:pl-[6vw]">
      {/* ---------- Fotografia a cobrir o ecrã todo ---------- */}
      <img src={fotoLogin} alt="" className="absolute inset-0 h-full w-full object-cover object-[75%_center]" />

      {/* ---------- Cartão branco com o formulário (à esquerda, para não tapar o rosto do modelo) ---------- */}
      <div className="sombra-janela animar-entrada-lado relative w-full max-w-[440px] rounded-[20px] bg-white px-10 pb-8 pt-9">
        <form onSubmit={aoSubmeter} noValidate>
          <img src={simboloSukula} alt="Sukula" className="h-[72px] w-[128px] object-fill" />

          <h2 className="mt-2.5 text-4xl font-black text-black">Iniciar sessão</h2>
          <p className="mt-1.5 text-[15px] text-login-texto">Preencha suas informações abaixo.</p>

          {/* E-mail / telefone */}
          <label className="mt-7 block text-[13px] font-medium text-login-texto">E-mail/ Número de telefone</label>
          <div
            className={`mt-2 flex h-12 items-center gap-2.5 rounded-[10px] border bg-white px-3.5 ${
              erroUtilizador ? "border-[1.5px] border-erro" : "border-login-borda"
            }`}
          >
            <Phone className="size-5 text-fundo" strokeWidth={1.6} />
            <input
              value={utilizador}
              onChange={(e) => setUtilizador(e.target.value)}
              placeholder="Ex: +244 9XX XXX XXX"
              className="w-full bg-transparent text-sm font-medium text-login-texto outline-none placeholder:font-normal placeholder:text-[#9aa3ad]"
            />
          </div>
          {erroUtilizador && <MensagemErro texto={erroUtilizador} />}

          {/* Palavra-passe */}
          <label className="mt-4 block text-[13px] font-medium text-login-texto">Palavra-passe</label>
          <div
            className={`mt-2 flex h-12 items-center gap-2.5 rounded-[10px] border bg-white px-3.5 ${
              erroPalavraPasse ? "border-[1.5px] border-erro" : "border-login-borda"
            }`}
          >
            <Lock className="size-5 text-fundo" strokeWidth={1.6} />
            <input
              type={verPalavraPasse ? "text" : "password"}
              value={palavraPasse}
              onChange={(e) => setPalavraPasse(e.target.value)}
              placeholder="Insira a sua palavra-passe"
              className="w-full bg-transparent text-sm font-medium text-login-texto outline-none placeholder:font-normal placeholder:text-[#9aa3ad]"
            />
            <button type="button" onClick={() => setVerPalavraPasse(!verPalavraPasse)} className="cursor-pointer text-azul" aria-label="Mostrar palavra-passe">
              {verPalavraPasse ? <EyeOff className="size-5" strokeWidth={1.8} /> : <Eye className="size-5" strokeWidth={1.8} />}
            </button>
          </div>
          {erroPalavraPasse && <MensagemErro texto={erroPalavraPasse} />}

          <button
            type="submit"
            disabled={aEntrar}
            className="mt-6 h-[50px] w-full cursor-pointer rounded-[10px] bg-login-texto text-sm font-semibold text-white disabled:opacity-70"
          >
            {aEntrar ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#9aa3ad]">© 2026 Sukula · Termos · Privacidade</p>
      </div>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} noTopo />
    </div>
  );
}

// Mensagem vermelha por baixo do campo (tela O2)
function MensagemErro({ texto }: { texto: string }) {
  return (
    <p className="mt-2 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-erro">
      <TriangleAlert className="size-3.5 shrink-0" strokeWidth={1.8} />
      {texto}
    </p>
  );
}
