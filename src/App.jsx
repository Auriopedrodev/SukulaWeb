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
import GestaoArtigos from './paginas/admin/GestaoArtigos';
import DetalhesArtigo from './paginas/admin/DetalhesArtigo';
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
import UtilizadoresLavandaria from './paginas/lavandaria/UtilizadoresLavandaria';
import GestaoServicos from './paginas/lavandaria/GestaoServicos';
import Registo from './paginas/Registo';
import EsqueciPalavraPasse from './paginas/EsqueciPalavraPasse';
import RedefinirPalavraPasse from './paginas/RedefinirPalavraPasse';

export default function App() {
  return (
    <Routes>
      {/* Endereço inicial: vai para o login do administrador */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/registo" element={<Registo />} />
      <Route path="/esqueci-palavra-passe" element={<EsqueciPalavraPasse />} />
      <Route path="/redefinir-palavra-passe" element={<RedefinirPalavraPasse />} />

      {/* ================= PAINEL DO ADMINISTRADOR ================= */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route index element={<PaginaPrincipal />} />
        <Route path="clientes" element={<GestaoClientes />} />
        <Route path="lavandarias" element={<GestaoLavandarias />} />
        <Route path="lavandarias/:id" element={<DetalhesLavandaria />} />
        <Route path="artigos" element={<GestaoArtigos />} />
        <Route path="artigos/:id" element={<DetalhesArtigo />} />
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
        <Route path="servicos" element={<GestaoServicos />} />
        <Route path="utilizadores" element={<UtilizadoresLavandaria />} />
        <Route path="perfil" element={<PerfilLavandaria />} />
      </Route>

      {/* Qualquer outro endereço volta ao início */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
