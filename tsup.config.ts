import handlebars from 'rollup-plugin-handlebars';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'], // include all files under src

  entryPoints: ['src/index.ts'], // ou outros arquivos de entrada que você possa ter
  format: ['cjs', 'esm'],
  plugins: [
    handlebars({
      // Configurações do rollup-plugin-handlebars, se necessário
    }),
  ],
  loader: { '.hbs': handlebars },
});

// export const tsup: Options = {
//   splitting: true,
//   clean: true, // clean up the dist folder
//   dts: true, // generate dts files
//   format: ['cjs', 'esm'], // generate cjs and esm files
//   skipNodeModulesBundle: true,
//   entryPoints: ['src/index.ts'],
//   target: 'es2020',
//   entry: ['src/**/*.ts'],
// };
