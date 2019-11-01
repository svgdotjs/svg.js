import Matrix from './Matrix.js'

export default class Point {
  // Initialize
  constructor (...args) {
    this.init(...args)
  }

  init (x, y) {
    const base = { x: 0, y: 0 }

    // ensure source as object
    const source = Array.isArray(x) ? { x: x[0], y: x[1] }
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

  transform (m) {
    return this.clone().transformO(m)
  }

  // Transform point with matrix
  transformO (m) {
    if (!Matrix.isMatrixLike(m)) {
      m = new Matrix(m)
    }

    const { x, y } = this

    // Perform the matrix multiplication
    this.x = m.a * x + m.c * y + m.e
    this.y = m.b * x + m.d * y + m.f

    return this
  }

  toArray () {
    return [ this.x, this.y ]
  }
}

export function point (x, y) {
  return new Point(x, y).transform(this.screenCTM().inverse())
}
