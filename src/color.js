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
      this.r = parseInt(match[1])
      this.g = parseInt(match[2])
      this.b = parseInt(match[3])
      
    } else if (SVG.regex.isHex.test(color)) {
      /* get hex values */
      match = SVG.regex.hex.exec(this._fullHex(color))

      /* parse numeric values */
      this.r = parseInt(match[1], 16)
      this.g = parseInt(match[2], 16)
      this.b = parseInt(match[3], 16)

    }
    
  } else if (typeof color == 'object') {
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
}

// Test if given value is a rgb object
SVG.Color.isRgb = function(color) {
  return color && typeof color.r == 'number'
}