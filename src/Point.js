import parser from './parser.js'
import {registerMethods} from './methods.js'

export default class Point {
  // Initialize
  constructor (x, y, base) {
    let source
    base = base || {x: 0, y: 0}

    // ensure source as object
    source = Array.isArray(x) ? {x: x[0], y: x[1]}
      : typeof x === 'object' ? {x: x.x, y: x.y}
      : {x: x, y: y}

    // merge source
    this.x = source.x == null ? base.x : source.x
    this.y = source.y == null ? base.y : source.y
  }

  // Clone point
  clone () {
    return new Point(this)
  }

  // Convert to native SVGPoint
  native () {
    // create new point
    var point = parser().svg.node.createSVGPoint()

    // update with current values
    point.x = this.x
    point.y = this.y
    return point
  }

  // transform point with matrix
  transform (m) {
    // Perform the matrix multiplication
    var x = m.a * this.x + m.c * this.y + m.e
    var y = m.b * this.x + m.d * this.y + m.f

    // Return the required point
    return new Point(x, y)
  }
}

registerMethods({
  Element: {
    // Get point
    point: function (x, y) {
      return new Point(x, y).transform(this.screenCTM().inverse())
    }
  }
})
