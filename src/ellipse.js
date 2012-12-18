
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
    this.center();

    return this;
  },

  // custom size function
  size: function(w, h) {
    this.attr('rx', w / 2);
    this.attr('ry', h / 2);
    this.center();

    return this; 
  },
  
  // position element by its center
  center: function(x, y) {
    this.attr('cx', x || ((this.attrs.x || 0) + (this.attrs.rx || 0)));
    this.attr('cy', y || ((this.attrs.y || 0) + (this.attrs.ry || 0)));
  }
  
});
