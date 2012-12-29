
SVG.Ellipse = function Ellipse() {
  this.constructor.call(this, SVG.create('ellipse'));
};

// inherit from SVG.Shape
SVG.Ellipse.prototype = new SVG.Shape();

// Add ellipse-specific functions
SVG.extend(SVG.Ellipse, {
  
  // custom move function
  move: function(x, y) {
    this.attrs.x = x;
    this.attrs.y = y;
    
    return this.center();
  },

  // custom size function
  size: function(w, h) {
    return this.
      attr({ rx: w / 2, ry: (h != null ? h : w) / 2 }).
      center();
  },
  
  // position element by its center
  center: function(x, y) {
    return this.attr({
      cx: x || (this.attrs.x || 0) + (this.attrs.rx || 0),
      cy: y || (this.attrs.y || 0) + (this.attrs.ry || 0)
    });
  }
  
});
