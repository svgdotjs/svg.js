SVG.G = function() {
  this.constructor.call(this, SVG.create('g'))
}

// Inherit from SVG.Container
SVG.G.prototype = new SVG.Container

SVG.extend(SVG.G, {
  // Move over x-axis
  x: function(x) {
    return this.transform('x', x)
  }
  // Move over y-axis
, y: function(y) {
    return this.transform('y', y)
  }
  // Get defs
, defs: function() {
    return this.doc().defs()
  }
  
})