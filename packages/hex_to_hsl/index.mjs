import hex_to_rgb from "../hex_to_rgb/index.mjs"
import rgb_to_hsl from "../rgb_to_hsl/index.mjs"

export default function hex_to_hsl(hex){
	let rgb = hex_to_rgb(hex)
	let hsl = rgb_to_hsl(rgb)
	return hsl;
}