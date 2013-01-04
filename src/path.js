SVG.Path = function Path() {
  this.constructor.call(this, SVG.create('path'));
};

// Inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape();

SVG.extend(SVG.Path, {
  
  /* move using transform */
  move: function(x, y) {
    this.transform({
      x: x,
      y: y
    });
  },
  
  /* set path data */
  plot: function(data) {
    return this.attr('d', data || 'M0,0');
  }
  
});