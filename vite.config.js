export default defineConfig({
  base: "/",
  plugins: [react()],

  server: {
    host: true,
  },

  build: {
    target: "es2015",
    chunkSizeWarningLimit: 600
  }
})