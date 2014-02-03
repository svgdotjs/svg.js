//
SVG.extend(SVG.Element, SVG.FX, {
  // Relative methods
  relative: function() {
    var b, e = this

    return {
      // Move over x axis
      x: function(x) {
        b = e.bbox()

        return e.x(b.x + (x || 0))
      }
      // Move over y axis
    , y: function(y) {
        b = e.bbox()

        return e.y(b.y + (y || 0))
      }
      // Move over x and y axes
    , move: function(x, y) {
        this.x(x)
        return this.y(y)
      }
    }
  }

})