// Shown: RGB to hex
// Tags: conversion, converter, color mode, hexadecimal
// Alternative: convert_from_RGB_to_hex

export default function rgb_to_hex(RGB_object) {
    // From https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	const r = RGB_object.r ?? 0;
	const g = RGB_object.g ?? 0;
	const b = RGB_object.b ?? 0;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}