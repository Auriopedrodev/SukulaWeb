// =====================================================================
//  Ecrã K3 - Controle > Lista de estafetas
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ban, Bike, Check, Clock, Plus, Users } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, BarraProgresso, EstadoCarregamento, Etiqueta, Nota, Seletor, corDaProducao } from '../../componentes/Basicos';
import { listarEstafetas } from '../../servicos/servicosLavandaria';

export default function ListaEstafetas() {
  const navegar = useNavigate();
  const [todos, setTodos] = useState(null);
  const [erro, setErro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState(''); // '' = Todos
  const [periodo, setPeriodo] = useState('semana');
  const [linhaEscolhida, setLinhaEscolhida] = useState(1);

  useEffect(() => {
    listarEstafetas('', periodo).then(setTodos).catch((falha) => setErro(falha.message));
  }, [periodo]);

  if (!todos) {
    return (
      <>
        <BarraSuperior painel="lavandaria" titulo="Estafetas" subtitulo="Lista de estafetas e produção individual" />
        <div className="conteudo"><EstadoCarregamento aCarregar erro={erro} /></div>
      </>
    );
  }

  const contar = (estado) => todos.filter((e) => e.estado === estado).length;
  const visiveis = todos.filter((e) => !filtroEstado || e.estado === filtroEstado);

  // Cartões de cima (cor de fundo do ícone muda conforme o estado)
  const resumo = [
    { titulo: 'Total de estafetas', valor: todos.length, icone: Users, fundo: 'var(--azul-claro)', cor: 'var(--azul)' },
    { titulo: 'Disponíveis', valor: contar('Disponível'), icone: Check, fundo: 'var(--azul-claro)', cor: 'var(--verde)' },
    { titulo: 'Em rota', valor: contar('Em rota'), icone: Bike, fundo: 'var(--azul-claro)', cor: 'var(--azul-medio)' },
    { titulo: 'Ocupados', valor: contar('Ocupado'), icone: Clock, fundo: 'var(--laranja-claro)', cor: 'var(--laranja)' },
    { titulo: 'Offline', valor: contar('Offline'), icone: Ban, fundo: 'var(--azul-claro)', cor: 'var(--texto-cinza)' },
  ];

  const separadores = [
    { valor: '', texto: 'Todos (' + todos.length + ')' },
    { valor: 'Disponível', texto: 'Disponíveis' },
    { valor: 'Em rota', texto: 'Em rota' },
    { valor: 'Ocupado', texto: 'Ocupados' },
    { valor: 'Offline', texto: 'Offline' },
  ];

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Estafetas" subtitulo="Lista de estafetas e produção individual" />

      <div className="conteudo">
        <div className="grelha-5">
          {resumo.map((item) => (
            <div key={item.titulo} className="cartao linha" style={{ padding: 18 }}>
              <span className="icone-redondo" style={{ background: item.fundo, color: item.cor }}><item.icone size={20} /></span>
              <div>
                <strong style={{ fontSize: 22 }}>{item.valor}</strong>
                <p className="texto-cinza" style={{ fontSize: 11 }}>{item.titulo}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="linha-entre">
          <div className="separadores">
            {separadores.map((item) => (
              <button key={item.texto} type="button" className={filtroEstado === item.valor ? 'ativo' : ''} onClick={() => setFiltroEstado(item.valor)}>
                {item.texto}
              </button>
            ))}
          </div>
          <div className="linha">
            <Seletor
              valor={periodo}
              aoMudar={setPeriodo}
              opcoes={[
                { valor: 'dia', texto: 'Dia' },
                { valor: 'semana', texto: 'Semana' },
                { valor: 'mes', texto: 'Mês' },
              ]}
            />
            <button type="button" className="botao botao-primario"><Plus size={18} /> Adicionar</button>
          </div>
        </div>

        <div className="cartao cartao-sem-espaco">
          <table className="tabela">
            <thead>
              <tr>
                <th>Estafeta</th>
                <th>Estado</th>
                <th>Zona</th>
                <th>Recolhas</th>
                <th>Entregas</th>
                <th>Avaliação</th>
                <th style={{ width: 160 }}>Produção</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visiveis.map((estafeta) => (
                <tr key={estafeta.id} className={linhaEscolhida === estafeta.id ? 'destacada' : ''} onMouseEnter={() => setLinhaEscolhida(estafeta.id)}>
                  <td>
                    <div className="celula-pessoa">
                      <Avatar nome={estafeta.nome} fotoUrl={estafeta.fotoUrl} tamanho={36} />
                      <div>
                        <strong className="texto-escuro">{estafeta.nome}</strong>
                        <small>{estafeta.telefone}</small>
                      </div>
                    </div>
                  </td>
                  <td><Etiqueta texto={estafeta.estado} /></td>
                  <td className="texto-escuro">{estafeta.zona}</td>
                  <td className="texto-escuro">{estafeta.recolhas}</td>
                  <td className="texto-escuro">{estafeta.entregas}</td>
                  <td className="texto-escuro"><Nota valor={estafeta.avaliacao} /></td>
                  <td>
                    <div className="linha" style={{ gap: 8 }}>
                      <BarraProgresso percentagem={estafeta.producao} cor={corDaProducao(estafeta.producao)} />
                      <strong style={{ fontSize: 11, width: 28 }}>{estafeta.producao}%</strong>
                    </div>
                  </td>
                  <td className="acoes">
                    <button
                      type="button"
                      className={'botao botao-pequeno ' + (linhaEscolhida === estafeta.id ? 'botao-primario' : 'botao-claro')}
                      onClick={() => navegar('/lavandaria/controle/estafetas/' + estafeta.id)}
                    >
                      Ver produção
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="texto-cinza texto-pequeno" style={{ marginTop: -8 }}>
          A mostrar {visiveis.length} de {todos.length} estafetas · Produção da {periodo === 'dia' ? 'dia' : periodo === 'semana' ? 'semana (27 Out – 02 Nov)' : 'mês'}
        </p>
      </div>
    </>
  );
}
