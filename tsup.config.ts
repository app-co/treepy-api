import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"], // Ajuste conforme seu projeto
	outDir: "dist",
	format: ["cjs", "esm"],
	splitting: false,
	sourcemap: true,
	clean: true,
	loader: {
		".hbs": "text", // Define que arquivos .hbs serão tratados como texto
	},
});
