export default function map_range(value, low_from, high_from, low_to, high_to) {
    // Adjusted from https://stackoverflow.com/questions/5649803/remap-or-map-function-in-javascript
    return low_to + (high_to - low_to) * (value - low_from) / (high_from - low_from);
}