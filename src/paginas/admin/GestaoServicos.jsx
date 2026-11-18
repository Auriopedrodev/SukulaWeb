// =====================================================================
//  Ecrãs R e R4 - Gestão de serviços (lista)
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Eye, House, Pencil, Plus, Search, Shirt, Trash2, WashingMachine } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento, Seletor } from '../../componentes/Basicos';
import { AvisoFlutuante, ModalConfirmacao } from '../../componentes/Modais';
import { listarServicos, removerServico } from '../../servicos/servicosAdmin';
import { corDaCategoria, formatarKz } from '../../utilidades';

export default function GestaoServicos() {
  const navegar = useNavigate();
  const [servicos, setServicos] = useState(null);
  const [todos, setTodos] = useState([]); // usado para os números dos cartões
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [categoria, setCategoria] = useState('');
  const [servicoRemover, setServicoRemover] = useState(null);
  const [aviso, setAviso] = useState('');

  function carregar() {
    listarServicos(pesquisa, categoria).then(setServicos).catch((falha) => setErro(falha.message));
    listarServicos('', '').then(setTodos);
  }

  useEffect(carregar, [pesquisa, categoria]);

  async function confirmarRemocao() {
    await removerServico(servicoRemover.id);
    setAviso(servicoRemover.nome + ' foi removido da lista de serviços.');
    setServicoRemover(null);
    carregar();
  }

  const contar = (cat) => todos.filter((s) => s.categoria === cat).length;
  const indicadores = [
    { titulo: 'Total de serviços', valor: todos.length, icone: WashingMachine },
    { titulo: 'Roupa', valor: contar('Roupa'), icone: Shirt },
    { titulo: 'Calçados', valor: contar('Calçados'), icone: Box },
    { titulo: 'Lar', valor: contar('Lar'), icone: House },
  ];

  return (
    <>
      <BarraSuperior titulo="Gestão de serviços" />

      <div className="conteudo">
        <div className="linha-entre">
          <h2 className="titulo-seccao">Serviços</h2>
          <button type="button" className="botao botao-primario" onClick={() => navegar('/admin/servicos/novo')}>
            <Plus size={18} /> Adicionar serviço
          </button>
        </div>

        <div className="grelha-4" style={{ marginTop: -4 }}>
          {indicadores.map((item) => (
            <div key={item.titulo} className="cartao cartao-indicador">
              <span className="icone-quadrado"><item.icone size={22} /></span>
              <div>
                <p className="rotulo">{item.titulo}</p>
                <p className="valor">{item.valor}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="linha-entre">
          <div className="linha">
            <div className="caixa-campo pesquisa" style={{ width: 340 }}>
              <Search size={18} />
              <input value={pesquisa} placeholder="Pesquisar serviço" onChange={(evento) => setPesquisa(evento.target.value)} />
            </div>
            <Seletor
              valor={categoria}
              aoMudar={setCategoria}
              opcoes={[
                { valor: '', texto: 'Todos' },
                { valor: 'Roupa', texto: 'Roupa' },
                { valor: 'Calçados', texto: 'Calçados' },
                { valor: 'Lar', texto: 'Lar' },
              ]}
            />
          </div>
        </div>

        <EstadoCarregamento aCarregar={!servicos} erro={erro} />

        {servicos && (
          <div className="cartao cartao-sem-espaco">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome do serviço</th>
                  <th>Categoria</th>
                  <th>Preço base</th>
                  <th>Artigos</th>
                  <th>Lavandarias</th>
                  <th>Estado</th>
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((servico) => (
                  <tr key={servico.id}>
                    <td><span className="linha forte" style={{ gap: 14 }}><WashingMachine size={18} /> {servico.nome}</span></td>
                    <td><span className={'etiqueta ' + corDaCategoria(servico.categoria)}>{servico.categoria}</span></td>
                    <td className="forte">{formatarKz(servico.precoBase)}</td>
                    <td>
                      <div className="linha" style={{ gap: 6 }}>
                        {servico.artigos.slice(0, 3).map((artigo) => <span key={artigo} className="etiqueta contorno">{artigo}</span>)}
                        {servico.artigos.length > 3 && <span className="etiqueta azul">+{servico.artigos.length - 3}</span>}
                      </div>
                    </td>
                    <td>{servico.totalLavandarias} lavand.</td>
                    <td><span className={'estado ' + (servico.ativo ? 'ativo' : 'inativo')}>{servico.ativo ? 'Ativo' : 'Inativo'}</span></td>
                    <td className="acoes">
                      <button type="button" className="botao-icone" title="Ver" onClick={() => navegar('/admin/servicos/' + servico.id)}><Eye size={18} /></button>
                      <button type="button" className="botao-icone" title="Editar" onClick={() => navegar('/admin/servicos/' + servico.id + '/editar')}><Pencil size={18} /></button>
                      <button type="button" className="botao-icone" title="Remover" onClick={() => setServicoRemover(servico)}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {servicoRemover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover serviço?"
          texto={'O serviço ' + servicoRemover.nome + ' deixará de estar disponível nas ' + servicoRemover.totalLavandarias + ' lavandarias que o oferecem. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover serviço"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setServicoRemover(null)}
        />
      )}

      {aviso && <AvisoFlutuante icone={<Trash2 size={20} />} titulo="Serviço removido" texto={aviso} aoFechar={() => setAviso('')} />}
    </>
  );
}
