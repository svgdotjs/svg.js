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
    return this.cx(x + this.attrs.rx)
  }
  // Move over y-axis
, y: function(y) {
    return this.cy(y + this.attrs.ry)
  }
  // Move by center over x-axis
, cx: function(x) {
    return this.attr('cx', x)
  }
  // Move by center over y-axis
, cy: function(y) {
    return this.attr('cy', y)
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