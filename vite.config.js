import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite (ferramenta que corre e compila o projeto).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
