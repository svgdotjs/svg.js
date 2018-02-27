/* global abcdef, arrayToMatrix, parseMatrix, unitCircle, mag */

SVG.Matrix = SVG.invent({
  // Initialize
  create: function (source) {
    var base = arrayToMatrix([1, 0, 0, 1, 0, 0])
    var i

    // ensure source as object
    source = source instanceof SVG.Element ? source.matrixify()
      : typeof source === 'string' ? arrayToMatrix(source.split(SVG.regex.delimiter).map(parseFloat))
      : arguments.length === 6 ? arrayToMatrix([].slice.call(arguments))
      : Array.isArray(source) ? arrayToMatrix(source)
      : typeof source === 'object' ? source
      : base

    // merge source
    for (i = abcdef.length - 1; i >= 0; --i) {
      this[abcdef[i]] = source[abcdef[i]] != null
        ? source[abcdef[i]]
        : base[abcdef[i]]
    }
  },

  // Add methods
  extend: {

    // Convert an object of affine parameters into a matrix
    compose: function (o, cx, cy) {
      // Set the defaults
      var tx = o.translateX || 0
      var ty = o.translateY || 0
      var theta = o.theta || 0
      var sx = o.scaleX || 1
      var sy = o.scaleY || 1
      var lam = o.shear || 0
      cx = cx || 0
      cy = cy || 0

      // Calculate the trigonometric values
      var ct = Math.cos(theta * Math.PI / 180)
      var st = Math.sin(theta * Math.PI / 180)

      // Calculate the matrix components directly
      var a = sx * ct
      var b = sx * st
      var c = lam * sx * ct - sy * st
      var d = lam * sx * st + sy * ct
      var e = -sx * ct * (cx + cy * lam) + sy * st * cy + tx + cx
      var f = -sx * st * (cx + cy * lam) - sy * ct * cy + ty + cy

      // Construct a new matrix and return it
      var matrix = new SVG.Matrix([a, b, c, d, e, f])
      return matrix
    },
    // Decompose a matrix into the affine parameters needed to form it
    decompose: function (matrix, cx, cy) {
      // Get the paramaters of the current matrix
      var a = matrix.a
      var b = matrix.b
      var c = matrix.c
      var d = matrix.d
      var e = matrix.e
      var f = matrix.f

      // Project the first basis vector onto the unit circle
      var circle = unitCircle(a, b)
      var theta = circle.theta
      var ct = circle.cos
      var st = circle.sin

      // Work out the transformation parameters
      var signX = Math.sign(a * ct + b * st)
      var sx = signX * mag(a, b)
      var lam = (st * d + ct * c) / (ct * a + st * b)
      var sy = mag(lam * a - c, d - lam * b)
      var tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy)
      var ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy)

      // Package and return the parameters
      return {

        // Bundle the affine parameters
        translateX: tx,
        translateY: ty,
        theta: theta,
        scaleX: sx,
        scaleY: sy,
        shear: lam,

      // Bundle the matrix parameters
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f,

      // Return the new origin point
        x: this.e,
        y: this.f,
        matrix: new SVG.Matrix(this)
      }
    },
    // Clone matrix
    form: function (o) {
      // Get all of the parameters required to form the matrix
      var flipX = o.flip && (o.flip === 'x' || o.flip === 'both') ? -1 : 1
      var flipY = o.flip && (o.flip === 'y' || o.flip === 'both') ? -1 : 1
      var skewX = o.skew.length ? o.skew[0]
        : isFinite(o.skew) ? o.skew
        : isFinite(o.skewX) ? o.skewX
        : 0
      var skewY = o.skew.length ? o.skew[1]
        : isFinite(o.skew) ? o.skew
        : isFinite(o.skewY) ? o.skewY
        : 0
      var sx = o.scale.length ? o.scale[0] * flipX
        : isFinite(o.scale) ? o.scale * flipX
        : isFinite(o.scaleX) ? o.scaleX * flipX
        : flipX
      var sy = o.scale.length ? o.scale[1] * flipY
        : isFinite(o.scale) ? o.scale * flipY
        : isFinite(o.scaleY) ? o.scaleY * flipY
        : flipY
      var kx = Math.tan(SVG.utils.radians(skewX))
      var ky = Math.tan(SVG.utils.radians(skewY))
      var lam = o.shear || 0
      var theta = SVG.utils.radians(o.rotate || 0)
      var st = Math.sin(theta)
      var ct = Math.cos(theta)
      var ox = o.origin.length ? o.origin[0] : o.ox || 0
      var oy = o.origin.length ? o.origin[1] : o.oy || 0
      var px = o.position.length ? o.position[0] : o.px || ox
      var py = o.position.length ? o.position[1] : o.py || oy
      var tx = o.translate.length ? o.translate[0] : o.tx || 0
      var ty = o.translate.length ? o.translate[1] : o.ty || 0

    // Form the matrix parameters... aka. welcome to wonderland! (used wolfram)
      var a = ct * sx + ky * st * sy
      var b = ct * ky * sy - st * sx
      var c = ct * kx * sx + st * sy + lam * (ct * sx + ky * st * sy)
      var d = -kx * st * sx + ct * sy + lam * (-st * sx + ct * ky * sy)
      var e = px + tx + ox * (ct * sx + ky * st * sy) + oy * (ct * kx * sx + st * sy + lam * (ct * sx + ky * st * sy))
      var f = py + ty + ox * (-st * sx + ct * ky * sy) + oy * (-kx * st * sx + ct * sy + lam * (-st * sx + ct * ky * sy))
      var result = new SVG.Matrix(a, b, c, d, e, f)
      return result
    },
    clone: function () {
      return new SVG.Matrix(this)
    },
    // Morph one matrix into another
    morph: function (matrix) {
      // store new destination
      this.destination = new SVG.Matrix(matrix)

      return this
    },
    // Get morphed matrix at a given position
    at: function (pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // calculate morphed matrix at a given position
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
    // Multiplies by given matrix
    multiply: function (matrix) {
      return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()))
    },
    // Inverses matrix
    inverse: function () {
      return new SVG.Matrix(this.native().inverse())
    },
    // Translate matrix
    translate: function (x, y) {
      var translation = new SVG.Matrix(this.native().translate(x || 0, y || 0))
      var matrix = this.multiply(translation)
      return matrix
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

      // Rotate the current matrix
      var scale = new SVG.Matrix(x, 0, 0, y, 0, 0)
      var centered = this.around(cx, cy, scale)
      var matrix = this.multiply(centered)
      return matrix
    },
    // Rotate matrix
    rotate: function (r, cx, cy) {
      // Convert degrees to radians
      r = SVG.utils.radians(r)

      // Construct the rotation matrix
      var rotation = new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0)
      var centered = this.around(cx, cy, rotation)
      var matrix = this.multiply(centered)
      return matrix
    },
    // Flip matrix on x or y, at a given offset
    flip: function (a, o) {
      return a === 'x' ? this.scale(-1, 1, o, 0)
        : a === 'y' ? this.scale(1, -1, 0, o)
        : this.scale(-1, -1, a, o != null ? o : a)
    },
    // Skew
    shear: function (a, cx, cy) {
      var shear = new SVG.Matrix(1, a, 0, 1, 0, 0)
      var centered = this.around(cx, cy, shear)
      var matrix = this.multiply(centered)
      return matrix
    },
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
      var centered = this.around(cx, cy, skew)
      var matrix = this.multiply(centered)
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
      return this
        .multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
        .multiply(matrix)
        .multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
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
    // Convert matrix to string
    toString: function () {
      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
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
      if (this instanceof SVG.Nested) {
        var rect = this.rect(1, 1)
        var m = rect.node.getScreenCTM()
        rect.remove()
        return new SVG.Matrix(m)
      }
      return new SVG.Matrix(this.node.getScreenCTM())
    }
  }
})
