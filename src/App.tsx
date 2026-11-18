// PASSO 3 do fluxo: App.tsx
// Ativa a navegação entre páginas (React Router) e mostra as rotas
// que estão no ficheiro routes/Rotas.tsx (PASSO 4).
import { BrowserRouter } from "react-router-dom";
import Rotas from "./routes/Rotas";

export default function App() {
  return (
    <BrowserRouter>
      <Rotas />
    </BrowserRouter>
  );
}
