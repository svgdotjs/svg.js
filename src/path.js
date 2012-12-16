
SVG.Path = function Path() {
  this.constructor.call(this, SVG.createElement('path'));
};

// inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape();

// set path data
SVG.Path.prototype.data = function(d) {
  this.setAttribute('d', d);
  return this;
};