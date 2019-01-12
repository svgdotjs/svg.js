import { delimiter } from '../modules/core/regex.js'
import { extend } from '../utils/adopter.js'
import { subClassArray } from './ArrayPolyfill.js'
import SVGArray from './SVGArray.js'

const PointArray = subClassArray('PointArray', SVGArray)

export default PointArray

extend(PointArray, {
  // Convert array to string
  toString () {
    // convert to a poly point string
    for (var i = 0, il = this.length, array = []; i < il; i++) {
      array.push(this[i].join(','))
    }

    return array.join(' ')
  },

  // Convert array to line object
  toLine () {
    return {
      x1: this[0][0],
      y1: this[0][1],
      x2: this[1][0],
      y2: this[1][1]
    }
  },

  // Get morphed array at given position
  at (pos) {
    // make sure a destination is defined
    if (!this.destination) return this

    // generate morphed point string
    for (var i = 0, il = this.length, array = []; i < il; i++) {
      array.push([
        this[i][0] + (this.destination[i][0] - this[i][0]) * pos,
        this[i][1] + (this.destination[i][1] - this[i][1]) * pos
      ])
    }

    return new PointArray(array)
  },

  // Parse point string and flat array
  parse (array = [ [ 0, 0 ] ]) {
    var points = []

    // if it is an array
    if (array instanceof Array) {
      // and it is not flat, there is no need to parse it
      if (array[0] instanceof Array) {
        return array
      }
    } else { // Else, it is considered as a string
      // parse points
      array = array.trim().split(delimiter).map(parseFloat)
    }

    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
    if (array.length % 2 !== 0) array.pop()

    // wrap points in two-tuples
    for (var i = 0, len = array.length; i < len; i = i + 2) {
      points.push([ array[i], array[i + 1] ])
    }

    return points
  },

  // transform points with matrix (similar to Point.transform)
  transform (m) {
    const points = []

    for (let i = 0; i < this.length; i++) {
      const point = this[i]
      // Perform the matrix multiplication
      points.push([
        m.a * point[0] + m.c * point[1] + m.e,
        m.b * point[0] + m.d * point[1] + m.f
      ])
    }

    // Return the required point
    return new PointArray(points)
  },

  // Move point string
  move (x, y) {
    var box = this.bbox()

    // get relative offset
    x -= box.x
    y -= box.y

    // move every point
    if (!isNaN(x) && !isNaN(y)) {
      for (var i = this.length - 1; i >= 0; i--) {
        this[i] = [ this[i][0] + x, this[i][1] + y ]
      }
    }

    return this
  },

  // Resize poly string
  size (width, height) {
    var i
    var box = this.bbox()

    // recalculate position of all points according to new size
    for (i = this.length - 1; i >= 0; i--) {
      if (box.width) this[i][0] = ((this[i][0] - box.x) * width) / box.width + box.x
      if (box.height) this[i][1] = ((this[i][1] - box.y) * height) / box.height + box.y
    }

    return this
  },

  // Get bounding box of points
  bbox () {
    var maxX = -Infinity
    var maxY = -Infinity
    var minX = Infinity
    var minY = Infinity
    this.forEach(function (el) {
      maxX = Math.max(el[0], maxX)
      maxY = Math.max(el[1], maxY)
      minX = Math.min(el[0], minX)
      minY = Math.min(el[1], minY)
    })
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
  }
})
