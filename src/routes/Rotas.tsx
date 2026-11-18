// PASSO 4 do fluxo: routes/Rotas.tsx
// Lista de TODAS as páginas do site e o endereço de cada uma.
// Para criar uma página nova:
//   1) crie o ficheiro em src/pages/
//   2) importe-o aqui
//   3) junte uma linha <Route path="/endereco" element={...} />
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { temSessao } from "@/api/conta";

import Login from "@/pages/Login";
import PaginaPrincipal from "@/pages/PaginaPrincipal";
import Clientes from "@/pages/Clientes";
import Lavandarias from "@/pages/Lavandarias";
import DetalhesLavandaria from "@/pages/DetalhesLavandaria";
import Servicos from "@/pages/Servicos";
import DetalhesServico from "@/pages/DetalhesServico";
import Artigos from "@/pages/Artigos";
import DetalhesArtigo from "@/pages/DetalhesArtigo";
import Entregadores from "@/pages/Entregadores";
import PerfilConta from "@/pages/PerfilConta";

// Só deixa abrir a página se o administrador tiver iniciado sessão.
// Caso contrário, manda para o Login.
function Protegida({ children }: { children: ReactNode }) {
  if (!temSessao()) return <Navigate to="/login" replace />;
  return children;
}

export default function Rotas() {
  return (
    <Routes>
      {/* Telas O, O1, O2 e U4.1 */}
      <Route path="/login" element={<Login />} />

      {/* Tela N */}
      <Route path="/" element={<Protegida><PaginaPrincipal /></Protegida>} />

      {/* Telas P a P5 */}
      <Route path="/clientes" element={<Protegida><Clientes /></Protegida>} />

      {/* Telas Q, Q2, Q2.1, Q3, Q4, Q4.1, Q5 e Q1 */}
      <Route path="/lavandarias" element={<Protegida><Lavandarias /></Protegida>} />
      <Route path="/lavandarias/:id" element={<Protegida><DetalhesLavandaria /></Protegida>} />

      {/* Telas R, R0, R2, R4 e R1 */}
      <Route path="/servicos" element={<Protegida><Servicos /></Protegida>} />
      <Route path="/servicos/:id" element={<Protegida><DetalhesServico /></Protegida>} />

      {/* Telas S, S2, S4 e S1 */}
      <Route path="/artigos" element={<Protegida><Artigos /></Protegida>} />
      <Route path="/artigos/:id" element={<Protegida><DetalhesArtigo /></Protegida>} />

      {/* Telas T a T4.1 */}
      <Route path="/entregadores" element={<Protegida><Entregadores /></Protegida>} />

      {/* Telas U a U4 */}
      <Route path="/perfil" element={<Protegida><PerfilConta /></Protegida>} />

      {/* Qualquer outro endereço volta à página principal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
