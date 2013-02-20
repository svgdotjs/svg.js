//
SVG.Ellipse = function() {
  this.constructor.call(this, SVG.create('ellipse'))
}

// Inherit from SVG.Shape
SVG.Ellipse.prototype = new SVG.Shape()

//
SVG.extend(SVG.Ellipse, {
  // Custom move function
  move: function(x, y) {
    this.attrs.x = x
    this.attrs.y = y
    
    return this.center()
  },
  // Custom size function
  size: function(width, height) {
    return this.
      attr({ rx: width / 2, ry: (height != null ? height : width) / 2 }).
      center()
  },
  // Custom center function
  center: function(x, y) {
    return this.attr({
      cx: x || (this.attrs.x || 0) + (this.attrs.rx || 0),
      cy: y || (this.attrs.y || 0) + (this.attrs.ry || 0)
    })
  }
  
})

// Usage:

//     draw.ellipse(200, 100)