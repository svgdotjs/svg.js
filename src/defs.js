// ### The defs node

//
SVG.Defs = function() {
  this.constructor.call(this, SVG.create('defs'))
}

// Inherits from SVG.Container
SVG.Defs.prototype = new SVG.Container