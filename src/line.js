SVG.Line = function() {
  this.constructor.call(this, SVG.create('line'))
}

// Inherit from SVG.Shape
SVG.Line.prototype = new SVG.Shape()

// Add required methods
SVG.extend(SVG.Line, {
  // Move line
  move: function(x, y) {
    var bbox = this.bbox()
    
    return this.attr({
      x1: this.attr('x1') - bbox.x + x
    , y1: this.attr('y1') - bbox.y + y
    , x2: this.attr('x2') - bbox.x + x
    , y2: this.attr('y2') - bbox.y + y
    })
  }
  // Move element by its center
, center: function(x, y) {
    var bbox = this.bbox()
    
    return this.move(x - bbox.width / 2, y - bbox.height / 2)
  }
  // Set line size by width and height
, size: function(width, height) {
    var bbox = this.bbox()
    
    return this
      .attr(this.attr('x1') < this.attr('x2') ? 'x2' : 'x1', bbox.x + width)
      .attr(this.attr('y1') < this.attr('y2') ? 'y2' : 'y1', bbox.y + height)
  }
})

// Extend all container modules
SVG.extend(SVG.Container, {
  line: function(x1, y1, x2, y2) {
    return this.put(new SVG.Line().attr({
      x1: x1
    , y1: y1
    , x2: x2
    , y2: y2
    }))
  }
})