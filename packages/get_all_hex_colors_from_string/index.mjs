export default function get_all_hex_colors_from_string(string){
    // From https://gist.github.com/stephanbogner/48d19c30849a4f5fbdc5374111c3ca31
	const regularExpression = /#(?:[0-9a-fA-F]{3}){1,2}/g
	return string.match(regularExpression) || [];
}