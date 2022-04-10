import hex_to_hsl from './index.mjs'

const from = '#848484'
const to = hex_to_hsl(from)

console.log(from, '->', to)