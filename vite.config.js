import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Solo para la demo del Squad 5: sin Orchestrator, cada ruta va directo a su servicio.
// En el repositorio general se deja el proxy de /api hacia el Orchestrator.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/search': 'http://localhost:8081',
      '/api/v1/reputation': 'http://localhost:8082',
      '/api/v1/reporting': 'http://localhost:8083',
    },
  },
})
