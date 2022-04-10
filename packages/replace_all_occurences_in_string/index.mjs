export default function replace_all_occurences_in_string(string, string_to_replace, string_replacement = '') {
  return string.split(string_to_replace).join(string_replacement);
}