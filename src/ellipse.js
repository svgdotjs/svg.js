//
SVG.Ellipse = function() {
  this.constructor.call(this, SVG.create('ellipse'))
}

// Inherit from SVG.Shape
SVG.Ellipse.prototype = new SVG.Shape

//
SVG.extend(SVG.Ellipse, {
  // Move over x-axis
  x: function(x) {
    return x == null ? this.cx() - this.attr('rx') : this.cx(x + this.attr('rx'))
  }
  // Move over y-axis
, y: function(y) {
    return y == null ? this.cy() - this.attr('ry') : this.cy(y + this.attr('ry'))
  }
  // Move by center over x-axis
, cx: function(x) {
    return x == null ? this.attr('cx') : this.attr('cx', x / this.trans.scaleX)
  }
  // Move by center over y-axis
, cy: function(y) {
    return y == null ? this.attr('cy') : this.attr('cy', y / this.trans.scaleY)
  }
  // Custom size function
, size: function(width, height) {
    return this.attr({
      rx: width / 2,
      ry: height / 2
    })
  }
  
})

// Usage:

//     draw.ellipse(200, 100)