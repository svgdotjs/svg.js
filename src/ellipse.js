
SVG.Ellipse = function Ellipse() {
  this.constructor.call(this, SVG.create('ellipse'));
};

// inherit from SVG.Shape
SVG.Ellipse.prototype = new SVG.Shape();

// Add ellipse-specific functions
SVG.Utils.merge(SVG.Ellipse, {
  
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

  center: function(cx, cy) {
    this.attr('cx', cx || ((this.attrs.x || 0) + (this.attrs.rx || 0)));
    this.attr('cy', cy || ((this.attrs.y || 0) + (this.attrs.ry || 0)));
  }
  
});
