
SVG.Path = function Path() {
  this.constructor.call(this, SVG.create('path'));
};

// inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape();

// Add path-specific functions
SVG.extend(SVG.Path, {
  
  // move using transform
  move: function(x, y) {
    this.transform({ x: x, y: y });
  },
  
  // set path data
  plot: function(d) {
    return this.attr('d', d || 'M0,0');
  }
  
});