import {Doc, Point, Element} from './classes.js'
import {adopt, eid, makeNode} from './tools.js'
import {dots, reference} from './regex.js'

export function makeInstance (element, makeNested) {
  if (element instanceof Element) return element

  if (typeof element === 'object') {
    return adopt(element)
  }

  if (element == null) {
    return new Doc()
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return adopt(document.querySelector(element))
  }

  var node = makeNode('svg')
  node.innerHTML = element

  element = adopt(node.firstElementChild)

  return element
}

export function isNulledBox (box) {
  return !box.w && !box.h && !box.x && !box.y
}

export function domContains (node) {
  return (document.documentElement.contains || function (node) {
    // This is IE - it does not support contains() for top-level SVGs
    while (node.parentNode) {
      node = node.parentNode
    }
    return node === document
  }).call(document.documentElement, node)
}

export function pathRegReplace (a, b, c, d) {
  return c + d.replace(dots, ' .')
}

// creates deep clone of array
export function arrayClone (arr) {
  var clone = arr.slice(0)
  for (var i = clone.length; i--;) {
    if (Array.isArray(clone[i])) {
      clone[i] = arrayClone(clone[i])
    }
  }
  return clone
}

// tests if a given selector matches an element
export function matches (el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
}

// Convert dash-separated-string to camelCase
export function camelCase (s) {
  return s.toLowerCase().replace(/-(.)/g, function (m, g) {
    return g.toUpperCase()
  })
}

// Capitalize first letter of a string
export function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Ensure to six-based hex
export function fullHex (hex) {
  return hex.length === 4
    ? [ '#',
      hex.substring(1, 2), hex.substring(1, 2),
      hex.substring(2, 3), hex.substring(2, 3),
      hex.substring(3, 4), hex.substring(3, 4)
    ].join('')
    : hex
}

// Component to hex value
export function compToHex (comp) {
  var hex = comp.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

// Calculate proportional width and height values when necessary
export function proportionalSize (element, width, height) {
  if (width == null || height == null) {
    var box = element.bbox()

    if (width == null) {
      width = box.width / box.height * height
    } else if (height == null) {
      height = box.height / box.width * width
    }
  }

  return {
    width: width,
    height: height
  }
}

// Map matrix array to object
export function arrayToMatrix (a) {
  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
}

// Add centre point to transform object
export function ensureCentre (o, target) {
  o.cx = o.cx == null ? target.bbox().cx : o.cx
  o.cy = o.cy == null ? target.bbox().cy : o.cy
}

// PathArray Helpers
export function arrayToString (a) {
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

// Deep new id assignment
export function assignNewId (node) {
  // do the same for SVG child nodes as well
  for (var i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i])
  }

  if (node.id) {
    return adopt(node).id(eid(node.nodeName))
  }

  return adopt(node)
}

// Add more bounding box properties
export function fullBox (b) {
  if (b.x == null) {
    b.x = 0
    b.y = 0
    b.width = 0
    b.height = 0
  }

  b.w = b.width
  b.h = b.height
  b.x2 = b.x + b.width
  b.y2 = b.y + b.height
  b.cx = b.x + b.width / 2
  b.cy = b.y + b.height / 2

  return b
}

// Get id from reference string
export function idFromReference (url) {
  var m = (url || '').toString().match(reference)

  if (m) return m[1]
}

// Create matrix array for looping
export let abcdef = 'abcdef'.split('')

export function closeEnough (a, b, threshold) {
  return Math.abs(b - a) < (threshold || 1e-6)
}

export function isMatrixLike (o) {
  return (
    o.a != null ||
    o.b != null ||
    o.c != null ||
    o.d != null ||
    o.e != null ||
    o.f != null
  )
}

// TODO: Refactor this to a static function of matrix.js
export function formatTransforms (o) {
  // Get all of the parameters required to form the matrix
  var flipBoth = o.flip === 'both' || o.flip === true
  var flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1
  var flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1
  var skewX = o.skew && o.skew.length ? o.skew[0]
    : isFinite(o.skew) ? o.skew
    : isFinite(o.skewX) ? o.skewX
    : 0
  var skewY = o.skew && o.skew.length ? o.skew[1]
    : isFinite(o.skew) ? o.skew
    : isFinite(o.skewY) ? o.skewY
    : 0
  var scaleX = o.scale && o.scale.length ? o.scale[0] * flipX
    : isFinite(o.scale) ? o.scale * flipX
    : isFinite(o.scaleX) ? o.scaleX * flipX
    : flipX
  var scaleY = o.scale && o.scale.length ? o.scale[1] * flipY
    : isFinite(o.scale) ? o.scale * flipY
    : isFinite(o.scaleY) ? o.scaleY * flipY
    : flipY
  var shear = o.shear || 0
  var theta = o.rotate || o.theta || 0
  var origin = new Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY)
  var ox = origin.x
  var oy = origin.y
  var position = new Point(o.position || o.px || o.positionX, o.py || o.positionY)
  var px = position.x
  var py = position.y
  var translate = new Point(o.translate || o.tx || o.translateX, o.ty || o.translateY)
  var tx = translate.x
  var ty = translate.y
  var relative = new Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY)
  var rx = relative.x
  var ry = relative.y

  // Populate all of the values
  return {
    scaleX, scaleY, skewX, skewY, shear, theta, rx, ry, tx, ty, ox, oy, px, py
  }
}

// left matrix, right matrix, target matrix which is overwritten
export function matrixMultiply (l, r, o) {
  // Work out the product directly
  var a = l.a * r.a + l.c * r.b
  var b = l.b * r.a + l.d * r.b
  var c = l.a * r.c + l.c * r.d
  var d = l.b * r.c + l.d * r.d
  var e = l.e + l.a * r.e + l.c * r.f
  var f = l.f + l.b * r.e + l.d * r.f

  // make sure to use local variables because l/r and o could be the same
  o.a = a
  o.b = b
  o.c = c
  o.d = d
  o.e = e
  o.f = f

  return o
}

export function getOrigin (o, element) {
  // Allow origin or around as the names
  let origin = o.origin // o.around == null ? o.origin : o.around
  let ox, oy

  // Allow the user to pass a string to rotate around a given point
  if (typeof origin === 'string' || origin == null) {
    // Get the bounding box of the element with no transformations applied
    const string = (origin || 'center').toLowerCase().trim()
    const { height, width, x, y } = element.bbox()

    // Calculate the transformed x and y coordinates
    let bx = string.includes('left') ? x
      : string.includes('right') ? x + width
      : x + width / 2
    let by = string.includes('top') ? y
      : string.includes('bottom') ? y + height
      : y + height / 2

    // Set the bounds eg : "bottom-left", "Top right", "middle" etc...
    ox = o.ox != null ? o.ox : bx
    oy = o.oy != null ? o.oy : by
  } else {
    ox = origin[0]
    oy = origin[1]
  }

  // Return the origin as it is if it wasn't a string
  return [ ox, oy ]
}
