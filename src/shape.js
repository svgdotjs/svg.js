SVG.Shape = function(element) {
  this.constructor.call(this, element)
}

// Inherit from SVG.Element
SVG.Shape.prototype = new SVG.Element