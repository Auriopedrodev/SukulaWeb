// =====================================================================
//  Gestão de serviços da lavandaria da sessão.
//  O artigo vem de um select. O lavandariaId sai da sessão.
// =====================================================================

import { useEffect, useState } from 'react';
import { Check, CreditCard, Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento } from '../../componentes/Basicos';
import { CampoSelecao, CampoTexto } from '../../componentes/Formulario';
import { AvisoFlutuante, Modal, ModalConfirmacao } from '../../componentes/Modais';
import { lerSessao } from '../../servicos/autenticacao';
import {
  adicionarServico,
  editarServico,
  listarArtigos,
  listarServicosDaLavandaria,
  removerServico,
} from '../../servicos/servicosAdmin';
import { formatarKz } from '../../utilidades';

function nomeDoArtigo(artigos, artigoId) {
  const artigo = (artigos || []).find((item) => item.idArtigo === artigoId);
  return artigo ? artigo.nome : '';
}

export default function GestaoServicos() {
  const lavandariaId = lerSessao()?.lavandariaId || '';
  const [servicos, setServicos] = useState(null);
  const [artigos, setArtigos] = useState([]);
  const [erro, setErro] = useState('');
  const [erroArtigos, setErroArtigos] = useState('');
  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
  const [servicoEditar, setServicoEditar] = useState(null);
  const [servicoRemover, setServicoRemover] = useState(null);
  const [aviso, setAviso] = useState(null);

  function carregar() {
    if (!lavandariaId) {
      setErro('Esta conta não tem lavandaria associada.');
      setServicos([]);
      return;
    }
    setErro('');
    listarServicosDaLavandaria(lavandariaId)
      .then((lista) => setServicos(Array.isArray(lista) ? lista : []))
      .catch((falha) => setErro(falha.message));
  }

  useEffect(carregar, [lavandariaId]);

  useEffect(() => {
    listarArtigos()
      .then((lista) => setArtigos(Array.isArray(lista) ? lista : []))
      .catch((falha) => setErroArtigos(falha.message));
  }, []);

  async function guardarNovo(dados) {
    await adicionarServico(dados);
    setMostrarAdicionar(false);
    setAviso({ titulo: 'Serviço adicionado', texto: dados.nome + ' foi adicionado.' });
    carregar();
  }

  async function guardarEdicao(dados) {
    await editarServico(servicoEditar.idServico, dados);
    setServicoEditar(null);
    setAviso({ titulo: 'Alterações guardadas', texto: 'O serviço ' + dados.nome + ' foi atualizado.' });
    carregar();
  }

  async function confirmarRemocao() {
    try {
      await removerServico(servicoRemover.idServico);
      setAviso({ titulo: 'Serviço removido', texto: servicoRemover.nome + ' foi removido.', remover: true });
      setServicoRemover(null);
      carregar();
    } catch (falha) {
      setServicoRemover(null);
      setErro(falha.message);
    }
  }

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Gestão de serviços" />

      <div className="conteudo">
        <div className="linha-entre">
          <h2 className="titulo-seccao">Serviços</h2>
          <button type="button" className="botao botao-primario" onClick={() => setMostrarAdicionar(true)} disabled={!lavandariaId}>
            <Plus size={18} /> Adicionar serviço
          </button>
        </div>

        <EstadoCarregamento aCarregar={!servicos && !erro} erro={erro} />
        {erroArtigos && <p className="mensagem-erro">{erroArtigos}</p>}

        {servicos && servicos.length === 0 && !erro && (
          <p className="texto-cinza">Esta lavandaria ainda não tem serviços.</p>
        )}

        {servicos && servicos.length > 0 && (
          <div className="cartao cartao-sem-espaco">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Artigo</th>
                  <th>Preço base</th>
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((servico) => (
                  <tr key={servico.idServico}>
                    <td className="forte">{servico.nome}</td>
                    <td>{nomeDoArtigo(artigos, servico.artigoId)}</td>
                    <td>{formatarKz(servico.precoBase)}</td>
                    <td className="acoes">
                      <button type="button" className="botao-icone" title="Editar" onClick={() => setServicoEditar(servico)}>
                        <Pencil size={17} />
                      </button>
                      <button type="button" className="botao-icone" title="Remover" onClick={() => setServicoRemover(servico)}>
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarAdicionar && (
        <JanelaServico artigos={artigos} lavandariaId={lavandariaId} aoFechar={() => setMostrarAdicionar(false)} aoGuardar={guardarNovo} />
      )}
      {servicoEditar && (
        <JanelaServico servico={servicoEditar} artigos={artigos} lavandariaId={lavandariaId} aoFechar={() => setServicoEditar(null)} aoGuardar={guardarEdicao} />
      )}

      {servicoRemover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover serviço?"
          texto={'O serviço ' + servicoRemover.nome + ' será removido. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover serviço"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setServicoRemover(null)}
        />
      )}

      {aviso && (
        <AvisoFlutuante
          icone={aviso.remover ? <Trash2 size={20} /> : <Check size={20} />}
          titulo={aviso.titulo}
          texto={aviso.texto}
          aoFechar={() => setAviso(null)}
        />
      )}
    </>
  );
}

function JanelaServico({ servico, artigos, lavandariaId, aoFechar, aoGuardar }) {
  const emEdicao = Boolean(servico);
  const opcoes = (artigos || []).map((artigo) => ({ valor: artigo.idArtigo, texto: artigo.nome }));
  const [nome, setNome] = useState(servico ? servico.nome : '');
  const [precoBase, setPrecoBase] = useState(servico ? String(servico.precoBase) : '');
  const [artigoId, setArtigoId] = useState(servico ? servico.artigoId : (opcoes[0]?.valor || ''));
  const [erro, setErro] = useState('');

  async function guardar() {
    const preco = Number(precoBase);
    if (!nome.trim()) {
      setErro('O nome do serviço é obrigatório.');
      return;
    }
    if (precoBase === '' || Number.isNaN(preco) || preco < 0) {
      setErro('O preço base não pode ser negativo.');
      return;
    }
    if (!artigoId) {
      setErro('Escolha um artigo.');
      return;
    }
    try {
      await aoGuardar({
        nome: nome.trim(),
        precoBase: preco,
        artigoId,
        lavandariaId,
      });
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <Modal
      titulo={emEdicao ? 'Editar serviço' : 'Adicionar serviço'}
      subtitulo="O serviço fica ligado ao artigo escolhido e a esta lavandaria."
      aoFechar={aoFechar}
      largura={560}
    >
      <div className="coluna" style={{ gap: 14 }}>
        <CampoTexto rotulo="Nome" valor={nome} aoMudar={setNome} placeholder="Lavagem e engomar" obrigatorio />
        <CampoTexto rotulo="Preço base" icone={<CreditCard size={18} />} tipo="number" valor={precoBase} aoMudar={setPrecoBase} placeholder="1000" sufixo="Kz" obrigatorio />
        <CampoSelecao
          rotulo="Artigo"
          icone={<Tag size={18} />}
          valor={artigoId}
          aoMudar={setArtigoId}
          opcoes={opcoes.length ? opcoes : [{ valor: '', texto: 'Sem artigos' }]}
          obrigatorio
        />
        {erro && <p className="mensagem-erro">{erro}</p>}
        <button type="button" className="botao botao-primario botao-largo" onClick={guardar}>
          <Check size={18} /> {emEdicao ? 'Guardar alterações' : 'Adicionar serviço'}
        </button>
      </div>
    </Modal>
  );
}
