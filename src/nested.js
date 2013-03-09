SVG.Nested = function() {
  this.constructor.call(this, SVG.create('svg'))
  
  this.style('overflow', 'visible')
}

// Inherit from SVG.Container
SVG.Nested.prototype = new SVG.Container