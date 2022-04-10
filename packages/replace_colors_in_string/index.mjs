import replace_all_occurences_in_string from "../replace_all_occurences_in_string/index.mjs"

export default function replace_colors_in_string(string, color_table_old_new){
    // Problem e.g. "Some string with #fff and #000"
    // Table { '#fff': '#000', '#000': '#fff'} -> Basically invert
    // Without placeholder:
    // 1. #fff is replaced -> "Some string with #000 and #000"
    // 2. #000 is replaced -> "Some string with #fff and #fff" -> The second process overrides the first color

    // With placeholder:
    // 1. "Some string with {new_color_0} and #000"
    // 2. "Some string with {new_color_0} and {new_color_1}"
    // 3. "Some string with #000 and {new_color_1}"
    // 4. "Some string with #000 and #fff"

    Object.keys(color_table_old_new).map((current_color, index) => {
        const color_placeholder = get_new_color_id(index)
        string = replace_all_occurences_in_string(string, current_color, color_placeholder);
    })

    Object.keys(color_table_old_new).map((current_color, index) => {
        const color_placeholder = get_new_color_id(index)
        const new_color = color_table_old_new[current_color]
        string = replace_all_occurences_in_string(string, color_placeholder, new_color);
    })

    return string;

    function get_new_color_id(index){
        return '{{{new_color_' + index + '}}}'
    }
}