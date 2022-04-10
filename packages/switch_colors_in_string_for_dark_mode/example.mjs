import switch_colors_in_string_for_dark_mode from './index.mjs'
import * as fs from 'fs'

const svgString = fs.readFileSync('./assembly icon.svg', 'utf-8')
const new_string = switch_colors_in_string_for_dark_mode(svgString)

fs.writeFileSync('./assembly icon (dark mode).svg', new_string)
console.log(new_string)