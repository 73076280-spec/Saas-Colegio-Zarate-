import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Raíz del repositorio: las rutas SF del LCOV salen como frontend/src/... (la base que usa el escáner, no frontend/).
const repoRoot = fileURLToPath(new URL('..', import.meta.url))

// Configuración mínima de pruebas: reutiliza el plugin de React de Vite y no toca vite.config.ts.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
    css: false,
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: [['lcovonly', { projectRoot: repoRoot }], 'text-summary', 'text'],
      reportsDirectory: 'coverage',
      exclude: ['tests/**', 'vitest.config.ts', '**/*.css'],
    },
  },
})
