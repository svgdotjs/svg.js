//
SVG.Ellipse = function() {
  this.constructor.call(this, SVG.create('ellipse'))
}

// Inherit from SVG.Shape
SVG.Ellipse.prototype = new SVG.Shape

//
SVG.extend(SVG.Ellipse, {
  // Move over x-axis
  x: function(x) {
    return x == null ? this.cx() - this.attr('rx') : this.cx(x + this.attr('rx'))
  }
  // Move over y-axis
, y: function(y) {
    return y == null ? this.cy() - this.attr('ry') : this.cy(y + this.attr('ry'))
  }
  // Move by center over x-axis
, cx: function(x) {
    return x == null ? this.attr('cx') : this.attr('cx', new SVG.Number(x).divide(this.trans.scaleX))
  }
  // Move by center over y-axis
, cy: function(y) {
    return y == null ? this.attr('cy') : this.attr('cy', new SVG.Number(y).divide(this.trans.scaleY))
  }
  // Custom size function
, size: function(width, height) {
    return this.attr({
      rx: new SVG.Number(width).divide(2)
    , ry: new SVG.Number(height).divide(2)
    })
  }
  
})

//
SVG.extend(SVG.Container, {
  // Create circle element, based on ellipse
  circle: function(size) {
    return this.ellipse(size, size)
  }
  // Create an ellipse
, ellipse: function(width, height) {
    return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
  }
  
})

// Usage:

//     draw.ellipse(200, 100)