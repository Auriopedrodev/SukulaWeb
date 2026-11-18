// =====================================================================
//  Ecrã S2 - Janela "Adicionar artigo" / "Editar artigo"
// =====================================================================

import { useEffect, useState } from 'react';
import { Check, Shirt, Tag, WashingMachine } from 'lucide-react';
import { Modal } from '../../componentes/Modais';
import { CampoSelecao, CampoTexto } from '../../componentes/Formulario';
import { listarServicos, listas } from '../../servicos/servicosAdmin';

export default function JanelaArtigo({ artigo, aoFechar, aoGuardar }) {
  const emEdicao = Boolean(artigo);
  const [nome, setNome] = useState(artigo ? artigo.nome : '');
  const [categoria, setCategoria] = useState(artigo ? artigo.categoria : 'Roupa');
  const [cores, setCores] = useState(artigo ? artigo.cores : []);
  const [tamanhos, setTamanhos] = useState(artigo ? artigo.tamanhos : []);
  const [servico, setServico] = useState(artigo && artigo.servicos.length ? artigo.servicos[0] : 'Lavagem a Seco');
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarServicos('', '').then((lista) => setServicosDisponiveis(lista.map((s) => s.nome)));
  }, []);

  // Junta ou tira um valor de uma lista (usado nas cores e tamanhos)
  function alternar(lista, valor) {
    return lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];
  }

  async function guardar() {
    if (!nome.trim() || cores.length === 0 || tamanhos.length === 0) {
      setErro('Preencha o nome e escolha pelo menos uma cor e um tamanho.');
      return;
    }
    try {
      await aoGuardar({ nome, categoria, cores, tamanhos, servicos: [servico] });
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <Modal titulo={emEdicao ? 'Editar artigo' : 'Adicionar artigo'} aoFechar={aoFechar} largura={720}>
      <div className="grelha-2">
        <CampoTexto rotulo="Nome do artigo" obrigatorio icone={<Shirt size={18} />} valor={nome} aoMudar={setNome} />
        <CampoSelecao rotulo="Categoria" obrigatorio icone={<Tag size={18} />} valor={categoria} aoMudar={setCategoria} opcoes={listas.categorias} />
      </div>

      <div className="campo" style={{ marginTop: 18 }}>
        <div className="linha-entre">
          <span className="rotulo-campo">Cores *</span>
          <span className="texto-cinza" style={{ fontSize: 11 }}>Selecionadas: {cores.join(', ') || 'nenhuma'}</span>
        </div>
        <div className="escolhas">
          {listas.cores.map((cor) => (
            <button key={cor.nome} type="button" className={'escolha' + (cores.includes(cor.nome) ? ' ativo' : '')} onClick={() => setCores(alternar(cores, cor.nome))}>
              <span className="bola-cor" style={{ background: cor.codigo }} />
              {cor.nome}
            </button>
          ))}
        </div>
      </div>

      <div className="campo" style={{ marginTop: 18 }}>
        <div className="linha-entre">
          <span className="rotulo-campo">Tamanhos *</span>
          <span className="texto-cinza" style={{ fontSize: 11 }}>Selecionados: {tamanhos.join(', ') || 'nenhum'}</span>
        </div>
        <div className="escolhas">
          {listas.tamanhos.map((tamanho) => (
            <button key={tamanho} type="button" className={'escolha' + (tamanhos.includes(tamanho) ? ' ativo' : '')} onClick={() => setTamanhos(alternar(tamanhos, tamanho))}>
              {tamanho}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <CampoSelecao rotulo="Serviços associados" icone={<WashingMachine size={18} />} valor={servico} aoMudar={setServico} opcoes={servicosDisponiveis.length ? servicosDisponiveis : [servico]} />
      </div>

      {erro && <p className="mensagem-erro" style={{ marginTop: 12 }}>{erro}</p>}
      <div className="modal-rodape">
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-primario" onClick={guardar}>
          <Check size={18} /> {emEdicao ? 'Guardar alterações' : 'Guardar artigo'}
        </button>
      </div>
    </Modal>
  );
}
