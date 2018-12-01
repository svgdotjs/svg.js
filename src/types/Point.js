export default class Point {
  // Initialize
  constructor (...args) {
    this.init(...args)
  }

  init (x, y) {
    let source
    let base = { x: 0, y: 0 }

    // ensure source as object
    source = Array.isArray(x) ? { x: x[0], y: x[1] }
      : typeof x === 'object' ? { x: x.x, y: x.y }
      : { x: x, y: y }

    // merge source
    this.x = source.x == null ? base.x : source.x
    this.y = source.y == null ? base.y : source.y

    return this
  }

  // Clone point
  clone () {
    return new Point(this)
  }

  // transform point with matrix
  transform (m) {
    // Perform the matrix multiplication
    var x = m.a * this.x + m.c * this.y + m.e
    var y = m.b * this.x + m.d * this.y + m.f

    // Return the required point
    return new Point(x, y)
  }

  toArray () {
    return [ this.x, this.y ]
  }
}

export function point (x, y) {
  return new Point(x, y).transform(this.screenCTM().inverse())
}
