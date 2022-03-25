import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'index.mjs',
  output: {
    file: '../../dist/jindosh.min.js',
    format: 'umd',
    name: 'jindosh'
  },
  plugins: [nodeResolve(), terser()]
};