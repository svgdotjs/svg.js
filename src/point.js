
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
