
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
    
    return this.center();
  },

  // custom size function (no height value here!)
  size: function(w) {
    return this.attr('r', w / 2).center();
  },

  // position element by its center
  center: function(x, y) {
    var r = this.attrs.r || 0;

    return this.attr({
      cx: (x || ((this.attrs.x || 0) + r)),
      cy: (y || ((this.attrs.y || 0) + r))
    });
  }
  
});