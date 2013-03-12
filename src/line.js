SVG.Line = function() {
  this.constructor.call(this, SVG.create('line'))
}

// Inherit from SVG.Shape
SVG.Line.prototype = new SVG.Shape

// Add required methods
SVG.extend(SVG.Line, {
  // Move over x-axis
  x: function(x) {
    var b = this.bbox()
    
    return this.attr({
      x1: this.attrs.x1 - b.x + x
    , x2: this.attrs.x2 - b.x + x
    })
  }
  // Move over y-axis
, y: function(y) {
    var b = this.bbox()
    
    return this.attr({
      y1: this.attrs.y1 - b.y + y
    , y2: this.attrs.y2 - b.y + y
    })
  }
  // Move by center over x-axis
, cx: function(x) {
    return this.x(x - this.bbox().width / 2)
  }
  // Move by center over y-axis
, cy: function(y) {
    return this.y(y - this.bbox().height / 2)
  }
  // Set line size by width and height
, size: function(width, height) {
    var b = this.bbox()
    
    return this
      .attr(this.attrs.x1 < this.attrs.x2 ? 'x2' : 'x1', b.x + width)
      .attr(this.attrs.y1 < this.attrs.y2 ? 'y2' : 'y1', b.y + height)
  }
  
})