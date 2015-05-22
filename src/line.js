SVG.Line = SVG.invent({
  // Initialize node
  create: 'line'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      var b = this.bbox()
      
      return x == null ? b.x : this.attr({
        x1: this.attr('x1') - b.x + x
      , x2: this.attr('x2') - b.x + x
      })
    }
    // Move over y-axis
  , y: function(y) {
      var b = this.bbox()
      
      return y == null ? b.y : this.attr({
        y1: this.attr('y1') - b.y + y
      , y2: this.attr('y2') - b.y + y
      })
    }
    // Move by center over x-axis
  , cx: function(x) {
      var half = this.bbox().width / 2
      return x == null ? this.x() + half : this.x(x - half)
    }
    // Move by center over y-axis
  , cy: function(y) {
      var half = this.bbox().height / 2
      return y == null ? this.y() + half : this.y(y - half)
    }
    // Set width of element
  , width: function(width) {
      var b = this.bbox()

      return width == null ? b.width : this.attr(this.attr('x1') < this.attr('x2') ? 'x2' : 'x1', b.x + width)
    }
    // Set height of element
  , height: function(height) {
      var b = this.bbox()

      return height == null ? b.height : this.attr(this.attr('y1') < this.attr('y2') ? 'y2' : 'y1', b.y + height)
    }
    // Set line size by width and height
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)

      return this.width(p.width).height(p.height)
    }
    // Set path data
  , plot: function(x1, y1, x2, y2) {
      return this.attr({
        x1: x1
      , y1: y1
      , x2: x2
      , y2: y2
      })
    }
  }
  
  // Add parent method
, construct: {
    // Create a line element
    line: function(x1, y1, x2, y2) {
      return this.put(new SVG.Line().plot(x1, y1, x2, y2))
    }
  }
})
