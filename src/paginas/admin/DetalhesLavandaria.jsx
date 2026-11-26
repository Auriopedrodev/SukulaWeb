// =====================================================================
//  Detalhes da lavandaria
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Clock, Info, MapPin, Pencil, Store, Trash2 } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento } from '../../componentes/Basicos';
import { ModalConfirmacao } from '../../componentes/Modais';
import JanelaLavandaria from './JanelaLavandaria';
import { editarLavandaria, listarServicosDaLavandaria, obterLavandaria, removerLavandaria, urlDaFoto } from '../../servicos/servicosAdmin';
import { formatarKz } from '../../utilidades';

export default function DetalhesLavandaria() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [lavandaria, setLavandaria] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState('');
  const [editar, setEditar] = useState(false);
  const [remover, setRemover] = useState(false);

  function carregar() {
    setErro('');
    obterLavandaria(id).then(setLavandaria).catch((falha) => setErro(falha.message));
    listarServicosDaLavandaria(id).then(setServicos).catch(() => setServicos([]));
  }

  useEffect(carregar, [id]);

  async function guardarEdicao(dados, foto) {
    await editarLavandaria(id, dados, foto);
    setEditar(false);
    carregar();
  }

  async function confirmarRemocao() {
    try {
      await removerLavandaria(id);
      navegar('/admin/lavandarias');
    } catch (falha) {
      setRemover(false);
      setErro(falha.message);
    }
  }

  if (!lavandaria) {
    return (
      <>
        <BarraSuperior titulo="Gestão de lavandarias" />
        <div className="conteudo"><EstadoCarregamento aCarregar={!erro} erro={erro} /></div>
      </>
    );
  }

  return (
    <>
      <BarraSuperior titulo="Gestão de lavandarias" />

      <div className="conteudo">
        <div className="cabecalho-pagina">
          <div>
            <button type="button" className="ligacao-voltar" onClick={() => navegar('/admin/lavandarias')}>
              <ChevronLeft size={16} /> Voltar às lavandarias
            </button>
            <h2 className="titulo-seccao" style={{ fontSize: 20 }}>{lavandaria.nomeLavandaria}</h2>
          </div>
          <div className="linha">
            <button type="button" className="botao botao-perigo-claro" onClick={() => setRemover(true)}>
              <Trash2 size={18} /> Remover
            </button>
            <button type="button" className="botao botao-primario" onClick={() => setEditar(true)}>
              <Pencil size={18} /> Editar lavandaria
            </button>
          </div>
        </div>

        {erro && <EstadoCarregamento erro={erro} />}

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
          <div className="cartao" style={{ padding: 24, textAlign: 'center' }}>
            {lavandaria.foto ? (
              <img src={urlDaFoto(lavandaria.foto)} alt={lavandaria.nomeLavandaria} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 12 }} />
            ) : (
              <p className="texto-cinza">Sem fotografia</p>
            )}
          </div>

          <div className="cartao" style={{ padding: 24 }}>
            <h3 className="titulo-cartao">Informações</h3>
            <div className="coluna" style={{ gap: 18, marginTop: 20 }}>
              <div className="info-item"><Store size={18} className="icone" /><div><small>Nome</small><strong>{lavandaria.nomeLavandaria}</strong></div></div>
              <div className="info-item"><MapPin size={18} className="icone" /><div><small>Endereço</small><strong>{lavandaria.endereco}</strong></div></div>
              <div className="info-item"><Clock size={18} className="icone" /><div><small>Horário de funcionamento</small><strong>{lavandaria.horarioFuncionamento}</strong></div></div>
              <div className="info-item"><MapPin size={18} className="icone" /><div><small>Coordenadas</small><strong>{lavandaria.latitude}, {lavandaria.longitude}</strong></div></div>
              <div className="info-item"><Info size={18} className="icone" /><div><small>Descrição</small><strong>{lavandaria.descricao}</strong></div></div>
            </div>
          </div>
        </div>

        <h3 className="titulo-cartao" style={{ fontSize: 16, marginTop: 8 }}>Serviços desta lavandaria</h3>
        <div className="cartao cartao-sem-espaco">
          <table className="tabela">
            <thead>
              <tr><th>Serviço</th><th>Preço base</th></tr>
            </thead>
            <tbody>
              {servicos.length === 0 && (
                <tr><td colSpan={2} className="texto-cinza">Esta lavandaria ainda não tem serviços.</td></tr>
              )}
              {servicos.map((servico) => (
                <tr key={servico.idServico}>
                  <td className="forte">{servico.nome}</td>
                  <td>{formatarKz(servico.precoBase)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editar && <JanelaLavandaria lavandaria={lavandaria} aoFechar={() => setEditar(false)} aoGuardar={guardarEdicao} />}

      {remover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover lavandaria?"
          texto={'A lavandaria ' + lavandaria.nomeLavandaria + ' e a sua fotografia serão removidas. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover lavandaria"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setRemover(false)}
        />
      )}
    </>
  );
}
