// Convert dash-separated-string to camelCase
function camelCase(s) { 
  return s.toLowerCase().replace(/-(.)/g, function(m, g) {
    return g.toUpperCase()
  })
}

// Ensure to six-based hex 
function fullHex(hex) {
  return hex.length == 4 ?
    [ '#',
      hex.substring(1, 2), hex.substring(1, 2)
    , hex.substring(2, 3), hex.substring(2, 3)
    , hex.substring(3, 4), hex.substring(3, 4)
    ].join('') : hex
}

// Component to hex value
function compToHex(comp) {
  var hex = comp.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

// Calculate proportional width and height values when necessary
function proportionalSize(box, width, height) {
  if (width == null || height == null) {
    if (height == null)
      height = box.height / box.width * width
    else if (width == null)
      width = box.width / box.height * height
  }
  
  return {
    width:  width
  , height: height
  }
}

// Calculate position according to from and to
function at(o, pos) {
  /* number recalculation (don't bother converting to SVG.Number for performance reasons) */
  return typeof o.from == 'number' ?
    o.from + (o.to - o.from) * pos :
  
  /* instance recalculation */
  o instanceof SVG.Color || o instanceof SVG.Number ? o.at(pos) :
  
  /* for all other values wait until pos has reached 1 to return the final value */
  pos < 1 ? o.from : o.to
}

// PathArray Helpers
function arrayToString(a) {
  for (var i = 0, il = a.length, s = ''; i < il; i++) {
    s += a[i][0]

    if (a[i][1] != null) {
      s += a[i][1]

      if (a[i][2] != null) {
        s += ' '
        s += a[i][2]

        if (a[i][3] != null) {
          s += ' '
          s += a[i][3]
          s += ' '
          s += a[i][4]

          if (a[i][5] != null) {
            s += ' '
            s += a[i][5]
            s += ' '
            s += a[i][6]

            if (a[i][7] != null) {
              s += ' '
              s += a[i][7]
            }
          }
        }
      }
    }
  }
  
  return s + ' '
}

// Add more bounding box properties
function boxProperties(b) {
  b.x2 = b.x + b.width
  b.y2 = b.y + b.height
  b.cx = b.x + b.width / 2
  b.cy = b.y + b.height / 2
}

// Parse a matrix string
function parseMatrix(o) {
  if (o.matrix) {
    /* split matrix string */
    var m = o.matrix.replace(/\s/g, '').split(',')
    
    /* pasrse values */
    if (m.length == 6) {
      o.a = parseFloat(m[0])
      o.b = parseFloat(m[1])
      o.c = parseFloat(m[2])
      o.d = parseFloat(m[3])
      o.e = parseFloat(m[4])
      o.f = parseFloat(m[5])
    }
  }
  
  return o
}

// Get id from reference string
function idFromReference(url) {
  var m = url.toString().match(SVG.regex.reference)

  if (m) return m[1]
}

// Shim layer with setTimeout fallback by Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.msRequestAnimationFrame     ||
          function (c) { window.setTimeout(c, 1000 / 60) }
})()