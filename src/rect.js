
SVG.Rect = function Rect() {
  this.constructor.call(this, SVG.createElement('rect'));
};

// inherit from SVG.Shape
SVG.Rect.prototype = new SVG.Shape();