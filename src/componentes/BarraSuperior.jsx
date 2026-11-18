// =====================================================================
//  BARRA SUPERIOR (título da página e pesquisa)
// =====================================================================

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';

// titulo: texto grande
// subtitulo: texto pequeno por baixo (opcional)
// voltarPara: endereço do botão "voltar" (opcional)
// painel: 'admin' ou 'lavandaria' (muda o texto da pesquisa)
export default function BarraSuperior({ titulo, subtitulo, voltarPara, painel = 'admin' }) {
  const navegar = useNavigate();
  const ehAdmin = painel === 'admin';

  return (
    <header className="barra-superior">
      {voltarPara && (
        <button type="button" className="botao-voltar" onClick={() => navegar(voltarPara)} title="Voltar">
          <ChevronLeft size={20} />
        </button>
      )}

      <div>
        <h1>{titulo}</h1>
        {subtitulo && <p className="subtitulo">{subtitulo}</p>}
      </div>

      <div className="lado-direito">
        <label className="pesquisa-superior">
          <Search size={18} />
          <input placeholder={ehAdmin ? 'Pesquisar clientes, lavandarias...' : 'Pesquisar pedidos, clientes...'} />
        </label>
      </div>
    </header>
  );
}
