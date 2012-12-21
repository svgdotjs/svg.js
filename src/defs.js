
SVG.Defs = function Defs() {
  this.constructor.call(this, SVG.create('defs'));
};

// inherit from SVG.Element
SVG.Defs.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Defs, SVG.Container);