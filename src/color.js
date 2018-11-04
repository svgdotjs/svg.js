// Module for color convertions
SVG.Color = function(color) {
  var match
  
  // initialize defaults 
  this.r = 0
  this.g = 0
  this.b = 0
  
  if(!color) return
  
  // parse color 
  if (typeof color === 'string') {
    if (SVG.regex.isRgb.test(color)) {
      // get rgb values 
      match = SVG.regex.rgb.exec(color.replace(SVG.regex.whitespace,''))
      
      // parse numeric values 
      this.r = parseInt(match[1])
      this.g = parseInt(match[2])
      this.b = parseInt(match[3])
      
    } else if (SVG.regex.isHex.test(color)) {
      // get hex values 
      match = SVG.regex.hex.exec(fullHex(color))

      // parse numeric values 
      this.r = parseInt(match[1], 16)
      this.g = parseInt(match[2], 16)
      this.b = parseInt(match[3], 16)

    }
    
  } else if (typeof color === 'object') {
    this.r = color.r
    this.g = color.g
    this.b = color.b
    
  }
    
}

SVG.extend(SVG.Color, {
  // Default to hex conversion
  toString: function() {
    return this.toHex()
  }
  // Build hex value
, toHex: function() {
    return '#'
      + compToHex(this.r)
      + compToHex(this.g)
      + compToHex(this.b)
  }
  //Build rgb value from lch
, lchToRgb: function(l, c, h){
        h = h * Math.PI / 180;
        var rgb = thi.labToRgb(l,Math.cos(h) * c,Math.sin(h) * c);
        return 'rgb(' + [Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])].join() + ')';
    }
  //Build rgb value from lab
, labToRgb: function(l, a, b){
        var y = (l + 16) / 116,
            x = a / 500 + y,
            z = y - b / 200,
            r, g, b;

        x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
        y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
        z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);

        r = x *  3.2406 + y * -1.5372 + z * -0.4986;
        g = x * -0.9689 + y *  1.8758 + z *  0.0415;
        b = x *  0.0557 + y * -0.2040 + z *  1.0570;

        r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
        g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
        b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;

        return 'rgb(' +[Math.round(Math.max(0, Math.min(1, r)) * 255),
            Math.round(Math.max(0, Math.min(1, g)) * 255),
            Math.round(Math.max(0, Math.min(1, b)) * 255)].join() + ')'
    }
  //Build lab value
, toLab: function(){
        var r = this.r / 255,
            g = this.g / 255,
            b = this.b / 255,
            x, y, z;

        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

        x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
        y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
        z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

        return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
    }
    //Build lch value
, toLch: function(){
      var lab = this.toLab();
      var l = lab[0];
      var a = lab[1];
      var b = lab[2];

      var c = Math.sqrt(a * a + b * b);
      var h = Math.atan2(b, a) / Math.PI * 180;

      if (h < 0 ){
          h = h *(-1);
          h = 360 - h;
      }
        return [l,c,h];
    }
  // Build rgb value
, toRgb: function() {
    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
  }
  // Calculate true brightness
, brightness: function() {
    return (this.r / 255 * 0.30)
         + (this.g / 255 * 0.59)
         + (this.b / 255 * 0.11)
  }
  // Make color morphable
, morph: function(color) {
    this.destination = new SVG.Color(color)

    return this
  }
  // Get morphed color at given position
, at: function(pos) {
    // make sure a destination is defined 
    if (!this.destination) return this

    // normalise pos 
    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

    // generate morphed color 
    return new SVG.Color({
      r: ~~(this.r + (this.destination.r - this.r) * pos)
    , g: ~~(this.g + (this.destination.g - this.g) * pos)
    , b: ~~(this.b + (this.destination.b - this.b) * pos)
    })
  }
  
})

// Testers

// Test if given value is a color string
SVG.Color.test = function(color) {
  color += ''
  return SVG.regex.isHex.test(color)
      || SVG.regex.isRgb.test(color)
}

// Test if given value is a rgb object
SVG.Color.isRgb = function(color) {
  return color && typeof color.r == 'number'
               && typeof color.g == 'number'
               && typeof color.b == 'number'
}

// Test if given value is a color
SVG.Color.isColor = function(color) {
  return SVG.Color.isRgb(color) || SVG.Color.test(color)
}