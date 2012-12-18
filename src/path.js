
SVG.Path = function Path() {
  this.constructor.call(this, SVG.create('path'));
};

// inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape();

// Add path-specific functions
SVG.extend(SVG.Path, {
  
  // set path data
  data: function(d) {
    this.attr('d', d);
    return this;
  }
  
});