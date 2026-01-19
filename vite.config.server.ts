import { defineConfig } from "vite";
import path from "path";

// Vite config for SERVER (SSR / Backend bundle)
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "backend/server.js"),
      name: "server",
      fileName: "production",
      formats: ["es"],
    },
    outDir: "dist/server",
    target: "node22",
    ssr: true,

    rollupOptions: {
      external: [
        //  Auto externalize all node built-ins
        /^node:.*/,

        //  Node core modules
        "fs",
        "path",
        "url",
        "http",
        "https",
        "os",
        "crypto",
        "stream",
        "util",
        "events",
        "buffer",
        "querystring",
        "child_process",

        // ✅ Backend-only dependencies
        "express",
        "cors",
        "mongoose",
        "bcrypt",
        "bcryptjs",
        "jsonwebtoken",
        "dotenv",
        "nodemailer",
        "multer",
        "cloudinary",
        "sharp"
      ],

      output: {
        format: "es",
        entryFileNames: "[name].mjs",
      },
    },

    minify: false,
    sourcemap: true,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },

  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
