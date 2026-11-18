// Configuração do Vite (o programa que cria e executa o projeto).
// Normalmente não é preciso mexer aqui.
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Permite escrever "@/components/..." em vez de "../../components/..."
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
