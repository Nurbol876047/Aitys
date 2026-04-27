import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("three")) return "three";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("gsap")) return "gsap";
          if (id.includes("howler")) return "audio";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@mediapipe")) return "mediapipe";
          return "vendor";
        },
      },
    },
  },
});
