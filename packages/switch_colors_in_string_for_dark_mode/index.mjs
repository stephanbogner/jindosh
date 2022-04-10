import get_all_hex_colors_from_string from "../get_all_hex_colors_from_string/index.mjs"
import get_hex_with_adjusted_lightness_for_dark_mode from "../get_hex_with_adjusted_lightness_for_dark_mode/index.mjs"
import replace_colors_in_string from "../replace_colors_in_string/index.mjs"

export default function switch_colors_in_string_for_dark_mode(string, color_table){
        const default_color_table = {
                '#000': '#F2F2F2',
                '#000000': '#F2F2F2',
                'black': '#F2F2F2',
                '#fff': '#4D4D4D',
                '#ffffff': '#4D4D4D',
                '#FFF': '#4D4D4D',
                '#FFFFFF': '#4D4D4D',
                'white': '#4D4D4D',
                '#427D97': '#8AD9FB',
                '#C5E4F2': '#326276',
                '#708D1F': '#B7E041'
        }

        color_table = color_table || default_color_table
        const extracted_colors = get_all_hex_colors_from_string(string);

        // Add color replacements automatically for missing colors
        extracted_colors.map((color) => {
                if( !color_table[color] ){
                        const new_color_replacement = get_hex_with_adjusted_lightness_for_dark_mode(color)
                        color_table[color] = new_color_replacement
                }
        })

        return replace_colors_in_string(string, color_table)
}