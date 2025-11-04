import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { toast } from 'sonner'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),toast(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
