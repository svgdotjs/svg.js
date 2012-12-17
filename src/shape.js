
SVG.Shape = function Shape(element) {
  this.constructor.call(this, element);
};

// inherit from SVG.Element
SVG.Shape.prototype = new SVG.Element();