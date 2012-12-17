
SVG.Rect = function Rect() {
  this.constructor.call(this, SVG.create('rect'));
};

// inherit from SVG.Shape
SVG.Rect.prototype = new SVG.Shape();