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

    clone: function () {
      return new SVG.Matrix(this)
    },

    // Clone matrix
    affine: function (o) {
      // Get all of the parameters required to form the matrix
      var flipX = o.flip && (o.flip === 'x' || o.flip === 'both') ? -1 : 1
      var flipY = o.flip && (o.flip === 'y' || o.flip === 'both') ? -1 : 1
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
      var theta = o.rotate || 0
      var ox = o.origin && o.origin.length ? o.origin[0] : o.ox || 0
      var oy = o.origin && o.origin.length ? o.origin[1] : o.oy || 0
      var px = o.position && o.position.length ? o.position[0] : o.px
      var py = o.position && o.position.length ? o.position[1] : o.py
      var tx = o.translate && o.translate.length ? o.translate[0] : o.tx || 0
      var ty = o.translate && o.translate.length ? o.translate[1] : o.ty || 0

      // Construct the resulting matrix
      var transformer = new SVG.Matrix()
        .translate(-ox, -oy)
        .scale(scaleX, scaleY)
        .skew(skewX, skewY)
        .shear(shear)
        .rotate(theta)
        .translate(ox, oy)
        .translate(tx, ty)
        .lmultiply(new SVG.Matrix(this))

      // If we want the origin at a particular place, we force it there
      if (isFinite(px) && isFinite(py)) {
        // Figure out where the origin went and the delta to get there
        var p = new SVG.Point(ox - tx, oy - ty).transform(transformer)
        var dx = px - p.x
        var dy = py - p.y

        // Apply another translation
        transformer = transformer.translate(dx, dy)
      }
      return transformer
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

    // Left multiplies by the given matrix
    multiply: function (matrix) {
      // Get the matrices
      var l = this
      var r = parseMatrix(matrix)

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
      var l = parseMatrix(matrix)
      return l.multiply(this)
    },

    // Inverses matrix
    inverse: function () {
      return new SVG.Matrix(this.native().inverse())
    },

    // Translate matrix
    translate: function (x, y) {
      var translation = new SVG.Matrix(this)
      translation.e += x || 0
      translation.f += y || 0
      return translation
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
      var shear = new SVG.Matrix(1, a, 0, 1, 0, 0)
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
      var comp = parseMatrix(other)
      return closeEnough(this.a, comp.a)
        && closeEnough(this.b, comp.b)
        && closeEnough(this.c, comp.c)
        && closeEnough(this.d, comp.d)
        && closeEnough(this.e, comp.e)
        && closeEnough(this.f, comp.f)
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
