// =====================================================================
//  Janela "Adicionar artigo" / "Editar artigo"
//  A API só pede nome e categoria.
// =====================================================================

import { useState } from 'react';
import { Check, Shirt, Tag } from 'lucide-react';
import { Modal } from '../../componentes/Modais';
import { CampoSelecao, CampoTexto } from '../../componentes/Formulario';

const categorias = ['Roupa', 'Calçados', 'Lar'];

export default function JanelaArtigo({ artigo, aoFechar, aoGuardar }) {
  const emEdicao = Boolean(artigo);
  const [nome, setNome] = useState(artigo ? artigo.nome : '');
  const [categoria, setCategoria] = useState(artigo && categorias.includes(artigo.categoria) ? artigo.categoria : 'Roupa');
  const [erro, setErro] = useState('');

  async function guardar() {
    if (!nome.trim()) {
      setErro('Preencha o nome.');
      return;
    }
    try {
      await aoGuardar({ nome: nome.trim(), categoria });
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <Modal
      titulo={emEdicao ? 'Editar artigo' : 'Adicionar artigo'}
      subtitulo="O artigo fica no catálogo. O serviço é que o liga a uma lavandaria."
      aoFechar={aoFechar}
      largura={480}
    >
      <div className="coluna" style={{ gap: 14 }}>
        <CampoTexto rotulo="Nome" icone={<Shirt size={18} />} valor={nome} aoMudar={setNome} placeholder="Camisa" obrigatorio />
        <CampoSelecao rotulo="Categoria" icone={<Tag size={18} />} valor={categoria} aoMudar={setCategoria} opcoes={categorias} obrigatorio />
        {erro && <p className="mensagem-erro">{erro}</p>}
        <button type="button" className="botao botao-primario botao-largo" onClick={guardar}>
          <Check size={18} /> {emEdicao ? 'Guardar alterações' : 'Adicionar artigo'}
        </button>
      </div>
    </Modal>
  );
}
