SVG.Rect = function() {
  this.constructor.call(this, SVG.create('rect'))
}

// Inherit from SVG.Shape
SVG.Rect.prototype = new SVG.Shape