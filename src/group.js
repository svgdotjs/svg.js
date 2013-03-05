SVG.G = function() {
  this.constructor.call(this, SVG.create('g'))
}

// Inherit from SVG.Container
SVG.G.prototype = new SVG.Container

SVG.extend(SVG.G, {
  // Move using translate
  move: function(x, y) {
    return this.transform({
      x: x
    , y: y
    })
  }
  // Get defs
, defs: function() {
    return this.doc().defs()
  }
  
})