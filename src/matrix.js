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
      var current = new SVG.Matrix(this)
      let { x: ox, y: oy } = new SVG.Point(t.ox, t.oy).transform(current)

      // Construct the resulting matrix
      var transformer = new SVG.Matrix()
        .translate(t.rx, t.ry)
        .lmultiply(current)
        .translate(-ox, -oy)
        .scale(t.scaleX, t.scaleY)
        .skew(t.skewX, t.skewY)
        .shear(t.shear)
        .rotate(t.theta)
        .translate(ox, oy)

      // If we want the origin at a particular place, we force it there
      if (isFinite(t.px) || isFinite(t.py)) {
        const origin = new SVG.Point(ox, oy).transform(transformer)
        // TODO: Replace t.px with isFinite(t.px)
        const dx = t.px ? t.px - origin.x : 0
        const dy = t.py ? t.py - origin.y : 0
        transformer = transformer.translate(dx, dy)
      }

      // Translate now after positioning
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
    decompose: function (cx = 0, cy = 0) {
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
