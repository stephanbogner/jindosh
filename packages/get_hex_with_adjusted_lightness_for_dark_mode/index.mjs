import hex_to_hsl from "../hex_to_hsl/index.mjs"
import hsl_to_hex from "../hsl_to_hex/index.mjs"
import map_range from "../map_range/index.mjs"

export default function get_hex_with_adjusted_lightness_for_dark_mode(hex, options = {}){
	const min_l = options.min_l ?? 0.3
	const max_l = options.max_l ?? 0.95

	let hsl = hex_to_hsl(hex)
	const new_lightness = map_range(hsl.l, 0, 1, max_l, min_l)
	hsl.l = new_lightness
	return hsl_to_hex(hsl)
}