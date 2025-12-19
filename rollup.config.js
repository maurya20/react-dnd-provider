import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  plugins: [
    typescript({
      tsconfig: path.join(__dirname, 'tsconfig.build.json'),
      declaration: true,
      declarationDir: 'dist',
    }),
  ],
};

