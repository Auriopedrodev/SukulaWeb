// =====================================================================
//  Ecrã N - Página principal do Administrador
// =====================================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, ChevronRight, Shirt, Store, User, Users, WashingMachine } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento } from '../../componentes/Basicos';
import { obterResumo } from '../../servicos/servicosAdmin';
import { formatarNumero } from '../../utilidades';

export default function PaginaPrincipal() {
  const [resumo, setResumo] = useState(null);
  const [erro, setErro] = useState('');

  // Vai buscar os números à API quando a página abre
  useEffect(() => {
    obterResumo().then(setResumo).catch((falha) => setErro(falha.message));
  }, []);

  if (!resumo) {
    return (
      <>
        <BarraSuperior titulo="Página principal" />
        <div className="conteudo">
          <EstadoCarregamento aCarregar erro={erro} />
        </div>
      </>
    );
  }

  // Cartões de cima (números)
  const indicadores = [
    { titulo: 'Clientes registados', valor: resumo.totalClientes, icone: Users },
    { titulo: 'Lavandarias', valor: resumo.totalLavandarias, icone: Store },
    { titulo: 'Serviços ativos', valor: resumo.servicosAtivos, icone: WashingMachine },
    { titulo: 'Artigos', valor: resumo.totalArtigos, icone: Shirt },
    { titulo: 'Entregadores', valor: resumo.totalEntregadores, icone: Bike },
  ];

  // Atalhos para as secções de gestão
  const seccoes = [
    { titulo: 'Gestão de clientes', detalhe: formatarNumero(resumo.totalClientes) + ' clientes', endereco: '/admin/clientes', icone: Users },
    { titulo: 'Gestão de lavandarias', detalhe: resumo.totalLavandarias + ' lavandarias', endereco: '/admin/lavandarias', icone: Store },
    { titulo: 'Gestão de serviços', detalhe: resumo.servicosAtivos + ' serviços', endereco: '/admin/servicos', icone: WashingMachine },
    { titulo: 'Gestão de artigos', detalhe: resumo.totalArtigos + ' artigos', endereco: '/admin/artigos', icone: Shirt },
    { titulo: 'Gestão de entregadores', detalhe: resumo.totalEntregadores + ' entregadores', endereco: '/admin/entregadores', icone: Bike },
    { titulo: 'Perfil da conta', detalhe: 'Administrador', endereco: '/admin/perfil', icone: User },
  ];

  return (
    <>
      <BarraSuperior titulo="Página principal" />

      <div className="conteudo">
        <div className="grelha-5">
          {indicadores.map((item) => (
            <div key={item.titulo} className="cartao cartao-indicador">
              <span className="icone-quadrado">
                <item.icone size={22} />
              </span>
              <div>
                <p className="rotulo">{item.titulo}</p>
                <p className="valor">{formatarNumero(item.valor)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="linha-entre">
          <h2 className="titulo-cartao" style={{ fontSize: 16 }}>Secções de gestão</h2>
          <span className="texto-cinza texto-pequeno">6 secções</span>
        </div>

        <div className="grelha-3" style={{ marginTop: -6 }}>
          {seccoes.map((seccao) => (
            <Link key={seccao.titulo} to={seccao.endereco} className="cartao" style={{ padding: 20, color: 'var(--azul)' }}>
              <seccao.icone size={22} />
              <h3 className="titulo-cartao" style={{ marginTop: 26 }}>{seccao.titulo}</h3>
              <div className="linha-entre" style={{ marginTop: 10, fontSize: 12, fontWeight: 700 }}>
                <span>{seccao.detalhe}</span>
                <span className="linha" style={{ gap: 4 }}>
                  Abrir <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
