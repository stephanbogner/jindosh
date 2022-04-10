import rgb_to_hex from "../rgb_to_hex/index.mjs"
import hsl_to_rgb from "../hsl_to_rgb/index.mjs"

export default function hsl_to_hex(hsl){
	const rgb = hsl_to_rgb(hsl);	
	const hex = rgb_to_hex(rgb);
	return hex;
}