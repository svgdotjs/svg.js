SVG.G = SVG.invent({
  // Initialize node
  create: 'g',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    // Move over x-axis
    x: function (x) {
      return x == null ? this.transform().e : this.translate(x - this.gbox().x, 0)
    },
    // Move over y-axis
    y: function (y) {
      return y == null ? this.transform().f : this.translate(0, y - this.gbox().y)
    },
    // Move by center over x-axis
    cx: function (x) {
      return x == null ? this.gbox().cx : this.x(x - this.gbox().width / 2)
    },
    // Move by center over y-axis
    cy: function (y) {
      return y == null ? this.gbox().cy : this.y(y - this.gbox().height / 2)
    },
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
