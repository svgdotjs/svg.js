import {
  delimiter,
  dots,
  hyphen,
  isPathLetter,
  numbersWithDots,
  pathLetters
} from '../modules/core/regex.js'
import { extend } from '../utils/adopter.js'
import { subClassArray } from './ArrayPolyfill.js'
import Point from './Point.js'
import SVGArray from './SVGArray.js'
import parser from '../modules/core/parser.js'

const PathArray = subClassArray('PathArray', SVGArray)

export default PathArray

export function pathRegReplace (a, b, c, d) {
  return c + d.replace(dots, ' .')
}

function arrayToString (a) {
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

const pathHandlers = {
  M: function (c, p, p0) {
    p.x = p0.x = c[0]
    p.y = p0.y = c[1]

    return [ 'M', p.x, p.y ]
  },
  L: function (c, p) {
    p.x = c[0]
    p.y = c[1]
    return [ 'L', c[0], c[1] ]
  },
  H: function (c, p) {
    p.x = c[0]
    return [ 'H', c[0] ]
  },
  V: function (c, p) {
    p.y = c[0]
    return [ 'V', c[0] ]
  },
  C: function (c, p) {
    p.x = c[4]
    p.y = c[5]
    return [ 'C', c[0], c[1], c[2], c[3], c[4], c[5] ]
  },
  S: function (c, p) {
    p.x = c[2]
    p.y = c[3]
    return [ 'S', c[0], c[1], c[2], c[3] ]
  },
  Q: function (c, p) {
    p.x = c[2]
    p.y = c[3]
    return [ 'Q', c[0], c[1], c[2], c[3] ]
  },
  T: function (c, p) {
    p.x = c[0]
    p.y = c[1]
    return [ 'T', c[0], c[1] ]
  },
  Z: function (c, p, p0) {
    p.x = p0.x
    p.y = p0.y
    return [ 'Z' ]
  },
  A: function (c, p) {
    p.x = c[5]
    p.y = c[6]
    return [ 'A', c[0], c[1], c[2], c[3], c[4], c[5], c[6] ]
  }
}

const mlhvqtcsaz = 'mlhvqtcsaz'.split('')

for (var i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
  pathHandlers[mlhvqtcsaz[i]] = (function (i) {
    return function (c, p, p0) {
      if (i === 'H') c[0] = c[0] + p.x
      else if (i === 'V') c[0] = c[0] + p.y
      else if (i === 'A') {
        c[5] = c[5] + p.x
        c[6] = c[6] + p.y
      } else {
        for (var j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j % 2 ? p.y : p.x)
        }
      }

      return pathHandlers[i](c, p, p0)
    }
  })(mlhvqtcsaz[i].toUpperCase())
}

extend(PathArray, {
  // Convert array to string
  toString () {
    return arrayToString(this)
  },

  // Move path string
  move (x, y) {
    // get bounding box of current situation
    var box = this.bbox()

    // get relative offset
    x -= box.x
    y -= box.y

    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (var l, i = this.length - 1; i >= 0; i--) {
        l = this[i][0]

        if (l === 'M' || l === 'L' || l === 'T') {
          this[i][1] += x
          this[i][2] += y
        } else if (l === 'H') {
          this[i][1] += x
        } else if (l === 'V') {
          this[i][1] += y
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this[i][1] += x
          this[i][2] += y
          this[i][3] += x
          this[i][4] += y

          if (l === 'C') {
            this[i][5] += x
            this[i][6] += y
          }
        } else if (l === 'A') {
          this[i][6] += x
          this[i][7] += y
        }
      }
    }

    return this
  },

  // Resize path string
  size (width, height) {
    // get bounding box of current situation
    var box = this.bbox()
    var i, l

    // If the box width or height is 0 then we ignore
    // transformations on the respective axis
    box.width = box.width === 0 ? 1 : box.width
    box.height = box.height === 0 ? 1 : box.height

    // recalculate position of all points according to new size
    for (i = this.length - 1; i >= 0; i--) {
      l = this[i][0]

      if (l === 'M' || l === 'L' || l === 'T') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x
        this[i][2] = ((this[i][2] - box.y) * height) / box.height + box.y
      } else if (l === 'H') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x
      } else if (l === 'V') {
        this[i][1] = ((this[i][1] - box.y) * height) / box.height + box.y
      } else if (l === 'C' || l === 'S' || l === 'Q') {
        this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x
        this[i][2] = ((this[i][2] - box.y) * height) / box.height + box.y
        this[i][3] = ((this[i][3] - box.x) * width) / box.width + box.x
        this[i][4] = ((this[i][4] - box.y) * height) / box.height + box.y

        if (l === 'C') {
          this[i][5] = ((this[i][5] - box.x) * width) / box.width + box.x
          this[i][6] = ((this[i][6] - box.y) * height) / box.height + box.y
        }
      } else if (l === 'A') {
        // resize radii
        this[i][1] = (this[i][1] * width) / box.width
        this[i][2] = (this[i][2] * height) / box.height

        // move position values
        this[i][6] = ((this[i][6] - box.x) * width) / box.width + box.x
        this[i][7] = ((this[i][7] - box.y) * height) / box.height + box.y
      }
    }

    return this
  },

  // Test if the passed path array use the same path data commands as this path array
  equalCommands (pathArray) {
    var i, il, equalCommands

    pathArray = new PathArray(pathArray)

    equalCommands = this.length === pathArray.length
    for (i = 0, il = this.length; equalCommands && i < il; i++) {
      equalCommands = this[i][0] === pathArray[i][0]
    }

    return equalCommands
  },

  // Make path array morphable
  morph (pathArray) {
    pathArray = new PathArray(pathArray)

    if (this.equalCommands(pathArray)) {
      this.destination = pathArray
    } else {
      this.destination = null
    }

    return this
  },

  // Get morphed path array at given position
  at (pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    var sourceArray = this
    var destinationArray = this.destination.value
    var array = []
    var pathArray = new PathArray()
    var i, il, j, jl

    // Animate has specified in the SVG spec
    // See: https://www.w3.org/TR/SVG11/paths.html#PathElement
    for (i = 0, il = sourceArray.length; i < il; i++) {
      array[i] = [ sourceArray[i][0] ]
      for (j = 1, jl = sourceArray[i].length; j < jl; j++) {
        array[i][j] = sourceArray[i][j] + (destinationArray[i][j] - sourceArray[i][j]) * pos
      }
      // For the two flags of the elliptical arc command, the SVG spec say:
      // Flags and booleans are interpolated as fractions between zero and one, with any non-zero value considered to be a value of one/true
      // Elliptical arc command as an array followed by corresponding indexes:
      // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
      //   0    1   2        3                 4             5      6  7
      if (array[i][0] === 'A') {
        array[i][4] = +(array[i][4] !== 0)
        array[i][5] = +(array[i][5] !== 0)
      }
    }

    // Directly modify the value of a path array, this is done this way for performance
    pathArray.value = array
    return pathArray
  },

  // Absolutize and parse path to array
  parse (array = [ [ 'M', 0, 0 ] ]) {
    // if it's already a patharray, no need to parse it
    if (array instanceof PathArray) return array

    // prepare for parsing
    var s
    var paramCnt = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 }

    if (typeof array === 'string') {
      array = array
        .replace(numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
        .replace(pathLetters, ' $& ') // put some room between letters and numbers
        .replace(hyphen, '$1 -') // add space before hyphen
        .trim() // trim
        .split(delimiter) // split into array
    } else {
      array = array.reduce(function (prev, curr) {
        return [].concat.call(prev, curr)
      }, [])
    }

    // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]
    var result = []
    var p = new Point()
    var p0 = new Point()
    var index = 0
    var len = array.length

    do {
      // Test if we have a path letter
      if (isPathLetter.test(array[index])) {
        s = array[index]
        ++index
        // If last letter was a move command and we got no new, it defaults to [L]ine
      } else if (s === 'M') {
        s = 'L'
      } else if (s === 'm') {
        s = 'l'
      }

      result.push(pathHandlers[s].call(null,
        array.slice(index, (index = index + paramCnt[s.toUpperCase()])).map(parseFloat),
        p, p0
      )
      )
    } while (len > index)

    return result
  },

  // Get bounding box of path
  bbox () {
    parser().path.setAttribute('d', this.toString())
    return parser.nodes.path.getBBox()
  }
})
