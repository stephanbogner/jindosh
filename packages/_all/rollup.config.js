import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import * as fs from 'fs'

const version = JSON.parse(fs.readFileSync('package.json')).version

export default {
  input: 'index.mjs',
  output: [
    {
      file: '../../dist/jindosh-' + version + '.js',
      format: 'umd',
      name: 'jindosh',
      plugins: []
    },
    {
      file: '../../dist/jindosh-' + version + '.min.js',
      format: 'umd',
      name: 'jindosh',
      plugins: [terser()]
    },
    {
      file: '../../assets-for-html-examples/jindosh-latest.min.js',
      format: 'umd',
      name: 'jindosh',
      plugins: [terser()]
    }
  ],
  plugins: [nodeResolve()]
}