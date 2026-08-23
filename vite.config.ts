import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { agentReady } from './src/agent/plugin'

export default defineConfig({
  plugins: [react(), tailwindcss(), agentReady()],
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              // Everything the 3D scenes need, and nothing the rest of the page
              // needs. react-reconciler, zustand, its-fine and suspend-react are
              // pulled in only by react-three-fiber, so they ride along in the
              // lazy chunk instead of the initial payload.
              name: 'three',
              test: /node_modules[\\/](three|@react-three|react-reconciler|zustand|its-fine|suspend-react)/,
            },
          ],
        },
      },
    },
  },
})
