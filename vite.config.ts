import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const copyrightNotice = "desenvolvido por Arthur Miquelito Lopes e Heitor Crespo de Souza";
const copyrightWatermark = () => ({
  name: "copyright-watermark",
  apply: "build" as const,
  generateBundle(_options: unknown, bundle: Record<string, { type: string; code?: string }>) {
    for (const file of Object.values(bundle)) {
      if (file.type === "chunk" && file.code) {
        file.code = `/*! ${copyrightNotice} */\n${file.code}`;
      }
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-toast'],
          'charts': ['recharts'],
          'utils': ['date-fns', 'zod', 'react-hook-form']
        }
      }
    }
  },
  plugins: [react(), copyrightWatermark(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
