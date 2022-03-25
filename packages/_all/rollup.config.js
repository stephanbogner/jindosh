import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'index.mjs',
  output: [
    {
      file: '../../dist/jindosh.js',
      format: 'umd',
      name: 'jindosh',
      plugins: []
    },
    {
      file: '../../dist/jindosh.min.js',
      format: 'umd',
      name: 'jindosh',
      plugins: [terser()]
    }
  ],
  plugins: [nodeResolve()]
};