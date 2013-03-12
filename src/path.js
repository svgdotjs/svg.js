SVG.Path = function() {
  this.constructor.call(this, SVG.create('path'))
}

// Inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape()

SVG.extend(SVG.Path, {
  // Move over x-axis
  x: function(x) {
    return this.transform('x', x)
  }
  // Move over y-axis
, y: function(y) {
    return this.transform('y', y)
  }
  // Set path data
, plot: function(data) {
    return this.attr('d', data || 'M0,0')
  }
  
})