/*!
* svg.js - A lightweight library for manipulating and animating SVG.
* @version 3.0.0
* https://svgdotjs.github.io/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Thu Jun 28 2018 22:52:04 GMT+0200 (GMT+02:00)
*/;

(function(root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(function(){
      return factory(root, root.document)
    })
  } else if (typeof exports === 'object') {
    module.exports = root.document ? factory(root, root.document) : function(w){ return factory(w, w.document) }
  } else {
    root.SVG = factory(root, root.document)
  }
}(typeof window !== "undefined" ? window : this, function(window, document) {

// Check that our browser supports svg
var supported = !! document.createElementNS &&
  !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect

// If we don't support svg, just exit without doing anything
if (!supported)
  return {supported: false}

// Otherwise, the library will be here
/* global createElement, capitalize */
/* eslint-disable new-cap */

// The main wrapping element
var SVG = this.SVG = function (element) {
  if (SVG.supported) {
    element = createElement(element)
    return element
  }
}

// Svg must be supported if we reached this stage
SVG.supported = true

// Default namespaces
SVG.ns = 'http://www.w3.org/2000/svg'
SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
SVG.xlink = 'http://www.w3.org/1999/xlink'
SVG.svgjs = 'http://svgjs.com/svgjs'

// Element id sequence
SVG.did = 1000

// Get next named element id
SVG.eid = function (name) {
  return 'Svgjs' + capitalize(name) + (SVG.did++)
}

// Method for element creation
SVG.create = function (name) {
  // create element
  return document.createElementNS(this.ns, name)
}

// Method for extending objects
SVG.extend = function (modules, methods) {
  var key, i

  modules = Array.isArray(modules) ? modules : [modules]

  for (i = modules.length - 1; i >= 0; i--) {
    if (modules[i]) {
      for (key in methods) {
        modules[i].prototype[key] = methods[key]
      }
    }
  }
}

// Invent new element
SVG.invent = function (config) {
  // Create element initializer
  var initializer = typeof config.create === 'function' ? config.create
    : function (node) {
      config.inherit.call(this, node || SVG.create(config.create))
    }

  // Inherit prototype
  if (config.inherit) {
    initializer.prototype = new config.inherit()
    initializer.prototype.constructor = initializer
  }

  // Extend with methods
  if (config.extend) {
    SVG.extend(initializer, config.extend)
  }

  // Attach construct method to parent
  if (config.construct) { SVG.extend(config.parent || SVG.Container, config.construct) }

  return initializer
}

// Adopt existing svg elements
SVG.adopt = function (node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance instanceof SVG.Element) return node.instance

  if (!(node instanceof window.SVGElement)) {
    return new SVG.HtmlNode(node)
  }

  // initialize variables
  var element

  // adopt with element-specific settings
  if (node.nodeName === 'svg') {
    element = new SVG.Doc(node)
  } else if (node.nodeName === 'linearGradient' || node.nodeName === 'radialGradient') {
    element = new SVG.Gradient(node)
  } else if (SVG[capitalize(node.nodeName)]) {
    element = new SVG[capitalize(node.nodeName)](node)
  } else {
    element = new SVG.Parent(node)
  }

  return element
}

// Storage for regular expressions
SVG.regex = {
  // Parse unit value
  numberAndUnit: /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i,

  // Parse hex value
  hex: /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,

  // Parse rgb value
  rgb: /rgb\((\d+),(\d+),(\d+)\)/,

  // Parse reference id
  reference: /#([a-z0-9\-_]+)/i,

  // splits a transformation chain
  transforms: /\)\s*,?\s*/,

  // Whitespace
  whitespace: /\s/g,

  // Test hex value
  isHex: /^#[a-f0-9]{3,6}$/i,

  // Test rgb value
  isRgb: /^rgb\(/,

  // Test css declaration
  isCss: /[^:]+:[^;]+;?/,

  // Test for blank string
  isBlank: /^(\s+)?$/,

  // Test for numeric string
  isNumber: /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

  // Test for percent value
  isPercent: /^-?[\d.]+%$/,

  // Test for image url
  isImage: /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i,

  // split at whitespace and comma
  delimiter: /[\s,]+/,

  // The following regex are used to parse the d attribute of a path

  // Matches all hyphens which are not after an exponent
  hyphen: /([^e])-/gi,

  // Replaces and tests for all path letters
  pathLetters: /[MLHVCSQTAZ]/gi,

  // yes we need this one, too
  isPathLetter: /[MLHVCSQTAZ]/i,

  // matches 0.154.23.45
  numbersWithDots: /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi,

  // matches .
  dots: /\./g
}


SVG.utils = {
  // Map function
  map: function (array, block) {
    var i
    var il = array.length
    var result = []

    for (i = 0; i < il; i++) {
      result.push(block(array[i]))
    }

    return result
  },

  // Filter function
  filter: function (array, block) {
    var i
    var il = array.length
    var result = []

    for (i = 0; i < il; i++) {
      if (block(array[i])) { result.push(array[i]) }
    }

    return result
  },

  // Degrees to radians
  radians: function (d) {
    return d % 360 * Math.PI / 180
  },

  // Radians to degrees
  degrees: function (r) {
    return r * 180 / Math.PI % 360
  },

  filterSVGElements: function (nodes) {
    return this.filter(nodes, function (el) { return el instanceof window.SVGElement })
  }

}


SVG.void = function () {}

SVG.defaults = {

  // Default animation values
  timeline: {
    duration: 400,
    ease: '>',
    delay: 0
  },

  // Default attribute values
  attrs: {

    // fill and stroke
    'fill-opacity': 1,
    'stroke-opacity': 1,
    'stroke-width': 0,
    'stroke-linejoin': 'miter',
    'stroke-linecap': 'butt',
    fill: '#000000',
    stroke: '#000000',
    opacity: 1,

    // position
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,

    // size
    width: 0,
    height: 0,

    // radius
    r: 0,
    rx: 0,
    ry: 0,

    // gradient
    offset: 0,
    'stop-opacity': 1,
    'stop-color': '#000000',

    // text
    'font-size': 16,
    'font-family': 'Helvetica, Arial, sans-serif',
    'text-anchor': 'start'
  }
}

SVG.Queue = SVG.invent({
  create: function () {
    this._first = null
    this._last = null
  },

  extend: {
    push: function (value) {
      // An item stores an id and the provided value
      var item = value.next ? value : { value: value, next: null, prev: null }

      // Deal with the queue being empty or populated
      if (this._last) {
        item.prev = this._last
        this._last.next = item
        this._last = item
      } else {
        this._last = item
        this._first = item
      }

      // Update the length and return the current item
      return item
    },

    shift: function () {
      // Check if we have a value
      var remove = this._first
      if (!remove) return null

      // If we do, remove it and relink things
      this._first = remove.next
      if (this._first) this._first.prev = null
      this._last = this._first ? this._last : null
      return remove.value
    },

    // Shows us the first item in the list
    first: function () {
      return this._first && this._first.value
    },

    // Shows us the last item in the list
    last: function () {
      return this._last && this._last.value
    },

    // Removes the item that was returned from the push
    remove: function (item) {
      // Relink the previous item
      if (item.prev) item.prev.next = item.next
      if (item.next) item.next.prev = item.prev
      if (item === this._last) this._last = item.prev
      if (item === this._first) this._first = item.next

      // Invalidate item
      item.prev = null
      item.next = null
    }
  }
})

/* globals fullHex, compToHex */

/*

Color {
  constructor (a, b, c, space) {
    space: 'hsl'
    a: 30
    b: 20
    c: 10
  },

  toRgb () { return new Color in rgb space }
  toHsl () { return new Color in hsl space }
  toLab () { return new Color in lab space }

  toArray () { [space, a, b, c] }
  fromArray () { convert it back }
}

// Conversions aren't always exact because of monitor profiles etc...
new Color(h, s, l, 'hsl') !== new Color(r, g, b).hsl()
new Color(100, 100, 100, [space])
new Color('hsl(30, 20, 10)')

// Sugar
SVG.rgb(30, 20, 50).lab()
SVG.hsl()
SVG.lab('rgb(100, 100, 100)')
*/

// Module for color convertions
SVG.Color = function (color, g, b) {
  var match

  // initialize defaults
  this.r = 0
  this.g = 0
  this.b = 0

  if (!color) return

  // parse color
  if (typeof color === 'string') {
    if (SVG.regex.isRgb.test(color)) {
      // get rgb values
      match = SVG.regex.rgb.exec(color.replace(SVG.regex.whitespace, ''))

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
  } else if (Array.isArray(color)) {
    this.r = color[0]
    this.g = color[1]
    this.b = color[2]
  } else if (typeof color === 'object') {
    this.r = color.r
    this.g = color.g
    this.b = color.b
  } else if (arguments.length === 3) {
    this.r = color
    this.g = g
    this.b = b
  }
}

SVG.extend(SVG.Color, {
  // Default to hex conversion
  toString: function () {
    return this.toHex()
  },
  toArray: function () {
    return [this.r, this.g, this.b]
  },
  fromArray: function (a) {
    return new SVG.Color(a)
  },
  // Build hex value
  toHex: function () {
    return '#' +
      compToHex(Math.round(this.r)) +
      compToHex(Math.round(this.g)) +
      compToHex(Math.round(this.b))
  },
  // Build rgb value
  toRgb: function () {
    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
  },
  // Calculate true brightness
  brightness: function () {
    return (this.r / 255 * 0.30) +
      (this.g / 255 * 0.59) +
      (this.b / 255 * 0.11)
  },
  // Make color morphable
  morph: function (color) {
    this.destination = new SVG.Color(color)

    return this
  },
  // Get morphed color at given position
  at: function (pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // normalise pos
    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

    // generate morphed color
    return new SVG.Color({
      r: ~~(this.r + (this.destination.r - this.r) * pos),
      g: ~~(this.g + (this.destination.g - this.g) * pos),
      b: ~~(this.b + (this.destination.b - this.b) * pos)
    })
  }

})

// Testers

// Test if given value is a color string
SVG.Color.test = function (color) {
  color += ''
  return SVG.regex.isHex.test(color) ||
    SVG.regex.isRgb.test(color)
}

// Test if given value is a rgb object
SVG.Color.isRgb = function (color) {
  return color && typeof color.r === 'number' &&
    typeof color.g === 'number' &&
    typeof color.b === 'number'
}

// Test if given value is a color
SVG.Color.isColor = function (color) {
  return SVG.Color.isRgb(color) || SVG.Color.test(color)
}

/* global arrayClone */

// Module for array conversion
SVG.Array = function (array, fallback) {
  array = (array || []).valueOf()

  // if array is empty and fallback is provided, use fallback
  if (array.length === 0 && fallback) {
    array = fallback.valueOf()
  }

  // parse array
  this.value = this.parse(array)
}

SVG.extend(SVG.Array, {
  // Make array morphable
  morph: function (array) {
    this.destination = this.parse(array)

    // normalize length of arrays
    if (this.value.length !== this.destination.length) {
      var lastValue = this.value[this.value.length - 1]
      var lastDestination = this.destination[this.destination.length - 1]

      while (this.value.length > this.destination.length) {
        this.destination.push(lastDestination)
      }
      while (this.value.length < this.destination.length) {
        this.value.push(lastValue)
      }
    }

    return this
  },
  // Clean up any duplicate points
  settle: function () {
    // find all unique values
    for (var i = 0, il = this.value.length, seen = []; i < il; i++) {
      if (seen.indexOf(this.value[i]) === -1) {
        seen.push(this.value[i])
      }
    }

    // set new value
    this.value = seen
    return seen
  },
  // Get morphed array at given position
  at: function (pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // generate morphed array
    for (var i = 0, il = this.value.length, array = []; i < il; i++) {
      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)
    }

    return new SVG.Array(array)
  },
  toArray: function () {
    return this.value
  },
  // Convert array to string
  toString: function () {
    return this.value.join(' ')
  },
  // Real value
  valueOf: function () {
    return this.value
  },
  // Parse whitespace separated string
  parse: function (array) {
    array = array.valueOf()

    // if already is an array, no need to parse it
    if (Array.isArray(array)) return array

    return array.trim().split(SVG.regex.delimiter).map(parseFloat)
  },
  // Reverse array
  reverse: function () {
    this.value.reverse()

    return this
  },
  clone: function () {
    var clone = new this.constructor()
    clone.value = arrayClone(this.value)
    return clone
  }
})


// Poly points array
SVG.PointArray = function (array, fallback) {
  SVG.Array.call(this, array, fallback || [[0, 0]])
}

// Inherit from SVG.Array
SVG.PointArray.prototype = new SVG.Array()
SVG.PointArray.prototype.constructor = SVG.PointArray

SVG.extend(SVG.PointArray, {
  // Convert array to string
  toString: function () {
    // convert to a poly point string
    for (var i = 0, il = this.value.length, array = []; i < il; i++) {
      array.push(this.value[i].join(','))
    }

    return array.join(' ')
  },

  toArray: function () {
    return this.value.reduce(function (prev, curr) {
      return [].concat.call(prev, curr)
    }, [])
  },

  // Convert array to line object
  toLine: function () {
    return {
      x1: this.value[0][0],
      y1: this.value[0][1],
      x2: this.value[1][0],
      y2: this.value[1][1]
    }
  },

  // Get morphed array at given position
  at: function (pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // generate morphed point string
    for (var i = 0, il = this.value.length, array = []; i < il; i++) {
      array.push([
        this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos,
        this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
      ])
    }

    return new SVG.PointArray(array)
  },

  // Parse point string and flat array
  parse: function (array) {
    var points = []

    array = array.valueOf()

    // if it is an array
    if (Array.isArray(array)) {
      // and it is not flat, there is no need to parse it
      if (Array.isArray(array[0])) {
        return array
      }
    } else { // Else, it is considered as a string
      // parse points
      array = array.trim().split(SVG.regex.delimiter).map(parseFloat)
    }

    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
    if (array.length % 2 !== 0) array.pop()

    // wrap points in two-tuples and parse points as floats
    for (var i = 0, len = array.length; i < len; i = i + 2) {
      points.push([ array[i], array[i + 1] ])
    }

    return points
  },

  // Move point string
  move: function (x, y) {
    var box = this.bbox()

    // get relative offset
    x -= box.x
    y -= box.y

    // move every point
    if (!isNaN(x) && !isNaN(y)) {
      for (var i = this.value.length - 1; i >= 0; i--) {
        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]
      }
    }

    return this
  },
  // Resize poly string
  size: function (width, height) {
    var i
    var box = this.bbox()

    // recalculate position of all points according to new size
    for (i = this.value.length - 1; i >= 0; i--) {
      if (box.width) this.value[i][0] = ((this.value[i][0] - box.x) * width) / box.width + box.x
      if (box.height) this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
    }

    return this
  },

  // Get bounding box of points
  bbox: function () {
    var maxX = -Infinity
    var maxY = -Infinity
    var minX = Infinity
    var minY = Infinity
    this.value.forEach(function (el) {
      maxX = Math.max(el[0], maxX)
      maxY = Math.max(el[1], maxY)
      minX = Math.min(el[0], minX)
      minY = Math.min(el[1], minY)
    })
    return {x: minX, y: minY, width: maxX - minX, height: maxY - minY}
  }
})

/* globals arrayToString, pathRegReplace */

var pathHandlers = {
  M: function (c, p, p0) {
    p.x = p0.x = c[0]
    p.y = p0.y = c[1]

    return ['M', p.x, p.y]
  },
  L: function (c, p) {
    p.x = c[0]
    p.y = c[1]
    return ['L', c[0], c[1]]
  },
  H: function (c, p) {
    p.x = c[0]
    return ['H', c[0]]
  },
  V: function (c, p) {
    p.y = c[0]
    return ['V', c[0]]
  },
  C: function (c, p) {
    p.x = c[4]
    p.y = c[5]
    return ['C', c[0], c[1], c[2], c[3], c[4], c[5]]
  },
  S: function (c, p) {
    p.x = c[2]
    p.y = c[3]
    return ['S', c[0], c[1], c[2], c[3]]
  },
  Q: function (c, p) {
    p.x = c[2]
    p.y = c[3]
    return ['Q', c[0], c[1], c[2], c[3]]
  },
  T: function (c, p) {
    p.x = c[0]
    p.y = c[1]
    return ['T', c[0], c[1]]
  },
  Z: function (c, p, p0) {
    p.x = p0.x
    p.y = p0.y
    return ['Z']
  },
  A: function (c, p) {
    p.x = c[5]
    p.y = c[6]
    return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]]
  }
}

var mlhvqtcsaz = 'mlhvqtcsaz'.split('')

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

// Path points array
SVG.PathArray = function (array, fallback) {
  SVG.Array.call(this, array, fallback || [['M', 0, 0]])
}

// Inherit from SVG.Array
SVG.PathArray.prototype = new SVG.Array()
SVG.PathArray.prototype.constructor = SVG.PathArray

SVG.extend(SVG.PathArray, {
  // Convert array to string
  toString: function () {
    return arrayToString(this.value)
  },
  toArray: function () {
    return this.value.reduce(function (prev, curr) {
      return [].concat.call(prev, curr)
    }, [])
  },
  // Move path string
  move: function (x, y) {
    // get bounding box of current situation
    var box = this.bbox()

    // get relative offset
    x -= box.x
    y -= box.y

    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (var l, i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0]

        if (l === 'M' || l === 'L' || l === 'T') {
          this.value[i][1] += x
          this.value[i][2] += y
        } else if (l === 'H') {
          this.value[i][1] += x
        } else if (l === 'V') {
          this.value[i][1] += y
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this.value[i][1] += x
          this.value[i][2] += y
          this.value[i][3] += x
          this.value[i][4] += y

          if (l === 'C') {
            this.value[i][5] += x
            this.value[i][6] += y
          }
        } else if (l === 'A') {
          this.value[i][6] += x
          this.value[i][7] += y
        }
      }
    }

    return this
  },
  // Resize path string
  size: function (width, height) {
    // get bounding box of current situation
    var box = this.bbox()
    var i, l

    // recalculate position of all points according to new size
    for (i = this.value.length - 1; i >= 0; i--) {
      l = this.value[i][0]

      if (l === 'M' || l === 'L' || l === 'T') {
        this.value[i][1] = ((this.value[i][1] - box.x) * width) / box.width + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
      } else if (l === 'H') {
        this.value[i][1] = ((this.value[i][1] - box.x) * width) / box.width + box.x
      } else if (l === 'V') {
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
      } else if (l === 'C' || l === 'S' || l === 'Q') {
        this.value[i][1] = ((this.value[i][1] - box.x) * width) / box.width + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
        this.value[i][3] = ((this.value[i][3] - box.x) * width) / box.width + box.x
        this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y

        if (l === 'C') {
          this.value[i][5] = ((this.value[i][5] - box.x) * width) / box.width + box.x
          this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
        }
      } else if (l === 'A') {
        // resize radii
        this.value[i][1] = (this.value[i][1] * width) / box.width
        this.value[i][2] = (this.value[i][2] * height) / box.height

        // move position values
        this.value[i][6] = ((this.value[i][6] - box.x) * width) / box.width + box.x
        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
      }
    }

    return this
  },
  // Test if the passed path array use the same path data commands as this path array
  equalCommands: function (pathArray) {
    var i, il, equalCommands

    pathArray = new SVG.PathArray(pathArray)

    equalCommands = this.value.length === pathArray.value.length
    for (i = 0, il = this.value.length; equalCommands && i < il; i++) {
      equalCommands = this.value[i][0] === pathArray.value[i][0]
    }

    return equalCommands
  },
  // Make path array morphable
  morph: function (pathArray) {
    pathArray = new SVG.PathArray(pathArray)

    if (this.equalCommands(pathArray)) {
      this.destination = pathArray
    } else {
      this.destination = null
    }

    return this
  },
  // Get morphed path array at given position
  at: function (pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    var sourceArray = this.value
    var destinationArray = this.destination.value
    var array = []
    var pathArray = new SVG.PathArray()
    var i, il, j, jl

    // Animate has specified in the SVG spec
    // See: https://www.w3.org/TR/SVG11/paths.html#PathElement
    for (i = 0, il = sourceArray.length; i < il; i++) {
      array[i] = [sourceArray[i][0]]
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
  parse: function (array) {
    // if it's already a patharray, no need to parse it
    if (array instanceof SVG.PathArray) return array.valueOf()

    // prepare for parsing
    var s
    var paramCnt = { 'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0 }

    if (typeof array === 'string') {
      array = array
        .replace(SVG.regex.numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
        .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
        .replace(SVG.regex.hyphen, '$1 -')      // add space before hyphen
        .trim()                                 // trim
        .split(SVG.regex.delimiter)   // split into array
    } else {
      array = array.reduce(function (prev, curr) {
        return [].concat.call(prev, curr)
      }, [])
    }

    // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]
    var result = []
    var p = new SVG.Point()
    var p0 = new SVG.Point()
    var index = 0
    var len = array.length

    do {
      // Test if we have a path letter
      if (SVG.regex.isPathLetter.test(array[index])) {
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
  bbox: function () {
    SVG.parser().path.setAttribute('d', this.toString())
    return SVG.parser.nodes.path.getBBox()
  }

})


// Module for unit convertions
SVG.Number = SVG.invent({
  // Initialize
  create: function (value, unit) {
    unit = Array.isArray(value) ? value[1] : unit
    value = Array.isArray(value) ? value[0] : value

    // initialize defaults
    this.value = 0
    this.unit = unit || ''

    // parse value
    if (typeof value === 'number') {
      // ensure a valid numeric value
      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value
    } else if (typeof value === 'string') {
      unit = value.match(SVG.regex.numberAndUnit)

      if (unit) {
        // make value numeric
        this.value = parseFloat(unit[1])

        // normalize
        if (unit[5] === '%') { this.value /= 100 } else if (unit[5] === 's') {
          this.value *= 1000
        }

        // store unit
        this.unit = unit[5]
      }
    } else {
      if (value instanceof SVG.Number) {
        this.value = value.valueOf()
        this.unit = value.unit
      }
    }
  },
  // Add methods
  extend: {
    // Stringalize
    toString: function () {
      return (this.unit === '%' ? ~~(this.value * 1e8) / 1e6
        : this.unit === 's' ? this.value / 1e3
        : this.value
      ) + this.unit
    },
    toJSON: function () {
      return this.toString()
    },   // Convert to primitive
    toArray: function () {
      return [this.value, this.unit]
    },
    valueOf: function () {
      return this.value
    },
    // Add number
    plus: function (number) {
      number = new SVG.Number(number)
      return new SVG.Number(this + number, this.unit || number.unit)
    },
    // Subtract number
    minus: function (number) {
      number = new SVG.Number(number)
      return new SVG.Number(this - number, this.unit || number.unit)
    },
    // Multiply number
    times: function (number) {
      number = new SVG.Number(number)
      return new SVG.Number(this * number, this.unit || number.unit)
    },
    // Divide number
    divide: function (number) {
      number = new SVG.Number(number)
      return new SVG.Number(this / number, this.unit || number.unit)
    },
    // Convert to different unit
    to: function (unit) {
      var number = new SVG.Number(this)

      if (typeof unit === 'string') {
        number.unit = unit
      }

      return number
    },
    // Make number morphable
    morph: function (number) {
      this.destination = new SVG.Number(number)

      if (number.relative) {
        this.destination.value += this.value
      }

      return this
    },
    // Get morphed number at given position
    at: function (pos) {
      // Make sure a destination is defined
      if (!this.destination) return this

      // Generate new morphed number
      return new SVG.Number(this.destination)
          .minus(this)
          .times(pos)
          .plus(this)
    }
  }
})

// Add events to elements
/*
;[ 'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'touchstart',
  'touchmove',
  'touchleave',
  'touchend',
  'touchcancel' ].forEach(function (event) {
    // add event to SVG.Element
    SVG.Element.prototype[event] = function (f) {
    // bind event to element rather than element node
      SVG.on(this, event, f)
      return this
    }
  })
*/

SVG.listenerId = 0

// Add event binder in the SVG namespace
SVG.on = function (node, events, listener, binding, options) {
  var l = listener.bind(binding || node)
  var n = node instanceof SVG.EventTarget ? node.getEventTarget() : node

  // events can be an array of events or a string of events
  events = Array.isArray(events) ? events : events.split(SVG.regex.delimiter)

  // ensure instance object for nodes which are not adopted
  n.instance = n.instance || {events: {}}

  // pull event handlers from the element
  var bag = n.instance.events

  // add id to listener
  if (!listener._svgjsListenerId) {
    listener._svgjsListenerId = ++SVG.listenerId
  }

  events.forEach(function (event) {
    var ev = event.split('.')[0]
    var ns = event.split('.')[1] || '*'

    // ensure valid object
    bag[ev] = bag[ev] || {}
    bag[ev][ns] = bag[ev][ns] || {}

    // reference listener
    bag[ev][ns][listener._svgjsListenerId] = l

    // add listener
    n.addEventListener(ev, l, options || false)
  })
}

// Add event unbinder in the SVG namespace
SVG.off = function (node, events, listener, options) {
  var n = node instanceof SVG.EventTarget ? node.getEventTarget() : node
  if (!n.instance) return

  // listener can be a function or a number
  if (typeof listener === 'function') {
    listener = listener._svgjsListenerId
    if (!listener) return
  }

  // pull event handlers from the element
  var bag = n.instance.events

  // events can be an array of events or a string or undefined
  events = Array.isArray(events) ? events : (events || '').split(SVG.regex.delimiter)

  events.forEach(function (event) {
    var ev = event && event.split('.')[0]
    var ns = event && event.split('.')[1]
    var namespace, l

    if (listener) {
      // remove listener reference
      if (bag[ev] && bag[ev][ns || '*']) {
        // removeListener
        n.removeEventListener(ev, bag[ev][ns || '*'][listener], options || false)

        delete bag[ev][ns || '*'][listener]
      }
    } else if (ev && ns) {
      // remove all listeners for a namespaced event
      if (bag[ev] && bag[ev][ns]) {
        for (l in bag[ev][ns]) { SVG.off(n, [ev, ns].join('.'), l) }

        delete bag[ev][ns]
      }
    } else if (ns) {
      // remove all listeners for a specific namespace
      for (event in bag) {
        for (namespace in bag[event]) {
          if (ns === namespace) { SVG.off(n, [event, ns].join('.')) }
        }
      }
    } else if (ev) {
      // remove all listeners for the event
      if (bag[ev]) {
        for (namespace in bag[ev]) { SVG.off(n, [ev, namespace].join('.')) }

        delete bag[ev]
      }
    } else {
      // remove all listeners on a given node
      for (event in bag) { SVG.off(n, event) }

      n.instance.events = {}
    }
  })
}

SVG.dispatch = function (node, event, data) {
  var n = node instanceof SVG.EventTarget ? node.getEventTarget() : node

  // Dispatch event
  if (event instanceof window.Event) {
    n.dispatchEvent(event)
  } else {
    event = new window.CustomEvent(event, {detail: data, cancelable: true})
    n.dispatchEvent(event)
  }
  return event
}

SVG.EventTarget = SVG.invent({
  create: function () {},
  extend: {
    // Bind given event to listener
    on: function (event, listener, binding, options) {
      SVG.on(this, event, listener, binding, options)
      return this
    },
    // Unbind event from listener
    off: function (event, listener) {
      SVG.off(this, event, listener)
      return this
    },
    dispatch: function (event, data) {
      return SVG.dispatch(this, event, data)
    },
    // Fire given event
    fire: function (event, data) {
      this.dispatch(event, data)
      return this
    }
  }
})

/* global createElement */

SVG.HtmlNode = SVG.invent({
  inherit: SVG.EventTarget,
  create: function (element) {
    this.node = element
  },

  extend: {
    add: function (element, i) {
      element = createElement(element)

      if (element.node !== this.node.children[i]) {
        this.node.insertBefore(element.node, this.node.children[i] || null)
      }

      return this
    },

    put: function (element, i) {
      this.add(element, i)
      return element
    },

    getEventTarget: function () {
      return this.node
    }
  }
})

/* global proportionalSize, assignNewId, createElement, matches, is */

SVG.Element = SVG.invent({
  inherit: SVG.EventTarget,

  // Initialize node
  create: function (node) {
    // event listener
    this.events = {}

    // initialize data object
    this.dom = {}

    // create circular reference
    this.node = node
    if (this.node) {
      this.type = node.nodeName
      this.node.instance = this
      this.events = node.events || {}

      if (node.hasAttribute('svgjs:data')) {
        // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
        this.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})
      }
    }
  },

  // Add class methods
  extend: {
    // Move over x-axis
    x: function (x) {
      return this.attr('x', x)
    },

    // Move over y-axis
    y: function (y) {
      return this.attr('y', y)
    },

    // Move by center over x-axis
    cx: function (x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
    },

    // Move by center over y-axis
    cy: function (y) {
      return y == null
        ? this.y() + this.height() / 2
        : this.y(y - this.height() / 2)
    },

    // Move element to given x and y values
    move: function (x, y) {
      return this.x(x).y(y)
    },

    // Move element by its center
    center: function (x, y) {
      return this.cx(x).cy(y)
    },

    // Set width of element
    width: function (width) {
      return this.attr('width', width)
    },

    // Set height of element
    height: function (height) {
      return this.attr('height', height)
    },

    // Set element size to given width and height
    size: function (width, height) {
      var p = proportionalSize(this, width, height)

      return this
        .width(new SVG.Number(p.width))
        .height(new SVG.Number(p.height))
    },

    // Clone element
    clone: function (parent) {
      // write dom data to the dom so the clone can pickup the data
      this.writeDataToDom()

      // clone element and assign new id
      var clone = assignNewId(this.node.cloneNode(true))

      // insert the clone in the given parent or after myself
      if (parent) parent.add(clone)
      else this.after(clone)

      return clone
    },

    // Remove element
    remove: function () {
      if (this.parent()) { this.parent().removeElement(this) }

      return this
    },

    // Replace element
    replace: function (element) {
      this.after(element).remove()

      return element
    },

    // Add element to given container and return self
    addTo: function (parent) {
      return createElement(parent).put(this)
    },

    // Add element to given container and return container
    putIn: function (parent) {
      return createElement(parent).add(this)
    },

    // Get / set id
    id: function (id) {
      // generate new id if no id set
      if (typeof id === 'undefined' && !this.node.id) {
        this.node.id = SVG.eid(this.type)
      }

      // dont't set directly width this.node.id to make `null` work correctly
      return this.attr('id', id)
    },

    // Checks whether the given point inside the bounding box of the element
    inside: function (x, y) {
      var box = this.bbox()

      return x > box.x &&
        y > box.y &&
        x < box.x + box.width &&
        y < box.y + box.height
    },

    // Show element
    show: function () {
      return this.css('display', '')
    },

    // Hide element
    hide: function () {
      return this.css('display', 'none')
    },

    // Is element visible?
    visible: function () {
      return this.css('display') !== 'none'
    },

    // Return id on string conversion
    toString: function () {
      return this.id()
    },

    // Return array of classes on the node
    classes: function () {
      var attr = this.attr('class')
      return attr == null ? [] : attr.trim().split(SVG.regex.delimiter)
    },

    // Return true if class exists on the node, false otherwise
    hasClass: function (name) {
      return this.classes().indexOf(name) !== -1
    },

    // Add class to the node
    addClass: function (name) {
      if (!this.hasClass(name)) {
        var array = this.classes()
        array.push(name)
        this.attr('class', array.join(' '))
      }

      return this
    },

    // Remove class from the node
    removeClass: function (name) {
      if (this.hasClass(name)) {
        this.attr('class', this.classes().filter(function (c) {
          return c !== name
        }).join(' '))
      }

      return this
    },

    // Toggle the presence of a class on the node
    toggleClass: function (name) {
      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
    },

    // Get referenced element form attribute value
    reference: function (attr) {
      return SVG.get(this.attr(attr))
    },

    // Returns the parent element instance
    parent: function (type) {
      var parent = this

      // check for parent
      if (!parent.node.parentNode) return null

      // get parent element
      parent = SVG.adopt(parent.node.parentNode)

      if (!type) return parent

      // loop trough ancestors if type is given
      while (parent && parent.node instanceof window.SVGElement) {
        if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
        parent = SVG.adopt(parent.node.parentNode)
      }
    },

    // Get parent document
    doc: function () {
      var p = this.parent(SVG.Doc)
      return p && p.doc()
    },

    // Get defs
    defs: function () {
      return this.doc().defs()
    },

    // return array of all ancestors of given type up to the root svg
    parents: function (type) {
      var parents = []
      var parent = this

      do {
        parent = parent.parent(type)
        if (!parent || !parent.node) break

        parents.push(parent)
      } while (parent.parent)

      return parents
    },

    // matches the element vs a css selector
    matches: function (selector) {
      return matches(this.node, selector)
    },

    // Returns the svg node to call native svg methods on it
    native: function () {
      return this.node
    },

    // Import raw svg
    svg: function (svg) {
      var well, len

      // act as a setter if svg is given
      if (svg && this instanceof SVG.Parent) {
        // create temporary holder
        well = document.createElementNS(SVG.ns, 'svg')
        // dump raw svg
        well.innerHTML = svg

        // transplant nodes
        for (len = well.children.length; len--;) {
          this.node.appendChild(well.firstElementChild)
        }

      // otherwise act as a getter
      } else {
        // write svgjs data to the dom
        this.writeDataToDom()

        return this.node.outerHTML
      }

      return this
    },

    // write svgjs data to the dom
    writeDataToDom: function () {
      // dump variables recursively
      if (this.is(SVG.Parent)) {
        this.each(function () {
          this.writeDataToDom()
        })
      }

      // remove previously set data
      this.node.removeAttribute('svgjs:data')

      if (Object.keys(this.dom).length) {
        this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428
      }
      return this
    },

    // set given data to the elements data property
    setData: function (o) {
      this.dom = o
      return this
    },
    is: function (obj) {
      return is(this, obj)
    },
    getEventTarget: function () {
      return this.node
    }
  }
})

/* global abcdef, arrayToMatrix, closeEnough, formatTransforms */

SVG.Matrix = SVG.invent({
  // Initialize
  create: function (source) {
    var base = arrayToMatrix([1, 0, 0, 1, 0, 0])

    // ensure source as object
    source = source instanceof SVG.Element ? source.matrixify()
      : typeof source === 'string' ? arrayToMatrix(source.split(SVG.regex.delimiter).map(parseFloat))
      : Array.isArray(source) ? arrayToMatrix(source)
      : (typeof source === 'object' && (
          source.a != null || source.b != null || source.c != null ||
          source.d != null || source.e != null || source.f != null
        )) ? source
      : (typeof source === 'object') ? new SVG.Matrix().transform(source)
      : arguments.length === 6 ? arrayToMatrix([].slice.call(arguments))
      : base

    // Merge the source matrix with the base matrix
    this.a = source.a != null ? source.a : base.a
    this.b = source.b != null ? source.b : base.b
    this.c = source.c != null ? source.c : base.c
    this.d = source.d != null ? source.d : base.d
    this.e = source.e != null ? source.e : base.e
    this.f = source.f != null ? source.f : base.f
  },

  // Add methods
  extend: {

    // Clones this matrix
    clone: function () {
      return new SVG.Matrix(this)
    },

    // Transform a matrix into another matrix by manipulating the space
    transform: function (o) {
      // Check if o is a matrix and then left multiply it directly
      if (o.a != null) {
        var matrix = new SVG.Matrix(o)
        var newMatrix = this.lmultiply(matrix)
        return newMatrix
      }

      // Get the proposed transformations and the current transformations
      var t = formatTransforms(o)
      var currentTransform = new SVG.Matrix(this)

      // Construct the resulting matrix
      var transformer = new SVG.Matrix()
        .translate(-t.ox, -t.oy)
        .scale(t.scaleX, t.scaleY)
        .skew(t.skewX, t.skewY)
        .shear(t.shear)
        .rotate(t.theta)
        .translate(t.ox, t.oy)
        .translate(t.rx, t.ry)
        .lmultiply(currentTransform)

      // If we want the origin at a particular place, we force it there
      if (isFinite(t.px) || isFinite(t.py)) {
        // Figure out where the origin went and the delta to get there
        var current = new SVG.Point(t.ox - t.rx, t.oy - t.ry).transform(transformer)
        var dx = t.px ? t.px - current.x : 0
        var dy = t.py ? t.py - current.y : 0

        // Apply another translation
        transformer = transformer.translate(dx, dy)
      }

      // We can apply translations after everything else
      transformer = transformer.translate(t.tx, t.ty)
      return transformer
    },

    // Applies a matrix defined by its affine parameters
    compose: function (o) {
      if (o.origin) {
        o.originX = o.origin[0]
        o.originY = o.origin[1]
      }
      // Get the parameters
      var ox = o.originX || 0
      var oy = o.originY || 0
      var sx = o.scaleX || 1
      var sy = o.scaleY || 1
      var lam = o.shear || 0
      var theta = o.rotate || 0
      var tx = o.translateX || 0
      var ty = o.translateY || 0

      // Apply the standard matrix
      var result = new SVG.Matrix()
        .translate(-ox, -oy)
        .scale(sx, sy)
        .shear(lam)
        .rotate(theta)
        .translate(tx, ty)
        .lmultiply(this)
        .translate(ox, oy)
      return result
    },

    // Decomposes this matrix into its affine parameters
    decompose: function (cx=0, cy=0) {
      // Get the parameters from the matrix
      var a = this.a
      var b = this.b
      var c = this.c
      var d = this.d
      var e = this.e
      var f = this.f

      // Figure out if the winding direction is clockwise or counterclockwise
      var determinant = a * d - b * c
      var ccw = determinant > 0 ? 1 : -1

      // Since we only shear in x, we can use the x basis to get the x scale
      // and the rotation of the resulting matrix
      var sx = ccw * Math.sqrt(a * a + b * b)
      var thetaRad = Math.atan2(ccw * b, ccw * a)
      var theta = 180 / Math.PI * thetaRad
      var ct = Math.cos(thetaRad)
      var st = Math.sin(thetaRad)

      // We can then solve the y basis vector simultaneously to get the other
      // two affine parameters directly from these parameters
      var lam = (a * c + b * d) / determinant
      var sy = ((c * sx) / (lam * a - b)) || ((d * sx) / (lam * b + a))

      let tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy)
      let ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy)

      // Construct the decomposition and return it
      return {
        // Return the affine parameters
        scaleX: sx,
        scaleY: sy,
        shear: lam,
        rotate: theta,
        translateX: tx,
        translateY: ty,
        originX: cx,
        originY: cy,

        // Return the matrix parameters
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      }
    },

    // Morph one matrix into another
    morph: function (matrix) {
      // Store new destination
      this.destination = new SVG.Matrix(matrix)
      return this
    },

    // Get morphed matrix at a given position
    at: function (pos) {
      // Make sure a destination is defined
      if (!this.destination) return this

      // Calculate morphed matrix at a given position
      var matrix = new SVG.Matrix({
        a: this.a + (this.destination.a - this.a) * pos,
        b: this.b + (this.destination.b - this.b) * pos,
        c: this.c + (this.destination.c - this.c) * pos,
        d: this.d + (this.destination.d - this.d) * pos,
        e: this.e + (this.destination.e - this.e) * pos,
        f: this.f + (this.destination.f - this.f) * pos
      })

      return matrix
    },

    // Left multiplies by the given matrix
    multiply: function (matrix) {
      // Get the matrices
      var l = this
      var r = new SVG.Matrix(matrix)

      // Work out the product directly
      var a = l.a * r.a + l.c * r.b
      var b = l.b * r.a + l.d * r.b
      var c = l.a * r.c + l.c * r.d
      var d = l.b * r.c + l.d * r.d
      var e = l.e + l.a * r.e + l.c * r.f
      var f = l.f + l.b * r.e + l.d * r.f

      // Form the matrix and return it
      var product = new SVG.Matrix(a, b, c, d, e, f)
      return product
    },

    lmultiply: function (matrix) {
      var result = new SVG.Matrix(matrix).multiply(this)
      return result
    },

    // Inverses matrix
    inverse: function () {
      // Get the current parameters out of the matrix
      var a = this.a
      var b = this.b
      var c = this.c
      var d = this.d
      var e = this.e
      var f = this.f

      // Invert the 2x2 matrix in the top left
      var det = a * d - b * c
      if (!det) throw new Error('Cannot invert ' + this)

      // Calculate the top 2x2 matrix
      var na = d / det
      var nb = -b / det
      var nc = -c / det
      var nd = a / det

      // Apply the inverted matrix to the top right
      var ne = -(na * e + nc * f)
      var nf = -(nb * e + nd * f)

      // Construct the inverted matrix
      return new SVG.Matrix(na, nb, nc, nd, ne, nf)
    },

    // Translate matrix
    translate: function (x, y) {
      return new SVG.Matrix(this).translateO(x, y)
    },

    translateO: function (x, y) {
      this.e += x || 0
      this.f += y || 0
      return this
    },

    // Scale matrix
    scale: function (x, y, cx, cy) {
      // Support uniform scaling
      if (arguments.length === 1) {
        y = x
      } else if (arguments.length === 3) {
        cy = cx
        cx = y
        y = x
      }

      // Scale the current matrix
      var scale = new SVG.Matrix(x, 0, 0, y, 0, 0)
      var matrix = this.around(cx, cy, scale)
      return matrix
    },

    // Rotate matrix
    rotate: function (r, cx, cy) {
      // Convert degrees to radians
      r = SVG.utils.radians(r)

      // Construct the rotation matrix
      var rotation = new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0)
      var matrix = this.around(cx, cy, rotation)
      return matrix
    },

    // Flip matrix on x or y, at a given offset
    flip: function (axis, around) {
      return axis === 'x' ? this.scale(-1, 1, around, 0)
        : axis === 'y' ? this.scale(1, -1, 0, around)
        : this.scale(-1, -1, axis, around || axis) // Define an x, y flip point
    },

    // Shear matrix
    shear: function (a, cx, cy) {
      var shear = new SVG.Matrix(1, 0, a, 1, 0, 0)
      var matrix = this.around(cx, cy, shear)
      return matrix
    },

    // Skew Matrix
    skew: function (x, y, cx, cy) {
      // support uniformal skew
      if (arguments.length === 1) {
        y = x
      } else if (arguments.length === 3) {
        cy = cx
        cx = y
        y = x
      }

      // Convert degrees to radians
      x = SVG.utils.radians(x)
      y = SVG.utils.radians(y)

      // Construct the matrix
      var skew = new SVG.Matrix(1, Math.tan(y), Math.tan(x), 1, 0, 0)
      var matrix = this.around(cx, cy, skew)
      return matrix
    },

    // SkewX
    skewX: function (x, cx, cy) {
      return this.skew(x, 0, cx, cy)
    },

    // SkewY
    skewY: function (y, cx, cy) {
      return this.skew(0, y, cx, cy)
    },

    // Transform around a center point
    around: function (cx, cy, matrix) {
      var dx = cx || 0
      var dy = cy || 0
      return this.translate(-dx, -dy).lmultiply(matrix).translate(dx, dy)
    },

    // Convert to native SVGMatrix
    native: function () {
      // create new matrix
      var matrix = SVG.parser.nodes.svg.node.createSVGMatrix()

      // update with current values
      for (var i = abcdef.length - 1; i >= 0; i--) {
        matrix[abcdef[i]] = this[abcdef[i]]
      }

      return matrix
    },

    // Check if two matrices are equal
    equals: function (other) {
      var comp = new SVG.Matrix(other)
      return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) &&
        closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) &&
        closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f)
    },

    // Convert matrix to string
    toString: function () {
      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
    },

    toArray: function () {
      return [this.a, this.b, this.c, this.d, this.e, this.f]
    },

    valueOf: function () {
      return {
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      }
    }
  },

  // Define parent
  parent: SVG.Element,

  // Add parent method
  construct: {
    // Get current matrix
    ctm: function () {
      return new SVG.Matrix(this.node.getCTM())
    },
    // Get current screen matrix
    screenCTM: function () {
      /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
         This is needed because FF does not return the transformation matrix
         for the inner coordinate system when getScreenCTM() is called on nested svgs.
         However all other Browsers do that */
      if (this instanceof SVG.Doc && !this.isRoot()) {
        var rect = this.rect(1, 1)
        var m = rect.node.getScreenCTM()
        rect.remove()
        return new SVG.Matrix(m)
      }
      return new SVG.Matrix(this.node.getScreenCTM())
    }
  }
})


SVG.Point = SVG.invent({
  // Initialize
  create: function (x, y, base) {
    var source
    base = base || {x: 0, y: 0}

    // ensure source as object
    source = Array.isArray(x) ? {x: x[0], y: x[1]}
      : typeof x === 'object' ? {x: x.x, y: x.y}
      : {x: x, y: y}

    // merge source
    this.x = source.x == null ? base.x : source.x
    this.y = source.y == null ? base.y : source.y
  },

  // Add methods
  extend: {
    // Clone point
    clone: function () {
      return new SVG.Point(this)
    },

    // Morph one point into another
    morph: function (x, y) {
      // store new destination
      this.destination = new SVG.Point(x, y)
      return this
    },

    // Get morphed point at a given position
    at: function (pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // calculate morphed matrix at a given position
      var point = new SVG.Point({
        x: this.x + (this.destination.x - this.x) * pos,
        y: this.y + (this.destination.y - this.y) * pos
      })
      return point
    },

    // Convert to native SVGPoint
    native: function () {
      // create new point
      var point = SVG.parser.nodes.svg.node.createSVGPoint()

      // update with current values
      point.x = this.x
      point.y = this.y
      return point
    },

    // transform point with matrix
    transform: function (m) {
      // Perform the matrix multiplication
      var x = m.a * this.x + m.c * this.y + m.e
      var y = m.b * this.x + m.d * this.y + m.f

      // Return the required point
      return new SVG.Point(x, y)
    }
  }
})

SVG.extend(SVG.Element, {

  // Get point
  point: function (x, y) {
    return new SVG.Point(x, y).transform(this.screenCTM().inverse())
  }
})

SVG.extend(SVG.Element, {
  // Set svg element attribute
  attr: function (a, v, n) {
    // act as full getter
    if (a == null) {
      // get an object of attributes
      a = {}
      v = this.node.attributes
      for (n = v.length - 1; n >= 0; n--) {
        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue)
          ? parseFloat(v[n].nodeValue)
          : v[n].nodeValue
      }
      return a
    } else if (typeof a === 'object') {
      // apply every attribute individually if an object is passed
      for (v in a) this.attr(v, a[v])
    } else if (v === null) {
        // remove value
      this.node.removeAttribute(a)
    } else if (v == null) {
      // act as a getter if the first and only argument is not an object
      v = this.node.getAttribute(a)
      return v == null ? SVG.defaults.attrs[a]
        : SVG.regex.isNumber.test(v) ? parseFloat(v)
        : v
    } else {
      // convert image fill and stroke to patterns
      if (a === 'fill' || a === 'stroke') {
        if (SVG.regex.isImage.test(v)) {
          v = this.doc().defs().image(v)
        }

        if (v instanceof SVG.Image) {
          v = this.doc().defs().pattern(0, 0, function () {
            this.add(v)
          })
        }
      }

      // ensure correct numeric values (also accepts NaN and Infinity)
      if (typeof v === 'number') {
        v = new SVG.Number(v)
      } else if (SVG.Color.isColor(v)) {
        // ensure full hex color
        v = new SVG.Color(v)
      } else if (Array.isArray(v)) {
        // parse array values
        v = new SVG.Array(v)
      }

      // if the passed attribute is leading...
      if (a === 'leading') {
        // ... call the leading method instead
        if (this.leading) {
          this.leading(v)
        }
      } else {
        // set given attribute on node
        typeof n === 'string' ? this.node.setAttributeNS(n, a, v.toString())
          : this.node.setAttribute(a, v.toString())
      }

      // rebuild if required
      if (this.rebuild && (a === 'font-size' || a === 'x')) {
        this.rebuild(a, v)
      }
    }

    return this
  }
})

/* global arrayToMatrix */

SVG.extend(SVG.Element, {
  // Reset all transformations
  untransform: function () {
    return this.attr('transform', null)
  },

  // merge the whole transformation chain into one matrix and returns it
  matrixify: function () {
    var matrix = (this.attr('transform') || '')
      // split transformations
      .split(SVG.regex.transforms).slice(0, -1).map(function (str) {
        // generate key => value pairs
        var kv = str.trim().split('(')
        return [kv[0],
          kv[1].split(SVG.regex.delimiter)
            .map(function (str) { return parseFloat(str) })
        ]
      })
      .reverse()
      // merge every transformation into one matrix
      .reduce(function (matrix, transform) {
        if (transform[0] === 'matrix') {
          return matrix.lmultiply(arrayToMatrix(transform[1]))
        }
        return matrix[transform[0]].apply(matrix, transform[1])
      }, new SVG.Matrix())

    return matrix
  },

  // add an element to another parent without changing the visual representation on the screen
  toParent: function (parent) {
    if (this === parent) return this
    var ctm = this.screenCTM()
    var pCtm = parent.screenCTM().inverse()

    this.addTo(parent).untransform().transform(pCtm.multiply(ctm))

    return this
  },

  // same as above with parent equals root-svg
  toDoc: function () {
    return this.toParent(this.doc())
  }
})

SVG.extend(SVG.Element, {

  // Add transformations
  transform: function (o, relative) {
    // Act as a getter if no object was passed
    if (o == null || typeof o === 'string') {
      var decomposed = new SVG.Matrix(this).decompose()
      return decomposed[o] || decomposed
    }

    // Set the origin according to the defined transform
    o.origin = getOrigin (o, this)

    // The user can pass a boolean, an SVG.Element or an SVG.Matrix or nothing
    var cleanRelative = relative === true ? this : (relative || false)
    var result = new SVG.Matrix(cleanRelative).transform(o)
    return this.attr('transform', result)
  }
})

SVG.extend(SVG.Timeline, {
  transform: function (o, relative, affine) {

  //   // get target in case of the fx module, otherwise reference this
  //   var target = this.target()
  //     , matrix, bbox
  //
  //   // act as a getter
  //   if (typeof o !== 'object') {
  //     // get current matrix
  //     matrix = new SVG.Matrix(target).extract()
  //
  //     return typeof o === 'string' ? matrix[o] : matrix
  //   }
  //
  //   // ensure relative flag
  //   relative = !!relative || !!o.relative
  //
  //   // act on matrix
  //   if (o.a != null) {
  //     matrix = new SVG.Matrix(o)
  //
  //   // act on rotation
  //   } else if (o.rotation != null) {
  //     // ensure centre point
  //     ensureCentre(o, target)
  //
  //     // apply transformation
  //     matrix = new SVG.Rotate(o.rotation, o.cx, o.cy)
  //
  //   // act on scale
  //   } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
  //     // ensure centre point
  //     ensureCentre(o, target)
  //
  //     // ensure scale values on both axes
  //     o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
  //     o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
  //
  //     matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy)
  //
  //   // act on skew
  //   } else if (o.skewX != null || o.skewY != null) {
  //     // ensure centre point
  //     ensureCentre(o, target)
  //
  //     // ensure skew values on both axes
  //     o.skewX = o.skewX != null ? o.skewX : 0
  //     o.skewY = o.skewY != null ? o.skewY : 0
  //
  //     matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy)
  //
  //   // act on flip
  //   } else if (o.flip) {
  //     if(o.flip == 'x' || o.flip == 'y') {
  //       o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
  //     } else {
  //       if(o.offset == null) {
  //         bbox = target.bbox()
  //         o.flip = bbox.cx
  //         o.offset = bbox.cy
  //       } else {
  //         o.flip = o.offset
  //       }
  //     }
  //
  //     matrix = new SVG.Matrix().flip(o.flip, o.offset)
  //
  //   // act on translate
  //   } else if (o.x != null || o.y != null) {
  //     matrix = new SVG.Translate(o.x, o.y)
  //   }
  //
  //   if(!matrix) return this
  //
  //   matrix.relative = relative
  //
  //   this.last().transforms.push(matrix)
  //
  //   return this._callStart()
  // }
  //     // ensure scale values on both axes
  //     o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
  //     o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
  //
  //     matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy)
  //
  //   // act on skew
  //   } else if (o.skewX != null || o.skewY != null) {
  //     // ensure centre point
  //     ensureCentre(o, target)
  //
  //     // ensure skew values on both axes
  //     o.skewX = o.skewX != null ? o.skewX : 0
  //     o.skewY = o.skewY != null ? o.skewY : 0
  //
  //     matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy)
  //
  //   // act on flip
  //   } else if (o.flip) {
  //     if (o.flip === 'x' || o.flip === 'y') {
  //       o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset
  //     } else {
  //       if (o.offset == null) {
  //         bbox = target.bbox()
  //         o.flip = bbox.cx
  //         o.offset = bbox.cy
  //       } else {
  //         o.flip = o.offset
  //       }
  //     }
  //
  //     matrix = new SVG.Matrix().flip(o.flip, o.offset)
  //
  //   // act on translate
  //   } else if (o.x != null || o.y != null) {
  //     matrix = new SVG.Translate(o.x, o.y)
  //   }
  //
  //   if (!matrix) return this
  //
  //   matrix.relative = relative
  //
  //   this.last().transforms.push(matrix)
  //
  //   return this._callStart()
  }
})

/* global camelCase */

SVG.extend(SVG.Element, {
  // Dynamic style generator
  css: function (s, v) {
    var ret = {}
    var t, i
    if (arguments.length === 0) {
      // get full style as object
      this.node.style.cssText.split(/\s*;\s*/).filter(function (el) { return !!el.length }).forEach(function (el) {
        t = el.split(/\s*:\s*/)
        ret[t[0]] = t[1]
      })
      return ret
    }

    if (arguments.length < 2) {
      // get style properties in the array
      if (Array.isArray(s)) {
        for (i = s.length; i--;) {
          ret[camelCase(s[i])] = this.node.style[camelCase(s[i])]
        }
        return ret
      }

      // get style for property
      if (typeof s === 'string') {
        return this.node.style[camelCase(s)]
      }

      // set styles in object
      if (typeof s === 'object') {
        for (i in s) {
          // set empty string if null/undefined/'' was given
          this.node.style[camelCase(i)] = (s[i] == null || SVG.regex.isBlank.test(s[i])) ? '' : s[i]
        }
      }
    }

    // set style for property
    if (arguments.length === 2) {
      this.node.style[camelCase(s)] = (v == null || SVG.regex.isBlank.test(v)) ? '' : v
    }

    return this
  }
})

/* global createElement */

SVG.Parent = SVG.invent({
  // Initialize node
  create: function (node) {
    SVG.Element.call(this, node)
  },

  // Inherit from
  inherit: SVG.Element,

  // Add class methods
  extend: {
    // Returns all child elements
    children: function () {
      return SVG.utils.map(this.node.children, function (node) {
        return SVG.adopt(node)
      })
    },
    // Add given element at a position
    add: function (element, i) {
      element = createElement(element)

      if (element.node !== this.node.children[i]) {
        this.node.insertBefore(element.node, this.node.children[i] || null)
      }

      return this
    },
    // Basically does the same as `add()` but returns the added element instead
    put: function (element, i) {
      this.add(element, i)
      return element.instance || element
    },
    // Checks if the given element is a child
    has: function (element) {
      return this.index(element) >= 0
    },
    // Gets index of given element
    index: function (element) {
      return [].slice.call(this.node.children).indexOf(element.node)
    },
    // Get a element at the given index
    get: function (i) {
      return SVG.adopt(this.node.children[i])
    },
    // Get first child
    first: function () {
      return this.get(0)
    },
    // Get the last child
    last: function () {
      return this.get(this.node.children.length - 1)
    },
    // Iterates over all children and invokes a given block
    each: function (block, deep) {
      var children = this.children()
      var i, il

      for (i = 0, il = children.length; i < il; i++) {
        if (children[i] instanceof SVG.Element) {
          block.apply(children[i], [i, children])
        }

        if (deep && (children[i] instanceof SVG.Parent)) {
          children[i].each(block, deep)
        }
      }

      return this
    },
    // Remove a given child
    removeElement: function (element) {
      this.node.removeChild(element.node)

      return this
    },
    // Remove all elements in this container
    clear: function () {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild)
      }

      // remove defs reference
      delete this._defs

      return this
    }
  }

})

SVG.extend(SVG.Parent, {
  flatten: function (parent) {
    // flattens is only possible for nested svgs and groups
    if (!(this instanceof SVG.G || this instanceof SVG.Doc)) {
      return this
    }

    parent = parent || (this instanceof SVG.Doc && this.isRoot() ? this : this.parent(SVG.Parent))

    this.each(function () {
      if (this instanceof SVG.Defs) return this
      if (this instanceof SVG.Parent) return this.flatten(parent)
      return this.toParent(parent)
    })

    // we need this so that SVG.Doc does not get removed
    this.node.firstElementChild || this.remove()

    return this
  },
  ungroup: function (parent) {
    // ungroup is only possible for nested svgs and groups
    if (!(this instanceof SVG.G || (this instanceof SVG.Doc && !this.isRoot()))) {
      return this
    }

    parent = parent || this.parent(SVG.Parent)

    this.each(function () {
      return this.toParent(parent)
    })

    // we need this so that SVG.Doc does not get removed
    this.remove()

    return this
  }
})

SVG.Container = SVG.invent({
  // Initialize node
  create: function (node) {
    SVG.Element.call(this, node)
  },

  // Inherit from
  inherit: SVG.Parent
})

SVG.Defs = SVG.invent({
  // Initialize node
  create: 'defs',

  // Inherit from
  inherit: SVG.Container
})

SVG.G = SVG.invent({
  // Initialize node
  create: 'g',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
  },

  // Add parent method
  construct: {
    // Create a group element
    group: function () {
      return this.put(new SVG.G())
    }
  }
})

// ### This module adds backward / forward functionality to elements.

//
SVG.extend(SVG.Element, {
  // Get all siblings, including myself
  siblings: function () {
    return this.parent().children()
  },

  // Get the curent position siblings
  position: function () {
    return this.parent().index(this)
  },

  // Get the next element (will return null if there is none)
  next: function () {
    return this.siblings()[this.position() + 1]
  },

  // Get the next element (will return null if there is none)
  prev: function () {
    return this.siblings()[this.position() - 1]
  },

  // Send given element one step forward
  forward: function () {
    var i = this.position() + 1
    var p = this.parent()

    // move node one step forward
    p.removeElement(this).add(this, i)

    // make sure defs node is always at the top
    if (p instanceof SVG.Doc) {
      p.node.appendChild(p.defs().node)
    }

    return this
  },

  // Send given element one step backward
  backward: function () {
    var i = this.position()

    if (i > 0) {
      this.parent().removeElement(this).add(this, i - 1)
    }

    return this
  },

  // Send given element all the way to the front
  front: function () {
    var p = this.parent()

    // Move node forward
    p.node.appendChild(this.node)

    // Make sure defs node is always at the top
    if (p instanceof SVG.Doc) {
      p.node.appendChild(p.defs().node)
    }

    return this
  },

  // Send given element all the way to the back
  back: function () {
    if (this.position() > 0) {
      this.parent().removeElement(this).add(this, 0)
    }

    return this
  },

  // Inserts a given element before the targeted element
  before: function (element) {
    element.remove()

    var i = this.position()

    this.parent().add(element, i)

    return this
  },

  // Insters a given element after the targeted element
  after: function (element) {
    element.remove()

    var i = this.position()

    this.parent().add(element, i + 1)

    return this
  }
})

SVG.Mask = SVG.invent({
  // Initialize node
  create: 'mask',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    // Unmask all masked elements and remove itself
    remove: function () {
      // unmask all targets
      this.targets().forEach(function (el) {
        el.unmask()
      })

      // remove mask from parent
      return SVG.Element.prototype.remove.call(this)
    },

    targets: function () {
      return SVG.select('svg [mask*="' + this.id() + '"]')
    }
  },

  // Add parent method
  construct: {
    // Create masking element
    mask: function () {
      return this.defs().put(new SVG.Mask())
    }
  }
})

SVG.extend(SVG.Element, {
  // Distribute mask to svg element
  maskWith: function (element) {
    // use given mask or create a new one
    var masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)

    // apply mask
    return this.attr('mask', 'url("#' + masker.id() + '")')
  },
  // Unmask element
  unmask: function () {
    return this.attr('mask', null)
  },
  masker: function () {
    return this.reference('mask')
  }
})

SVG.ClipPath = SVG.invent({
  // Initialize node
  create: 'clipPath',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    // Unclip all clipped elements and remove itself
    remove: function () {
      // unclip all targets
      this.targets().forEach(function (el) {
        el.unclip()
      })

      // remove clipPath from parent
      return SVG.Element.prototype.remove.call(this)
    },

    targets: function () {
      return SVG.select('svg [clip-path*="' + this.id() + '"]')
    }
  },

  // Add parent method
  construct: {
    // Create clipping element
    clip: function () {
      return this.defs().put(new SVG.ClipPath())
    }
  }
})

//
SVG.extend(SVG.Element, {
  // Distribute clipPath to svg element
  clipWith: function (element) {
    // use given clip or create a new one
    var clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)

    // apply mask
    return this.attr('clip-path', 'url("#' + clipper.id() + '")')
  },
  // Unclip element
  unclip: function () {
    return this.attr('clip-path', null)
  },
  clipper: function () {
    return this.reference('clip-path')
  }

})

SVG.Gradient = SVG.invent({
  // Initialize node
  create: function (type) {
    SVG.Element.call(this, typeof type === 'object' ? type : SVG.create(type + 'Gradient'))
  },

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    // Add a color stop
    stop: function (offset, color, opacity) {
      return this.put(new SVG.Stop()).update(offset, color, opacity)
    },
    // Update gradient
    update: function (block) {
      // remove all stops
      this.clear()

      // invoke passed block
      if (typeof block === 'function') {
        block.call(this, this)
      }

      return this
    },
    // Return the fill id
    url: function () {
      return 'url(#' + this.id() + ')'
    },
    // Alias string convertion to fill
    toString: function () {
      return this.url()
    },
    // custom attr to handle transform
    attr: function (a, b, c) {
      if (a === 'transform') a = 'gradientTransform'
      return SVG.Container.prototype.attr.call(this, a, b, c)
    }
  },

  // Add parent method
  construct: {
    // Create gradient element in defs
    gradient: function (type, block) {
      return this.defs().gradient(type, block)
    }
  }
})

// Add animatable methods to both gradient and fx module
SVG.extend([SVG.Gradient, SVG.Timeline], {
  // From position
  from: function (x, y) {
    return (this._target || this).type === 'radialGradient'
      ? this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) })
      : this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
  },
  // To position
  to: function (x, y) {
    return (this._target || this).type === 'radialGradient'
      ? this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) })
      : this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
  }
})

// Base gradient generation
SVG.extend(SVG.Defs, {
  // define gradient
  gradient: function (type, block) {
    return this.put(new SVG.Gradient(type)).update(block)
  }

})

SVG.Stop = SVG.invent({
  // Initialize node
  create: 'stop',

  // Inherit from
  inherit: SVG.Element,

  // Add class methods
  extend: {
    // add color stops
    update: function (o) {
      if (typeof o === 'number' || o instanceof SVG.Number) {
        o = {
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        }
      }

      // set attributes
      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color != null) this.attr('stop-color', o.color)
      if (o.offset != null) this.attr('offset', new SVG.Number(o.offset))

      return this
    }
  }
})

SVG.Pattern = SVG.invent({
  // Initialize node
  create: 'pattern',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    // Return the fill id
    url: function () {
      return 'url(#' + this.id() + ')'
    },
    // Update pattern by rebuilding
    update: function (block) {
      // remove content
      this.clear()

      // invoke passed block
      if (typeof block === 'function') {
        block.call(this, this)
      }

      return this
    },
    // Alias string convertion to fill
    toString: function () {
      return this.url()
    },
    // custom attr to handle transform
    attr: function (a, b, c) {
      if (a === 'transform') a = 'patternTransform'
      return SVG.Container.prototype.attr.call(this, a, b, c)
    }

  },

  // Add parent method
  construct: {
    // Create pattern element in defs
    pattern: function (width, height, block) {
      return this.defs().pattern(width, height, block)
    }
  }
})

SVG.extend(SVG.Defs, {
  // Define gradient
  pattern: function (width, height, block) {
    return this.put(new SVG.Pattern()).update(block).attr({
      x: 0,
      y: 0,
      width: width,
      height: height,
      patternUnits: 'userSpaceOnUse'
    })
  }

})

SVG.Doc = SVG.invent({
  // Initialize node
  create: function (node) {
    SVG.Element.call(this, node || SVG.create('svg'))

    // set svg element attributes and ensure defs node
    this.namespace()
  },

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    isRoot: function () {
      return !this.node.parentNode || !(this.node.parentNode instanceof window.SVGElement) || this.node.parentNode.nodeName === '#document'
    },
    // Check if this is a root svg. If not, call docs from this element
    doc: function () {
      if (this.isRoot()) return this
      return SVG.Element.prototype.doc.call(this)
    },
    // Add namespaces
    namespace: function () {
      if (!this.isRoot()) return this.doc().namespace()
      return this
        .attr({ xmlns: SVG.ns, version: '1.1' })
        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
        .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
    },
    // Creates and returns defs element
    defs: function () {
      if (!this.isRoot()) return this.doc().defs()
      return SVG.adopt(this.node.getElementsByTagName('defs')[0]) || this.put(new SVG.Defs())
    },
    // custom parent method
    parent: function (type) {
      if (this.isRoot()) {
        return this.node.parentNode.nodeName === '#document' ? null : this.node.parentNode
      }

      return SVG.Element.prototype.parent.call(this, type)
    },
    // Removes the doc from the DOM
    remove: function () {
      if (!this.isRoot()) {
        return SVG.Element.prototype.remove.call(this)
      }

      if (this.parent()) {
        this.parent().removeChild(this.node)
      }

      return this
    },
    clear: function () {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild)
      }
      return this
    }
  },
  construct: {
    // Create nested svg document
    nested: function () {
      return this.put(new SVG.Doc())
    }
  }
})


SVG.Shape = SVG.invent({
  // Initialize node
  create: function (node) {
    SVG.Element.call(this, node)
  },

  // Inherit from
  inherit: SVG.Element
})


SVG.Bare = SVG.invent({
  // Initialize
  create: function (element, inherit) {
    // construct element
    SVG.Element.call(this, SVG.create(element))

    // inherit custom methods
    if (inherit) {
      for (var method in inherit.prototype) {
        if (typeof inherit.prototype[method] === 'function') {
          this[method] = inherit.prototype[method]
        }
      }
    }
  },

  // Inherit from
  inherit: SVG.Element,

  // Add methods
  extend: {
    // Insert some plain text
    words: function (text) {
      // remove contents
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild)
      }

      // create text node
      this.node.appendChild(document.createTextNode(text))

      return this
    }
  }
})

SVG.extend(SVG.Parent, {
  // Create an element that is not described by SVG.js
  element: function (element, inherit) {
    return this.put(new SVG.Bare(element, inherit))
  }
})


SVG.Symbol = SVG.invent({
  // Initialize node
  create: 'symbol',

  // Inherit from
  inherit: SVG.Container,

  construct: {
    // create symbol
    symbol: function () {
      return this.put(new SVG.Symbol())
    }
  }
})


SVG.Use = SVG.invent({
  // Initialize node
  create: 'use',

  // Inherit from
  inherit: SVG.Shape,

  // Add class methods
  extend: {
    // Use element as a reference
    element: function (element, file) {
      // Set lined element
      return this.attr('href', (file || '') + '#' + element, SVG.xlink)
    }
  },

  // Add parent method
  construct: {
    // Create a use element
    use: function (element, file) {
      return this.put(new SVG.Use()).element(element, file)
    }
  }
})


SVG.Rect = SVG.invent({
  // Initialize node
  create: 'rect',

  // Inherit from
  inherit: SVG.Shape,

  // Add parent method
  construct: {
    // Create a rect element
    rect: function (width, height) {
      return this.put(new SVG.Rect()).size(width, height)
    }
  }
})

/* global proportionalSize */

SVG.Circle = SVG.invent({
  // Initialize node
  create: 'circle',

  // Inherit from
  inherit: SVG.Shape,

  // Add parent method
  construct: {
    // Create circle element, based on ellipse
    circle: function (size) {
      return this.put(new SVG.Circle()).rx(new SVG.Number(size).divide(2)).move(0, 0)
    }
  }
})

SVG.extend([SVG.Circle, SVG.Timeline], {
  // Radius x value
  rx: function (rx) {
    return this.attr('r', rx)
  },
  // Alias radius x value
  ry: function (ry) {
    return this.rx(ry)
  }
})

SVG.Ellipse = SVG.invent({
  // Initialize node
  create: 'ellipse',

  // Inherit from
  inherit: SVG.Shape,

  // Add parent method
  construct: {
    // Create an ellipse
    ellipse: function (width, height) {
      return this.put(new SVG.Ellipse()).size(width, height).move(0, 0)
    }
  }
})

SVG.extend([SVG.Ellipse, SVG.Rect, SVG.Timeline], {
  // Radius x value
  rx: function (rx) {
    return this.attr('rx', rx)
  },
  // Radius y value
  ry: function (ry) {
    return this.attr('ry', ry)
  }
})

// Add common method
SVG.extend([SVG.Circle, SVG.Ellipse], {
    // Move over x-axis
  x: function (x) {
    return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
  },
    // Move over y-axis
  y: function (y) {
    return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
  },
    // Move by center over x-axis
  cx: function (x) {
    return x == null ? this.attr('cx') : this.attr('cx', x)
  },
    // Move by center over y-axis
  cy: function (y) {
    return y == null ? this.attr('cy') : this.attr('cy', y)
  },
    // Set width of element
  width: function (width) {
    return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2))
  },
    // Set height of element
  height: function (height) {
    return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2))
  },
    // Custom size function
  size: function (width, height) {
    var p = proportionalSize(this, width, height)

    return this
        .rx(new SVG.Number(p.width).divide(2))
        .ry(new SVG.Number(p.height).divide(2))
  }
})

/* global proportionalSize */

SVG.Line = SVG.invent({
  // Initialize node
  create: 'line',

  // Inherit from
  inherit: SVG.Shape,

  // Add class methods
  extend: {
    // Get array
    array: function () {
      return new SVG.PointArray([
        [ this.attr('x1'), this.attr('y1') ],
        [ this.attr('x2'), this.attr('y2') ]
      ])
    },

    // Overwrite native plot() method
    plot: function (x1, y1, x2, y2) {
      if (x1 == null) {
        return this.array()
      } else if (typeof y1 !== 'undefined') {
        x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
      } else {
        x1 = new SVG.PointArray(x1).toLine()
      }

      return this.attr(x1)
    },

    // Move by left top corner
    move: function (x, y) {
      return this.attr(this.array().move(x, y).toLine())
    },

    // Set element size to given width and height
    size: function (width, height) {
      var p = proportionalSize(this, width, height)
      return this.attr(this.array().size(p.width, p.height).toLine())
    }
  },

  // Add parent method
  construct: {
    // Create a line element
    line: function (x1, y1, x2, y2) {
      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a SVG.PointArray
      return SVG.Line.prototype.plot.apply(
        this.put(new SVG.Line())
      , x1 != null ? [x1, y1, x2, y2] : [0, 0, 0, 0]
      )
    }
  }
})

/* global proportionalSize */

SVG.Polyline = SVG.invent({
  // Initialize node
  create: 'polyline',

  // Inherit from
  inherit: SVG.Shape,

  // Add parent method
  construct: {
    // Create a wrapped polyline element
    polyline: function (p) {
      // make sure plot is called as a setter
      return this.put(new SVG.Polyline()).plot(p || new SVG.PointArray())
    }
  }
})

SVG.Polygon = SVG.invent({
  // Initialize node
  create: 'polygon',

  // Inherit from
  inherit: SVG.Shape,

  // Add parent method
  construct: {
    // Create a wrapped polygon element
    polygon: function (p) {
      // make sure plot is called as a setter
      return this.put(new SVG.Polygon()).plot(p || new SVG.PointArray())
    }
  }
})

// Add polygon-specific functions
SVG.extend([SVG.Polyline, SVG.Polygon], {
  // Get array
  array: function () {
    return this._array || (this._array = new SVG.PointArray(this.attr('points')))
  },

  // Plot new path
  plot: function (p) {
    return (p == null) ? this.array()
      : this.clear().attr('points', typeof p === 'string' ? p
      : (this._array = new SVG.PointArray(p)))
  },

  // Clear array cache
  clear: function () {
    delete this._array
    return this
  },

  // Move by left top corner
  move: function (x, y) {
    return this.attr('points', this.array().move(x, y))
  },

  // Set element size to given width and height
  size: function (width, height) {
    var p = proportionalSize(this, width, height)
    return this.attr('points', this.array().size(p.width, p.height))
  }
})

// unify all point to point elements
SVG.extend([SVG.Line, SVG.Polyline, SVG.Polygon], {
  // Define morphable array
  MorphArray: SVG.PointArray,
  // Move by left top corner over x-axis
  x: function (x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  },
  // Move by left top corner over y-axis
  y: function (y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  },
  // Set width of element
  width: function (width) {
    var b = this.bbox()

    return width == null ? b.width : this.size(width, b.height)
  },
  // Set height of element
  height: function (height) {
    var b = this.bbox()

    return height == null ? b.height : this.size(b.width, height)
  }
})

/* global proportionalSize */

SVG.Path = SVG.invent({
  // Initialize node
  create: 'path',

  // Inherit from
  inherit: SVG.Shape,

  // Add class methods
  extend: {
    // Define morphable array
    MorphArray: SVG.PathArray,
    // Get array
    array: function () {
      return this._array || (this._array = new SVG.PathArray(this.attr('d')))
    },
    // Plot new path
    plot: function (d) {
      return (d == null) ? this.array()
        : this.clear().attr('d', typeof d === 'string' ? d : (this._array = new SVG.PathArray(d)))
    },
    // Clear array cache
    clear: function () {
      delete this._array
      return this
    },
    // Move by left top corner
    move: function (x, y) {
      return this.attr('d', this.array().move(x, y))
    },
    // Move by left top corner over x-axis
    x: function (x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    },
    // Move by left top corner over y-axis
    y: function (y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    },
    // Set element size to given width and height
    size: function (width, height) {
      var p = proportionalSize(this, width, height)
      return this.attr('d', this.array().size(p.width, p.height))
    },
    // Set width of element
    width: function (width) {
      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
    },
    // Set height of element
    height: function (height) {
      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
    }
  },

  // Add parent method
  construct: {
    // Create a wrapped path element
    path: function (d) {
      // make sure plot is called as a setter
      return this.put(new SVG.Path()).plot(d || new SVG.PathArray())
    }
  }
})

SVG.Image = SVG.invent({
  // Initialize node
  create: 'image',

  // Inherit from
  inherit: SVG.Shape,

  // Add class methods
  extend: {
    // (re)load image
    load: function (url, callback) {
      if (!url) return this

      var img = new window.Image()

      SVG.on(img, 'load', function (e) {
        var p = this.parent(SVG.Pattern)

        // ensure image size
        if (this.width() === 0 && this.height() === 0) {
          this.size(img.width, img.height)
        }

        if (p instanceof SVG.Pattern) {
          // ensure pattern size if not set
          if (p.width() === 0 && p.height() === 0) {
            p.size(this.width(), this.height())
          }
        }

        if (typeof callback === 'function') {
          callback.call(this, {
            width: img.width,
            height: img.height,
            ratio: img.width / img.height,
            url: url
          })
        }
      }, this)

      SVG.on(img, 'load error', function () {
        // dont forget to unbind memory leaking events
        SVG.off(img)
      })

      return this.attr('href', (img.src = url), SVG.xlink)
    }
  },

  // Add parent method
  construct: {
    // create image element, load image and set its size
    image: function (source, callback) {
      return this.put(new SVG.Image()).size(0, 0).load(source, callback)
    }
  }
})

SVG.Text = SVG.invent({
  // Initialize node
  create: function (node) {
    SVG.Element.call(this, node || SVG.create('text'))
    this.dom.leading = new SVG.Number(1.3)    // store leading value for rebuilding
    this._rebuild = true                      // enable automatic updating of dy values
    this._build = false                     // disable build mode for adding multiple lines

    // set default font
    this.attr('font-family', SVG.defaults.attrs['font-family'])
  },

  // Inherit from
  inherit: SVG.Parent,

  // Add class methods
  extend: {
    // Move over x-axis
    x: function (x) {
      // act as getter
      if (x == null) {
        return this.attr('x')
      }

      return this.attr('x', x)
    },
    // Move over y-axis
    y: function (y) {
      var oy = this.attr('y')
      var o = typeof oy === 'number' ? oy - this.bbox().y : 0

      // act as getter
      if (y == null) {
        return typeof oy === 'number' ? oy - o : oy
      }

      return this.attr('y', typeof y === 'number' ? y + o : y)
    },
    // Move center over x-axis
    cx: function (x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    },
    // Move center over y-axis
    cy: function (y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    },
    // Set the text content
    text: function (text) {
      // act as getter
      if (text === undefined) {
        var children = this.node.childNodes
        var firstLine = 0
        text = ''

        for (var i = 0, len = children.length; i < len; ++i) {
          // skip textPaths - they are no lines
          if (children[i].nodeName === 'textPath') {
            if (i === 0) firstLine = 1
            continue
          }

          // add newline if its not the first child and newLined is set to true
          if (i !== firstLine && children[i].nodeType !== 3 && SVG.adopt(children[i]).dom.newLined === true) {
            text += '\n'
          }

          // add content of this node
          text += children[i].textContent
        }

        return text
      }

      // remove existing content
      this.clear().build(true)

      if (typeof text === 'function') {
        // call block
        text.call(this, this)
      } else {
        // store text and make sure text is not blank
        text = text.split('\n')

        // build new lines
        for (var j = 0, jl = text.length; j < jl; j++) {
          this.tspan(text[j]).newLine()
        }
      }

      // disable build mode and rebuild lines
      return this.build(false).rebuild()
    },
    // Set / get leading
    leading: function (value) {
      // act as getter
      if (value == null) {
        return this.dom.leading
      }

      // act as setter
      this.dom.leading = new SVG.Number(value)

      return this.rebuild()
    },
    // Rebuild appearance type
    rebuild: function (rebuild) {
      // store new rebuild flag if given
      if (typeof rebuild === 'boolean') {
        this._rebuild = rebuild
      }

      // define position of all lines
      if (this._rebuild) {
        var self = this
        var blankLineOffset = 0
        var dy = this.dom.leading * new SVG.Number(this.attr('font-size'))

        this.each(function () {
          if (this.dom.newLined) {
            this.attr('x', self.attr('x'))

            if (this.text() === '\n') {
              blankLineOffset += dy
            } else {
              this.attr('dy', dy + blankLineOffset)
              blankLineOffset = 0
            }
          }
        })

        this.fire('rebuild')
      }

      return this
    },
    // Enable / disable build mode
    build: function (build) {
      this._build = !!build
      return this
    },
    // overwrite method from parent to set data properly
    setData: function (o) {
      this.dom = o
      this.dom.leading = new SVG.Number(o.leading || 1.3)
      return this
    }
  },

  // Add parent method
  construct: {
    // Create text element
    text: function (text) {
      return this.put(new SVG.Text()).text(text)
    },
    // Create plain text element
    plain: function (text) {
      return this.put(new SVG.Text()).plain(text)
    }
  }

})

SVG.Tspan = SVG.invent({
  // Initialize node
  create: 'tspan',

  // Inherit from
  inherit: SVG.Parent,

  // Add class methods
  extend: {
    // Set text content
    text: function (text) {
      if (text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

      typeof text === 'function' ? text.call(this, this) : this.plain(text)

      return this
    },
    // Shortcut dx
    dx: function (dx) {
      return this.attr('dx', dx)
    },
    // Shortcut dy
    dy: function (dy) {
      return this.attr('dy', dy)
    },
    // Create new line
    newLine: function () {
      // fetch text parent
      var t = this.parent(SVG.Text)

      // mark new line
      this.dom.newLined = true

      // apply new position
      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
    }
  }
})

SVG.extend([SVG.Text, SVG.Tspan], {
  // Create plain text node
  plain: function (text) {
    // clear if build mode is disabled
    if (this._build === false) {
      this.clear()
    }

    // create text node
    this.node.appendChild(document.createTextNode(text))

    return this
  },
  // Create a tspan
  tspan: function (text) {
    var tspan = new SVG.Tspan()

    // clear if build mode is disabled
    if (!this._build) {
      this.clear()
    }

    // add new tspan
    this.node.appendChild(tspan.node)

    return tspan.text(text)
  },
  // FIXME: Does this also work for textpath?
  // Get length of text element
  length: function () {
    return this.node.getComputedTextLength()
  }
})

SVG.TextPath = SVG.invent({
  // Initialize node
  create: 'textPath',

  // Inherit from
  inherit: SVG.Text,

  // Define parent class
  parent: SVG.Parent,

  // Add parent method
  extend: {
    MorphArray: SVG.PathArray,
    // return the array of the path track element
    array: function () {
      var track = this.track()

      return track ? track.array() : null
    },
    // Plot path if any
    plot: function (d) {
      var track = this.track()
      var pathArray = null

      if (track) {
        pathArray = track.plot(d)
      }

      return (d == null) ? pathArray : this
    },
    // Get the path element
    track: function () {
      return this.reference('href')
    }
  },
  construct: {
    textPath: function (text, path) {
      return this.defs().path(path).text(text).addTo(this)
    }
  }
})

SVG.extend([SVG.Text], {
    // Create path for text to run on
  path: function (track) {
    var path = new SVG.TextPath()

    // if d is a path, reuse it
    if (!(track instanceof SVG.Path)) {
      // create path element
      track = this.doc().defs().path(track)
    }

    // link textPath to path and add content
    path.attr('href', '#' + track, SVG.xlink)

    // add textPath element as child node and return textPath
    return this.put(path)
  },
  // Todo: make this plural?
  // Get the textPath children
  textPath: function () {
    return this.select('textPath')
  }
})

SVG.extend([SVG.Path], {
  // creates a textPath from this path
  text: function (text) {
    if (text instanceof SVG.Text) {
      var txt = text.text()
      return text.clear().path(this).text(txt)
    }
    return this.parent().put(new SVG.Text()).path(this).text(text)
  }
  // TODO: Maybe add `targets` to get all textPaths associated with this path
})

SVG.A = SVG.invent({
  // Initialize node
  create: 'a',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    // Link url
    to: function (url) {
      return this.attr('href', url, SVG.xlink)
    },
    // Link target attribute
    target: function (target) {
      return this.attr('target', target)
    }
  },

  // Add parent method
  construct: {
    // Create a hyperlink element
    link: function (url) {
      return this.put(new SVG.A()).to(url)
    }
  }
})

SVG.extend(SVG.Element, {
  // Create a hyperlink element
  linkTo: function (url) {
    var link = new SVG.A()

    if (typeof url === 'function') { url.call(link, link) } else {
      link.to(url)
    }

    return this.parent().put(link).put(this)
  }

})

SVG.Marker = SVG.invent({
  // Initialize node
  create: 'marker',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    // Set width of element
    width: function (width) {
      return this.attr('markerWidth', width)
    },
    // Set height of element
    height: function (height) {
      return this.attr('markerHeight', height)
    },
    // Set marker refX and refY
    ref: function (x, y) {
      return this.attr('refX', x).attr('refY', y)
    },
    // Update marker
    update: function (block) {
      // remove all content
      this.clear()

      // invoke passed block
      if (typeof block === 'function') { block.call(this, this) }

      return this
    },
    // Return the fill id
    toString: function () {
      return 'url(#' + this.id() + ')'
    }
  },

  // Add parent method
  construct: {
    marker: function (width, height, block) {
      // Create marker element in defs
      return this.defs().marker(width, height, block)
    }
  }

})

SVG.extend(SVG.Defs, {
  // Create marker
  marker: function (width, height, block) {
    // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
    return this.put(new SVG.Marker())
      .size(width, height)
      .ref(width / 2, height / 2)
      .viewbox(0, 0, width, height)
      .attr('orient', 'auto')
      .update(block)
  }

})

SVG.extend([SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path], {
  // Create and attach markers
  marker: function (marker, width, height, block) {
    var attr = ['marker']

    // Build attribute name
    if (marker !== 'all') attr.push(marker)
    attr = attr.join('-')

    // Set marker attribute
    marker = arguments[1] instanceof SVG.Marker
      ? arguments[1]
      : this.doc().marker(width, height, block)

    return this.attr(attr, marker)
  }
})

// // Define list of available attributes for stroke and fill
// var sugar = {
//   stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
//   fill: ['color', 'opacity', 'rule'],
//   prefix: function (t, a) {
//     return a === 'color' ? t : t + '-' + a
//   }
// }
//
// // Add sugar for fill and stroke
// ;['fill', 'stroke'].forEach(function (m) {
//   var extension = {}
//   var i
//
//   extension[m] = function (o) {
//     if (typeof o === 'undefined') {
//       return this
//     }
//     if (typeof o === 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function')) {
//       this.attr(m, o)
//     } else {
//       // set all attributes from sugar.fill and sugar.stroke list
//       for (i = sugar[m].length - 1; i >= 0; i--) {
//         if (o[sugar[m][i]] != null) {
//           this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])
//         }
//       }
//     }
//
//     return this
//   }
//
//   SVG.extend([SVG.Element, SVG.Timeline], extension)
// })
//
// SVG.extend([SVG.Element, SVG.Timeline], {
//   // Let the user set the matrix directly
//   matrix: function (mat, b, c, d, e, f) {
//     // Act as a getter
//     if (mat == null) {
//       return new SVG.Matrix(this)
//     }
//
//     // Act as a setter, the user can pass a matrix or a set of numbers
//     return this.attr('transform', new SVG.Matrix(mat, b, c, d, e, f))
//   },
//
//   // Map rotation to transform
//   rotate: function (angle, cx, cy) {
//     return this.transform({rotate: angle, ox: cx, oy: cy}, true)
//   },
//
//   // Map skew to transform
//   skew: function (x, y, cx, cy) {
//     return arguments.length === 1 || arguments.length === 3
//       ? this.transform({skew: x, ox: y, oy: cx}, true)
//       : this.transform({skew: [x, y], ox: cx, oy: cy}, true)
//   },
//
//   shear: function (lam, cx, cy) {
//     return this.transform({shear: lam, ox: cx, oy: cy}, true)
//   },
//
//   // Map scale to transform
//   scale: function (x, y, cx, cy) {
//     return arguments.length === 1 || arguments.length === 3
//       ? this.transform({ scale: x, ox: y, oy: cx }, true)
//       : this.transform({ scale: [x, y], ox: cx, oy: cy }, true)
//   },
//
//   // Map translate to transform
//   translate: function (x, y) {
//     return this.transform({ translate: [x, y] }, true)
//   },
//
//   // Map relative translations to transform
//   relative: function (x, y) {
//     return this.transform({ relative: [x, y] }, true)
//   },
//
//   // Map flip to transform
//   flip: function (direction, around) {
//     var directionString = typeof direction === 'string' ? direction
//       : isFinite(direction) ? 'both'
//       : 'both'
//     var origin = (direction === 'both' && isFinite(around)) ? [around, around]
//       : (direction === 'x') ? [around, 0]
//       : (direction === 'y') ? [0, around]
//       : isFinite(direction) ? [direction, direction]
//       : [0, 0]
//     this.transform({flip: directionString, origin: origin}, true)
//   },
//
//   // Opacity
//   opacity: function (value) {
//     return this.attr('opacity', value)
//   },
//
//   // Relative move over x axis
//   dx: function (x) {
//     return this.x(new SVG.Number(x).plus(this instanceof SVG.Timeline ? 0 : this.x()), true)
//   },
//
//   // Relative move over y axis
//   dy: function (y) {
//     return this.y(new SVG.Number(y).plus(this instanceof SVG.Timeline ? 0 : this.y()), true)
//   },
//
//   // Relative move over x and y axes
//   dmove: function (x, y) {
//     return this.dx(x).dy(y)
//   }
// })
//
// SVG.extend([SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.Timeline], {
//   // Add x and y radius
//   radius: function (x, y) {
//     var type = (this._target || this).type
//     return type === 'radialGradient' || type === 'radialGradient'
//       ? this.attr('r', new SVG.Number(x))
//       : this.rx(x).ry(y == null ? x : y)
//   }
// })
//
// SVG.extend(SVG.Path, {
//   // Get path length
//   length: function () {
//     return this.node.getTotalLength()
//   },
//   // Get point at length
//   pointAt: function (length) {
//     return new SVG.Point(this.node.getPointAtLength(length))
//   }
// })
//
// SVG.extend([SVG.Parent, SVG.Text, SVG.Tspan, SVG.Timeline], {
//   // Set font
//   font: function (a, v) {
//     if (typeof a === 'object') {
//       for (v in a) this.font(v, a[v])
//     }
//
//     return a === 'leading'
//         ? this.leading(v)
//       : a === 'anchor'
//         ? this.attr('text-anchor', v)
//       : a === 'size' || a === 'family' || a === 'weight' || a === 'stretch' || a === 'variant' || a === 'style'
//         ? this.attr('font-' + a, v)
//       : this.attr(a, v)
//   }
// })


SVG.extend(SVG.Element, {
  // Store data values on svg nodes
  data: function (a, v, r) {
    if (typeof a === 'object') {
      for (v in a) {
        this.data(v, a[v])
      }
    } else if (arguments.length < 2) {
      try {
        return JSON.parse(this.attr('data-' + a))
      } catch (e) {
        return this.attr('data-' + a)
      }
    } else {
      this.attr('data-' + a,
        v === null ? null
        : r === true || typeof v === 'string' || typeof v === 'number' ? v
        : JSON.stringify(v)
      )
    }

    return this
  }
})


SVG.extend(SVG.Element, {
  // Remember arbitrary data
  remember: function (k, v) {
    // remember every item in an object individually
    if (typeof arguments[0] === 'object') {
      for (var key in k) {
        this.remember(key, k[key])
      }
    } else if (arguments.length === 1) {
      // retrieve memory
      return this.memory()[k]
    } else {
      // store memory
      this.memory()[k] = v
    }

    return this
  },

  // Erase a given memory
  forget: function () {
    if (arguments.length === 0) {
      this._memory = {}
    } else {
      for (var i = arguments.length - 1; i >= 0; i--) {
        delete this.memory()[arguments[i]]
      }
    }
    return this
  },

  // Initialize or return local memory object
  memory: function () {
    return this._memory || (this._memory = {})
  }
})

/* global idFromReference */

// Method for getting an element by id
SVG.get = function (id) {
  var node = document.getElementById(idFromReference(id) || id)
  return SVG.adopt(node)
}

// Select elements by query string
SVG.select = function (query, parent) {
  return SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
    return SVG.adopt(node)
  })
}

SVG.$$ = function (query, parent) {
  return SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
    return SVG.adopt(node)
  })
}

SVG.$ = function (query, parent) {
  return SVG.adopt((parent || document).querySelector(query))
}

SVG.extend(SVG.Parent, {
  // Scoped select method
  select: function (query) {
    return SVG.select(query, this.node)
  }
})

/* eslint no-unused-vars: 0 */

function createElement (element, makeNested) {
  if (element instanceof SVG.Element) return element

  if (typeof element === 'object') {
    return SVG.adopt(element)
  }

  if (element == null) {
    return new SVG.Doc()
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return SVG.adopt(document.querySelector(element))
  }

  var node = SVG.create('svg')
  node.innerHTML = element

  element = SVG.adopt(node.firstElementChild)

  return element
}

function isNulledBox (box) {
  return !box.w && !box.h && !box.x && !box.y
}

function domContains (node) {
  return (document.documentElement.contains || function (node) {
    // This is IE - it does not support contains() for top-level SVGs
    while (node.parentNode) {
      node = node.parentNode
    }
    return node === document
  }).call(document.documentElement, node)
}

function pathRegReplace (a, b, c, d) {
  return c + d.replace(SVG.regex.dots, ' .')
}

// creates deep clone of array
function arrayClone (arr) {
  var clone = arr.slice(0)
  for (var i = clone.length; i--;) {
    if (Array.isArray(clone[i])) {
      clone[i] = arrayClone(clone[i])
    }
  }
  return clone
}

// tests if a given element is instance of an object
function is (el, obj) {
  return el instanceof obj
}

// tests if a given selector matches an element
function matches (el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
}

// Convert dash-separated-string to camelCase
function camelCase (s) {
  return s.toLowerCase().replace(/-(.)/g, function (m, g) {
    return g.toUpperCase()
  })
}

// Capitalize first letter of a string
function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Ensure to six-based hex
function fullHex (hex) {
  return hex.length === 4
    ? [ '#',
      hex.substring(1, 2), hex.substring(1, 2),
      hex.substring(2, 3), hex.substring(2, 3),
      hex.substring(3, 4), hex.substring(3, 4)
    ].join('')
    : hex
}

// Component to hex value
function compToHex (comp) {
  var hex = comp.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

// Calculate proportional width and height values when necessary
function proportionalSize (element, width, height) {
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
function arrayToMatrix (a) {
  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
}

// Add centre point to transform object
function ensureCentre (o, target) {
  o.cx = o.cx == null ? target.bbox().cx : o.cx
  o.cy = o.cy == null ? target.bbox().cy : o.cy
}

// PathArray Helpers
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

// Deep new id assignment
function assignNewId (node) {
  // do the same for SVG child nodes as well
  for (var i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i])
  }

  if (node.id) {
    return SVG.adopt(node).id(SVG.eid(node.nodeName))
  }

  return SVG.adopt(node)
}

// Add more bounding box properties
function fullBox (b) {
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
function idFromReference (url) {
  var m = (url || '').toString().match(SVG.regex.reference)

  if (m) return m[1]
}

// Create matrix array for looping
var abcdef = 'abcdef'.split('')

function closeEnough (a, b, threshold) {
  return Math.abs(b - a) < (threshold || 1e-6)
}

// TODO: Refactor this to a static function of matrix.js
function formatTransforms (o) {
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
  var origin = new SVG.Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY)
  var ox = origin.x
  var oy = origin.y
  var position = new SVG.Point(o.position || o.px || o.positionX, o.py || o.positionY)
  var px = position.x
  var py = position.y
  var translate = new SVG.Point(o.translate || o.tx || o.translateX, o.ty || o.translateY)
  var tx = translate.x
  var ty = translate.y
  var relative = new SVG.Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY)
  var rx = relative.x
  var ry = relative.y

  // Populate all of the values
  return {
    scaleX: scaleX,
    scaleY: scaleY,
    skewX: skewX,
    skewY: skewY,
    shear: shear,
    theta: theta,
    rx: rx,
    ry: ry,
    tx: tx,
    ty: ty,
    ox: ox,
    oy: oy,
    px: px,
    py: py
  }
}

function getOrigin (o, element) {
  // Allow origin or around as the names
  origin = o.around == null ? o.origin : o.around

  // Allow the user to pass a string to rotate around a given point
  if ( typeof origin === 'string' || origin == null ) {
    // Get the bounding box of the element with no transformations applied
    const string = (origin || 'center').toLowerCase().trim()
    const { height, width, x, y } = element.bbox()

    // Set the bounds eg : "bottom-left", "Top right", "middle" etc...
    const ox = o.ox || string.includes('left') ? x
      : string.includes('right') ? x + width
      : x + width / 2
    const oy = o.oy || string.includes('top') ? y
      : string.includes('bottom') ? y + height
      : y + height / 2
    return [ox, oy]
  }

  // Return the origin as it is if it wasn't a string
  return origin
}

/* globals fullBox, domContains, isNulledBox, Exception */

SVG.Box = SVG.invent({
  create: function (source) {
    var base = [0, 0, 0, 0]
    source = typeof source === 'string' ? source.split(SVG.regex.delimiter).map(parseFloat)
      : Array.isArray(source) ? source
      : typeof source === 'object' ? [source.left != null ? source.left
      : source.x, source.top != null ? source.top : source.y, source.width, source.height]
      : arguments.length === 4 ? [].slice.call(arguments)
      : base

    this.x = source[0]
    this.y = source[1]
    this.width = source[2]
    this.height = source[3]

    // add center, right, bottom...
    fullBox(this)
  },
  extend: {
    // Merge rect box with another, return a new instance
    merge: function (box) {
      var x = Math.min(this.x, box.x)
      var y = Math.min(this.y, box.y)

      return new SVG.Box(
        x, y,
        Math.max(this.x + this.width, box.x + box.width) - x,
        Math.max(this.y + this.height, box.y + box.height) - y
      )
    },

    transform: function (m) {
      var xMin = Infinity
      var xMax = -Infinity
      var yMin = Infinity
      var yMax = -Infinity

      var pts = [
        new SVG.Point(this.x, this.y),
        new SVG.Point(this.x2, this.y),
        new SVG.Point(this.x, this.y2),
        new SVG.Point(this.x2, this.y2)
      ]

      pts.forEach(function (p) {
        p = p.transform(m)
        xMin = Math.min(xMin, p.x)
        xMax = Math.max(xMax, p.x)
        yMin = Math.min(yMin, p.y)
        yMax = Math.max(yMax, p.y)
      })

      return new SVG.Box(
        xMin, yMin,
        xMax - xMin,
        yMax - yMin
      )
    },

    addOffset: function () {
      // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
      this.x += window.pageXOffset
      this.y += window.pageYOffset
      return this
    },
    toString: function () {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    },
    toArray: function () {
      return [this.x, this.y, this.width, this.height]
    },
    morph: function (x, y, width, height) {
      this.destination = new SVG.Box(x, y, width, height)
      return this
    },

    at: function (pos) {
      if (!this.destination) return this

      return new SVG.Box(
          this.x + (this.destination.x - this.x) * pos
        , this.y + (this.destination.y - this.y) * pos
        , this.width + (this.destination.width - this.width) * pos
        , this.height + (this.destination.height - this.height) * pos
      )
    }
  },

    // Define Parent
  parent: SVG.Element,

  // Constructor
  construct: {
    // Get bounding box
    bbox: function () {
      var box

      try {
        // find native bbox
        box = this.node.getBBox()

        if (isNulledBox(box) && !domContains(this.node)) {
          throw new Exception('Element not in the dom')
        }
      } catch (e) {
        try {
          var clone = this.clone(SVG.parser().svg).show()
          box = clone.node.getBBox()
          clone.remove()
        } catch (e) {
          console.warn('Getting a bounding box of this element is not possible')
        }
      }

      return new SVG.Box(box)
    },

    rbox: function (el) {
      // IE11 throws an error when element not in dom
      try {
        var box = new SVG.Box(this.node.getBoundingClientRect())
        if (el) return box.transform(el.screenCTM().inverse())
        return box.addOffset()
      } catch (e) {
        return new SVG.Box()
      }
    }
  }
})

SVG.extend([SVG.Doc, SVG.Symbol, SVG.Image, SVG.Pattern, SVG.Marker, SVG.ForeignObject, SVG.View], {
  viewbox: function (x, y, width, height) {
    // act as getter
    if (x == null) return new SVG.Box(this.attr('viewBox'))

    // act as setter
    return this.attr('viewBox', new SVG.Box(x, y, width, height))
  }
})


SVG.parser = function () {
  var b

  if (!SVG.parser.nodes.svg.node.parentNode) {
    b = document.body || document.documentElement
    SVG.parser.nodes.svg.addTo(b)
  }

  return SVG.parser.nodes
}

SVG.parser.nodes = {
  svg: SVG().size(2, 0).css({
    opacity: 0,
    position: 'absolute',
    left: '-100%',
    top: '-100%',
    overflow: 'hidden'
  })
}

SVG.parser.nodes.path = SVG.parser.nodes.svg.path().node

/* global requestAnimationFrame */

SVG.Animator = {
  nextDraw: null,
  frames: new SVG.Queue(),
  timeouts: new SVG.Queue(),
  timer: window.performance || window.Date,
  transforms: [],

  frame: function (fn) {
    // Store the node
    var node = SVG.Animator.frames.push({ run: fn })

    // Request an animation frame if we don't have one
    if (SVG.Animator.nextDraw === null) {
      SVG.Animator.nextDraw = requestAnimationFrame(SVG.Animator._draw)
    }

    // Return the node so we can remove it easily
    return node
  },

  transform_frame: function (fn, id) {
    SVG.Animator.transforms[id] = fn
  },

  timeout: function (fn, delay) {
    delay = delay || 0

    // Work out when the event should fire
    var time = SVG.Animator.timer.now() + delay

    // Add the timeout to the end of the queue
    var node = SVG.Animator.timeouts.push({ run: fn, time: time })

    // Request another animation frame if we need one
    if (SVG.Animator.nextDraw === null) {
      SVG.Animator.nextDraw = requestAnimationFrame(SVG.Animator._draw)
    }

    return node
  },

  cancelFrame: function (node) {
    SVG.Animator.frames.remove(node)
  },

  clearTimeout: function (node) {
    SVG.Animator.timeouts.remove(node)
  },

  _draw: function (now) {
    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
    var nextTimeout = null
    var lastTimeout = SVG.Animator.timeouts.last()
    while ((nextTimeout = SVG.Animator.timeouts.shift())) {
      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.run()
      } else {
        SVG.Animator.timeouts.push(nextTimeout)
      }

      // If we hit the last item, we should stop shifting out more items
      if (nextTimeout === lastTimeout) break
    }

    // Run all of the animation frames
    var nextFrame = null
    var lastFrame = SVG.Animator.frames.last()
    while ((nextFrame !== lastFrame) && (nextFrame = SVG.Animator.frames.shift())) {
      nextFrame.run()
    }

    SVG.Animator.transforms.forEach(function (el) { el() })

    // If we have remaining timeouts or frames, draw until we don't anymore
    SVG.Animator.nextDraw = SVG.Animator.timeouts.first() || SVG.Animator.frames.first()
        ? requestAnimationFrame(SVG.Animator._draw)
        : null
  }
}


return SVG

}));