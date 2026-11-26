// PASSO 2 do fluxo: main.tsx
// Liga o React à <div id="root"> do index.html e carrega as cores (index.css).
// A seguir vem o App.tsx (PASSO 3).
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
