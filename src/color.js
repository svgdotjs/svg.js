// Module for color convertions
SVG.Color = function(color) {
  var match
  
  /* initialize defaults */
  this.r = 0
  this.g = 0
  this.b = 0
  
  /* parse color */
  if (typeof color == 'string') {
    if (SVG.regex.isRgb.test(color)) {
      /* get rgb values */
      match = SVG.regex.rgb.exec(color.replace(/\s/g,''))
      
      /* parse numeric values */
      this.r = parseInt(m[1])
      this.g = parseInt(m[2])
      this.b = parseInt(m[3])
      
    } else if (SVG.regex.isHex.test(color)) {
      /* get hex values */
      match = SVG.regex.hex.exec(this._fullHex(color))

      /* parse numeric values */
      this.r = parseInt(match[1], 16)
      this.g = parseInt(match[2], 16)
      this.b = parseInt(match[3], 16)
    
    } else if (SVG.regex.isHsb.test(color)) {
      /* get hsb values */
      match = SVG.regex.hsb.exec(color.replace(/\s/g,''))
      
      /* convert hsb to rgb */
      color = this._hsbToRgb(match[1], match[2], match[3])
    }
    
  } else if (typeof color == 'object') {
    if (SVG.Color.isHsb(color))
      color = this._hsbToRgb(color.h, color.s, color.b)
    
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
      + this._compToHex(this.r)
      + this._compToHex(this.g)
      + this._compToHex(this.b)
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
  // Private: convert hsb to rgb
, _hsbToRgb: function(h, s, v) {
    var vs, vsf
    
    /* process hue */
    h = parseInt(h) % 360
    if (h < 0) h += 360
    
    /* process saturation */
    s = parseInt(s)
    s = s > 100 ? 100 : s
    
    /* process brightness */
    v = parseInt(v)
    v = (v < 0 ? 0 : v > 100 ? 100 : v) * 255 / 100
    
    /* compile rgb */
    vs = v * s / 100
    vsf = (vs * ((h * 256 / 60) % 256)) / 256
    
    switch (Math.floor(h / 60)) {
      case 0:
        r = v
        g = v - vs + vsf
        b = v - vs
      break
      case 1:
        r = v - vsf
        g = v
        b = v - vs
      break
      case 2:
        r = v - vs
        g = v
        b = v - vs + vsf
      break
      case 3:
        r = v - vs
        g = v - vsf
        b = v
      break
      case 4:
        r = v - vs + vsf
        g = v - vs
        b = v
      break
      case 5:
        r = v
        g = v - vs
        b = v - vsf
      break
    }
    
    /* parse values */
    return {
      r: Math.floor(r + 0.5)
    , g: Math.floor(g + 0.5)
    , b: Math.floor(b + 0.5)
    }
  }
  // Private: ensure to six-based hex 
, _fullHex: function(hex) {
    return hex.length == 4 ?
      [ '#',
        hex.substring(1, 2), hex.substring(1, 2)
      , hex.substring(2, 3), hex.substring(2, 3)
      , hex.substring(3, 4), hex.substring(3, 4)
      ].join('') : hex
  }
  // Private: component to hex value
, _compToHex: function(comp) {
    var hex = comp.toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }
  
})

// Test if given value is a color string
SVG.Color.test = function(color) {
  color += ''
  return SVG.regex.isHex.test(color)
      || SVG.regex.isRgb.test(color)
      || SVG.regex.isHsb.test(color)
}

// Test if given value is a rgb object
SVG.Color.isRgb = function(color) {
  return color && typeof color.r == 'number'
}

// Test if given value is a hsb object
SVG.Color.isHsb = function(color) {
  return color && typeof color.h == 'number'
}