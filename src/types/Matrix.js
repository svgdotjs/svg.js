import { delimiter } from '../modules/core/regex.js'
import { radians } from '../utils/utils.js'
import { register } from '../utils/adopter.js'
import Element from '../elements/Element.js'
import Point from './Point.js'

function closeEnough (a, b, threshold) {
  return Math.abs(b - a) < (threshold || 1e-6)
}

export default class Matrix {
  constructor (...args) {
    this.init(...args)
  }

  // Initialize
  init (source) {
    var base = Matrix.fromArray([ 1, 0, 0, 1, 0, 0 ])

    // ensure source as object
    source = source instanceof Element ? source.matrixify()
      : typeof source === 'string' ? Matrix.fromArray(source.split(delimiter).map(parseFloat))
      : Array.isArray(source) ? Matrix.fromArray(source)
      : (typeof source === 'object' && Matrix.isMatrixLike(source)) ? source
      : (typeof source === 'object') ? new Matrix().transform(source)
      : arguments.length === 6 ? Matrix.fromArray([].slice.call(arguments))
      : base

    // Merge the source matrix with the base matrix
    this.a = source.a != null ? source.a : base.a
    this.b = source.b != null ? source.b : base.b
    this.c = source.c != null ? source.c : base.c
    this.d = source.d != null ? source.d : base.d
    this.e = source.e != null ? source.e : base.e
    this.f = source.f != null ? source.f : base.f

    return this
  }

  // Clones this matrix
  clone () {
    return new Matrix(this)
  }

  // Transform a matrix into another matrix by manipulating the space
  transform (o) {
    // Check if o is a matrix and then left multiply it directly
    if (Matrix.isMatrixLike(o)) {
      var matrix = new Matrix(o)
      return matrix.multiplyO(this)
    }

    // Get the proposed transformations and the current transformations
    var t = Matrix.formatTransforms(o)
    var current = this
    const { x: ox, y: oy } = new Point(t.ox, t.oy).transform(current)

    // Construct the resulting matrix
    var transformer = new Matrix()
      .translateO(t.rx, t.ry)
      .lmultiplyO(current)
      .translateO(-ox, -oy)
      .scaleO(t.scaleX, t.scaleY)
      .skewO(t.skewX, t.skewY)
      .shearO(t.shear)
      .rotateO(t.theta)
      .translateO(ox, oy)

    // If we want the origin at a particular place, we force it there
    if (isFinite(t.px) || isFinite(t.py)) {
      const origin = new Point(ox, oy).transform(transformer)
      // TODO: Replace t.px with isFinite(t.px)
      const dx = t.px ? t.px - origin.x : 0
      const dy = t.py ? t.py - origin.y : 0
      transformer.translateO(dx, dy)
    }

    // Translate now after positioning
    transformer.translateO(t.tx, t.ty)
    return transformer
  }

  // Applies a matrix defined by its affine parameters
  compose (o) {
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
    var result = new Matrix()
      .translateO(-ox, -oy)
      .scaleO(sx, sy)
      .shearO(lam)
      .rotateO(theta)
      .translateO(tx, ty)
      .lmultiplyO(this)
      .translateO(ox, oy)
    return result
  }

  // Decomposes this matrix into its affine parameters
  decompose (cx = 0, cy = 0) {
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

    // Use the translations
    const tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy)
    const ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy)

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
  }

  // Left multiplies by the given matrix
  multiply (matrix) {
    return this.clone().multiplyO(matrix)
  }

  multiplyO (matrix) {
    // Get the matrices
    var l = this
    var r = matrix instanceof Matrix
      ? matrix
      : new Matrix(matrix)

    return Matrix.matrixMultiply(l, r, this)
  }

  lmultiply (matrix) {
    return this.clone().lmultiplyO(matrix)
  }

  lmultiplyO (matrix) {
    var r = this
    var l = matrix instanceof Matrix
      ? matrix
      : new Matrix(matrix)

    return Matrix.matrixMultiply(l, r, this)
  }

  // Inverses matrix
  inverseO () {
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
    this.a = na
    this.b = nb
    this.c = nc
    this.d = nd
    this.e = ne
    this.f = nf

    return this
  }

  inverse () {
    return this.clone().inverseO()
  }

  // Translate matrix
  translate (x, y) {
    return this.clone().translateO(x, y)
  }

  translateO (x, y) {
    this.e += x || 0
    this.f += y || 0
    return this
  }

  // Scale matrix
  scale (x, y, cx, cy) {
    return this.clone().scaleO(...arguments)
  }

  scaleO (x, y = x, cx = 0, cy = 0) {
    // Support uniform scaling
    if (arguments.length === 3) {
      cy = cx
      cx = y
      y = x
    }

    const { a, b, c, d, e, f } = this

    this.a = a * x
    this.b = b * y
    this.c = c * x
    this.d = d * y
    this.e = e * x - cx * x + cx
    this.f = f * y - cy * y + cy

    return this
  }

  // Rotate matrix
  rotate (r, cx, cy) {
    return this.clone().rotateO(r, cx, cy)
  }

  rotateO (r, cx = 0, cy = 0) {
    // Convert degrees to radians
    r = radians(r)

    const cos = Math.cos(r)
    const sin = Math.sin(r)

    const { a, b, c, d, e, f } = this

    this.a = a * cos - b * sin
    this.b = b * cos + a * sin
    this.c = c * cos - d * sin
    this.d = d * cos + c * sin
    this.e = e * cos - f * sin + cy * sin - cx * cos + cx
    this.f = f * cos + e * sin - cx * sin - cy * cos + cy

    return this
  }

  // Flip matrix on x or y, at a given offset
  flip (axis, around) {
    return this.clone().flipO(axis, around)
  }

  flipO (axis, around) {
    return axis === 'x' ? this.scaleO(-1, 1, around, 0)
      : axis === 'y' ? this.scaleO(1, -1, 0, around)
      : this.scaleO(-1, -1, axis, around || axis) // Define an x, y flip point
  }

  // Shear matrix
  shear (a, cx, cy) {
    return this.clone().shearO(a, cx, cy)
  }

  shearO (lx, cx = 0, cy = 0) {
    const { a, b, c, d, e, f } = this

    this.a = a + b * lx
    this.c = c + d * lx
    this.e = e + f * lx - cy * lx

    return this
  }

  // Skew Matrix
  skew (x, y, cx, cy) {
    return this.clone().skewO(...arguments)
  }

  skewO (x, y = x, cx = 0, cy = 0) {
    // support uniformal skew
    if (arguments.length === 3) {
      cy = cx
      cx = y
      y = x
    }

    // Convert degrees to radians
    x = radians(x)
    y = radians(y)

    const lx = Math.tan(x)
    const ly = Math.tan(y)

    const { a, b, c, d, e, f } = this

    this.a = a + b * lx
    this.b = b + a * ly
    this.c = c + d * lx
    this.d = d + c * ly
    this.e = e + f * lx - cy * lx
    this.f = f + e * ly - cx * ly

    return this
  }

  // SkewX
  skewX (x, cx, cy) {
    return this.skew(x, 0, cx, cy)
  }

  skewXO (x, cx, cy) {
    return this.skewO(x, 0, cx, cy)
  }

  // SkewY
  skewY (y, cx, cy) {
    return this.skew(0, y, cx, cy)
  }

  skewYO (y, cx, cy) {
    return this.skewO(0, y, cx, cy)
  }

  // Transform around a center point
  aroundO (cx, cy, matrix) {
    var dx = cx || 0
    var dy = cy || 0
    return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy)
  }

  around (cx, cy, matrix) {
    return this.clone().aroundO(cx, cy, matrix)
  }

  // Check if two matrices are equal
  equals (other) {
    var comp = new Matrix(other)
    return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b)
      && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d)
      && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f)
  }

  // Convert matrix to string
  toString () {
    return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
  }

  toArray () {
    return [ this.a, this.b, this.c, this.d, this.e, this.f ]
  }

  valueOf () {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    }
  }

  static fromArray (a) {
    return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
  }

  static isMatrixLike (o) {
    return (
      o.a != null
      || o.b != null
      || o.c != null
      || o.d != null
      || o.e != null
      || o.f != null
    )
  }

  static formatTransforms (o) {
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
  static matrixMultiply (l, r, o) {
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
}

export function ctm () {
  return new Matrix(this.node.getCTM())
}

export function screenCTM () {
  /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
     This is needed because FF does not return the transformation matrix
     for the inner coordinate system when getScreenCTM() is called on nested svgs.
     However all other Browsers do that */
  if (typeof this.isRoot === 'function' && !this.isRoot()) {
    var rect = this.rect(1, 1)
    var m = rect.node.getScreenCTM()
    rect.remove()
    return new Matrix(m)
  }
  return new Matrix(this.node.getScreenCTM())
}

register(Matrix, 'Matrix')
