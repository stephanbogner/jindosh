// Alternative: merge_class_names
export default function merge_class_names(...classes) {
  // From https://tailwindui.com/
  return classes.filter(Boolean).join(' ')
}