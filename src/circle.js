
SVG.Circle = function Circle() {
  this.constructor.call(this, SVG.create('circle'));
};

// inherit from SVG.Shape
SVG.Circle.prototype = new SVG.Shape();

// Add circle-specific functions
SVG.extend(SVG.Circle, {
  
  // custom move function
  move: function(x, y) {
    this.attrs.x = x;
    this.attrs.y = y;
    this.center();

    return this;
  },

  // custom size function (no height value here!)
  size: function(w) {
    this.attr('r', w / 2);
    this.center();

    return this;
  },

  // position element by its center
  center: function(x, y) {
    var r = this.attrs.r || 0;

    this.attr('cx', x || ((this.attrs.x || 0) + r));
    this.attr('cy', y || ((this.attrs.y || 0) + r));
  }
  
});