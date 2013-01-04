// ### The defs node

//
SVG.Defs = function Defs() {
  this.constructor.call(this, SVG.create('defs'));
};

// Inherits from SVG.Element
SVG.Defs.prototype = new SVG.Element();

// Include the container object
SVG.extend(SVG.Defs, SVG.Container);