// Telas P a P5 - Gestão de clientes
// - P  : lista de clientes
// - P1 : janela "Detalhes do cliente"
// - P2 : janela "Editar cliente"
// - P3 : aviso "Informação alterada com sucesso"
// - P4 : janela "Remover cliente?"
// - P5 : aviso "Cliente removido"
import { useEffect, useState } from "react";
import { Calendar, Check, CircleCheck, Clock, MapPin, Pencil, Shield, Trash2, Upload, User } from "lucide-react";
import { CLIENTES_POR_PAGINA, editarCliente, listarClientes, removerCliente } from "@/api/clientes";
import { mensagemDeErro } from "@/api/configuracao";
import type { Cliente } from "@/api/tipos";
import Avatar from "@/components/Avatar";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import BotoesAcoes from "@/components/BotoesAcoes";
import { CampoEscolha, CampoTexto, Rotulo } from "@/components/Campo";
import CarregarImagem from "@/components/CarregarImagem";
import { Estado } from "@/components/Etiquetas";
import Filtros from "@/components/Filtros";
import InfoLinha from "@/components/InfoLinha";
import Janela, { BotoesJanela } from "@/components/Janela";
import JanelaConfirmar, { ItemARemover } from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import Paginacao from "@/components/Paginacao";
import Pesquisa from "@/components/Pesquisa";
import TituloPagina, { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Clientes() {
  // Lista e filtros
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);

  // Cliente escolhido e janela aberta ("" = nenhuma)
  const [escolhido, setEscolhido] = useState<Cliente | null>(null);
  const [janela, setJanela] = useState<"" | "detalhes" | "editar" | "remover">("");
  const [aRemover, setARemover] = useState(false);
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  // Volta a pedir a lista à API sempre que a página, a pesquisa ou o filtro mudam
  useEffect(() => {
    setACarregar(true);
    listarClientes(pagina, pesquisa, filtro.toLowerCase())
      .then((resposta) => {
        setClientes(resposta.itens);
        setTotal(resposta.total);
        setErro("");
      })
      .catch((e) => setErro(mensagemDeErro(e)))
      .finally(() => setACarregar(false));
  }, [pagina, pesquisa, filtro]);

  function abrir(cliente: Cliente, qual: "detalhes" | "editar" | "remover") {
    setEscolhido(cliente);
    setJanela(qual);
  }

  async function confirmarRemocao() {
    if (!escolhido) return;
    setARemover(true);
    try {
      await removerCliente(escolhido.id);
      setClientes(clientes.filter((c) => c.id !== escolhido.id));
      setTotal(total - 1);
      setJanela("");
      setAviso({ titulo: "Cliente removido", texto: `${escolhido.nome} foi removido da lista de clientes.` }); // P5
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
    } finally {
      setARemover(false);
    }
  }

  return (
    <Layout titulo="Gestão de clientes">
      <TituloPagina titulo="Clientes" />

      <div className="mt-5 flex gap-3">
        <Pesquisa
          valor={pesquisa}
          aoMudar={(texto) => {
            setPesquisa(texto);
            setPagina(1);
          }}
          textoExemplo="Pesquisar por nome"
        />
        <Filtros
          opcoes={["Todos", "Ativos", "Inativos"]}
          ativo={filtro}
          aoMudar={(opcao) => {
            setFiltro(opcao);
            setPagina(1);
          }}
        />
      </div>

      {/* Tabela de clientes */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-borda bg-white">
        {aCarregar || erro ? (
          <Carregando erro={erro} />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Cliente</TableHead>
                  <TableHead className="w-[460px]">Morada</TableHead>
                  <TableHead className="w-[160px]">Estado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id} className="h-[60px]">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar nome={cliente.nome} tamanho={36} imagem={cliente.foto} />
                        <span className="font-semibold">{cliente.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{cliente.zona}</TableCell>
                    <TableCell>
                      <Estado ativo={cliente.ativo} />
                    </TableCell>
                    <TableCell>
                      <BotoesAcoes
                        aoVer={() => abrir(cliente, "detalhes")}
                        aoEditar={() => abrir(cliente, "editar")}
                        aoRemover={() => abrir(cliente, "remover")}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Paginacao
              pagina={pagina}
              porPagina={CLIENTES_POR_PAGINA}
              total={total}
              quantidadeNaPagina={clientes.length}
              nome="clientes"
              aoMudar={setPagina}
            />
          </>
        )}
      </div>

      {/* P1 - Detalhes do cliente */}
      {escolhido && (
        <JanelaDetalhes
          aberta={janela === "detalhes"}
          cliente={escolhido}
          aoFechar={() => setJanela("")}
          aoEditar={() => setJanela("editar")}
          aoRemover={() => setJanela("remover")}
        />
      )}

      {/* P2 - Editar cliente */}
      {escolhido && janela === "editar" && (
        <JanelaEditar
          cliente={escolhido}
          aoFechar={() => setJanela("")}
          aoGuardar={(atualizado) => {
            setClientes(clientes.map((c) => (c.id === atualizado.id ? atualizado : c)));
            setJanela("");
            setAviso({ titulo: "Informação alterada com sucesso", texto: `Os dados de ${atualizado.nome} foram atualizados.` }); // P3
          }}
        />
      )}

      {/* P4 - Remover cliente? */}
      <JanelaConfirmar
        aberta={janela === "remover"}
        aoFechar={() => setJanela("")}
        aoConfirmar={confirmarRemocao}
        aCarregar={aRemover}
        titulo="Remover cliente?"
        texto={`${escolhido?.nome} será removido da plataforma Sukula. O histórico de ${escolhido?.pedidos} pedidos será mantido para efeitos de faturação. Esta ação não pode ser anulada.`}
        textoBotao="Sim, remover cliente"
      >
        {escolhido && (
          <ItemARemover imagem={<Avatar nome={escolhido.nome} tamanho={40} tipo="escuro" imagem={escolhido.foto} />} titulo={escolhido.nome} texto={escolhido.zona} />
        )}
      </JanelaConfirmar>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}

// ---------------------------------------------------------
// P1 - Janela "Detalhes do cliente"
// ---------------------------------------------------------
type DetalhesProps = {
  aberta: boolean;
  cliente: Cliente;
  aoFechar: () => void;
  aoEditar: () => void;
  aoRemover: () => void;
};

function JanelaDetalhes({ aberta, cliente, aoFechar, aoEditar, aoRemover }: DetalhesProps) {
  return (
    <Janela aberta={aberta} aoFechar={aoFechar} titulo="Detalhes do cliente" largura={1000} escura>
      <div className="flex gap-5">
        {/* Cartão do cliente */}
        <div className="flex h-[380px] w-[320px] shrink-0 flex-col items-center rounded-2xl border border-painel-borda bg-painel px-3.5 pt-[29px]">
          <Avatar nome={cliente.nome} tamanho={88} tipo="escuro" imagem={cliente.foto} />
          <p className="mt-3.5 text-lg font-bold text-claro">{cliente.nome}</p>
          <div className="mt-3.5">
            <Estado ativo={cliente.ativo} vivo />
          </div>

          <div className="mt-3.5 w-full border-t border-painel-borda" />

          <div className="flex w-full flex-col gap-2.5 px-[11px] pt-3.5 text-xs font-medium text-claro">
            <p className="flex items-center gap-2.5">
              <Calendar className="size-4" strokeWidth={1.6} /> Cliente desde {cliente.clienteDesde}
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="size-4" strokeWidth={1.6} /> Último pedido: {cliente.ultimoPedido}
            </p>
          </div>
        </div>

        {/* Informações pessoais */}
        <div className="h-[380px] flex-1 rounded-2xl border border-painel-borda bg-painel p-[25px]">
          <p className="text-base font-bold text-claro">Informações pessoais</p>
          <div className="mt-[22px] grid grid-cols-2 gap-x-6 gap-y-[22px]">
            <InfoLinha escuro icone={User} titulo="Nome completo">{cliente.nome}</InfoLinha>
            <InfoLinha escuro icone={MapPin} titulo="Morada">{cliente.morada}</InfoLinha>
            <InfoLinha escuro icone={Shield} titulo="Perfil">Cliente</InfoLinha>
            <InfoLinha escuro icone={CircleCheck} titulo="Estado do perfil">{cliente.ativo ? "Ativo" : "Inativo"}</InfoLinha>
            <InfoLinha escuro icone={Upload} titulo="Foto de perfil">{cliente.nomeFoto}</InfoLinha>
          </div>
        </div>
      </div>

      <BotoesJanela>
        <Button variant="perigo" onClick={aoRemover}>
          <Trash2 /> Remover
        </Button>
        <Button variant="claro" onClick={aoEditar}>
          <Pencil /> Editar cliente
        </Button>
      </BotoesJanela>
    </Janela>
  );
}

// ---------------------------------------------------------
// P2 - Janela "Editar cliente"
// ---------------------------------------------------------
type EditarProps = {
  cliente: Cliente;
  aoFechar: () => void;
  aoGuardar: (cliente: Cliente) => void;
};

function JanelaEditar({ cliente, aoFechar, aoGuardar }: EditarProps) {
  // Valores do formulário (começam com os dados atuais do cliente)
  const [nome, setNome] = useState(cliente.nome);
  const [morada, setMorada] = useState(cliente.morada);
  const [estado, setEstado] = useState(cliente.ativo ? "Ativo" : "Inativo");
  const [nomeFoto, setNomeFoto] = useState("");
  const [foto, setFoto] = useState(cliente.foto);
  const [erroNome, setErroNome] = useState("");
  const [erroGeral, setErroGeral] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  async function guardar() {
    // Validação: o nome é obrigatório
    if (nome.trim() === "") {
      setErroNome("O nome completo é obrigatório.");
      return;
    }
    setErroNome("");
    setAGuardar(true);
    try {
      const atualizado = await editarCliente({
        ...cliente,
        nome: nome.trim(),
        morada,
        ativo: estado === "Ativo",
        foto,
        nomeFoto: nomeFoto || cliente.nomeFoto,
      });
      aoGuardar(atualizado);
    } catch (e) {
      setErroGeral(mensagemDeErro(e));
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo="Editar cliente" largura={780}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <CampoTexto titulo="Nome completo *" icone={User} valor={nome} aoMudar={setNome} erro={erroNome} />
        <CampoTexto titulo="Morada" icone={MapPin} valor={morada} aoMudar={setMorada} />
        <CampoTexto titulo="Perfil" icone={Shield} valor="Cliente" bloqueado />
        <CampoEscolha titulo="Estado do perfil" icone={CircleCheck} valor={estado} aoMudar={setEstado} opcoes={["Ativo", "Inativo"]} />
        <div className="col-span-2">
          <Rotulo titulo="Foto de perfil">
            <CarregarImagem
              previsualizacao={<Avatar nome={nome || cliente.nome} tamanho={56} tipo="suave" imagem={foto} />}
              textoBotao="Alterar imagem"
              nomeFicheiro={nomeFoto}
              aoEscolher={(ficheiro) => {
                setNomeFoto(ficheiro.name);
                setFoto(URL.createObjectURL(ficheiro)); // pré-visualização da nova imagem
              }}
            />
          </Rotulo>
        </div>
      </div>

      {erroGeral && <p className="mt-4 text-sm font-medium text-perigo">{erroGeral}</p>}

      <BotoesJanela>
        <Button variant="branco" onClick={aoFechar}>
          Cancelar
        </Button>
        <Button variant="escuro" onClick={guardar} disabled={aGuardar}>
          <Check /> {aGuardar ? "A guardar..." : "Guardar alterações"}
        </Button>
      </BotoesJanela>
    </Janela>
  );
}
