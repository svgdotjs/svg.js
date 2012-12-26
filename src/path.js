
SVG.Path = function Path() {
  this.constructor.call(this, SVG.create('path'));
};

// inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape();

// Add path-specific functions
SVG.extend(SVG.Path, {
  
  // set path data
  plot: function(d) {
    return this.attr('d', d);
  },
  
  // move path using translate
  move: function(x, y) {
    return this.transform('translate(' + x + ',' + y + ')');
  }
  
});