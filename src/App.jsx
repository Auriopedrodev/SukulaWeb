// =====================================================================
//  ROTAS DO SITE (que página aparece em cada endereço)
//  Para criar uma página nova:
//    1. crie o ficheiro em src/paginas/...
//    2. importe-o aqui em cima
//    3. junte uma linha <Route path="..." element={<APagina />} />
// =====================================================================

import { Navigate, Route, Routes } from 'react-router-dom';

import LayoutAdmin from './componentes/LayoutAdmin';
import LayoutLavandaria from './componentes/LayoutLavandaria';

// ---- Páginas do Administrador ----
import LoginAdmin from './paginas/admin/LoginAdmin';
import PaginaPrincipal from './paginas/admin/PaginaPrincipal';
import GestaoClientes from './paginas/admin/GestaoClientes';
import GestaoLavandarias from './paginas/admin/GestaoLavandarias';
import DetalhesLavandaria from './paginas/admin/DetalhesLavandaria';
import GestaoServicos from './paginas/admin/GestaoServicos';
import DetalhesServico from './paginas/admin/DetalhesServico';
import FormularioServico from './paginas/admin/FormularioServico';
import GestaoArtigos from './paginas/admin/GestaoArtigos';
import DetalhesArtigo from './paginas/admin/DetalhesArtigo';
import GestaoEntregadores from './paginas/admin/GestaoEntregadores';
import PerfilAdmin from './paginas/admin/PerfilAdmin';

// ---- Páginas da Lavandaria ----
import LoginLavandaria from './paginas/lavandaria/LoginLavandaria';
import Dashboard from './paginas/lavandaria/Dashboard';
import ListaEstafetas from './paginas/lavandaria/ListaEstafetas';
import ProducaoEstafeta from './paginas/lavandaria/ProducaoEstafeta';
import PedidosNovos from './paginas/lavandaria/PedidosNovos';
import PedidosEmProcessamento from './paginas/lavandaria/PedidosEmProcessamento';
import HistoricoPedidos from './paginas/lavandaria/HistoricoPedidos';
import DetalhesPedido from './paginas/lavandaria/DetalhesPedido';
import PerfilLavandaria from './paginas/lavandaria/PerfilLavandaria';

export default function App() {
  return (
    <Routes>
      {/* Endereço inicial: vai para o login do administrador */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* ================= PAINEL DO ADMINISTRADOR ================= */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<PaginaPrincipal />} />
        <Route path="clientes" element={<GestaoClientes />} />
        <Route path="lavandarias" element={<GestaoLavandarias />} />
        <Route path="lavandarias/:id" element={<DetalhesLavandaria />} />
        <Route path="servicos" element={<GestaoServicos />} />
        <Route path="servicos/novo" element={<FormularioServico />} />
        <Route path="servicos/:id" element={<DetalhesServico />} />
        <Route path="servicos/:id/editar" element={<FormularioServico />} />
        <Route path="artigos" element={<GestaoArtigos />} />
        <Route path="artigos/:id" element={<DetalhesArtigo />} />
        <Route path="entregadores" element={<GestaoEntregadores />} />
        <Route path="perfil" element={<PerfilAdmin />} />
      </Route>

      {/* ================= PAINEL DA LAVANDARIA ================= */}
      <Route path="/lavandaria/login" element={<LoginLavandaria />} />
      <Route path="/lavandaria" element={<LayoutLavandaria />}>
        <Route index element={<Navigate to="/lavandaria/controle/dashboard" replace />} />
        <Route path="controle/dashboard" element={<Dashboard />} />
        <Route path="controle/estafetas" element={<ListaEstafetas />} />
        <Route path="controle/estafetas/:id" element={<ProducaoEstafeta />} />
        <Route path="pedidos/novos" element={<PedidosNovos />} />
        <Route path="pedidos/em-processamento" element={<PedidosEmProcessamento />} />
        <Route path="pedidos/historico" element={<HistoricoPedidos />} />
        <Route path="pedidos/:separador/:id" element={<DetalhesPedido />} />
        <Route path="perfil" element={<PerfilLavandaria />} />
      </Route>

      {/* Qualquer outro endereço volta ao início */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
