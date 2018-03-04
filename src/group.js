SVG.G = SVG.invent({
  // Initialize node
  create: 'g',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    gbox: function () {
      var bbox = this.bbox()
      var trans = this.transform()

      bbox.x += trans.e
      bbox.x2 += trans.e
      bbox.cx += trans.e

      bbox.y += trans.f
      bbox.y2 += trans.f
      bbox.cy += trans.f

      return bbox
    }
  },

  // Add parent method
  construct: {
    // Create a group element
    group: function () {
      return this.put(new SVG.G())
    }
  }
})
