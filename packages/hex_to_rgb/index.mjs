export default function hex_to_rgb(hex) {
    // From https://www.tutorialspoint.com/hexadecimal-color-to-rgb-color-javascript
   let r = 0, g = 0, b = 0

   if(hex.length == 4){
      // handling 3 digit hex
      r = "0x" + hex[1] + hex[1]
      g = "0x" + hex[2] + hex[2]
      b = "0x" + hex[3] + hex[3]
   }else if (hex.length == 7){
      // handling 6 digit hex
      r = "0x" + hex[1] + hex[2]
      g = "0x" + hex[3] + hex[4]
      b = "0x" + hex[5] + hex[6]
   }

   return{
      r: +r,
      g: +g,
      b: +b
   }
}