export default function rgb_to_hsl(rgb_object) {
  // Adapted from https://gist.github.com/xenozauros/f6e185c8de2a04cdfecf
    let r = rgb_object.r
    let g = rgb_object.g
    let b = rgb_object.b
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l
  }
}