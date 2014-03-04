SVG.Ellipse = SVG.invent({
  // Initialize node
  create: 'ellipse'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
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
    // Set width of element
  , width: function(width) {
      return width == null ? this.attr('rx') * 2 : this.attr('rx', new SVG.Number(width).divide(2))
    }
    // Set height of element
  , height: function(height) {
      return height == null ? this.attr('ry') * 2 : this.attr('ry', new SVG.Number(height).divide(2))
    }
    // Custom size function
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)

      return this.attr({
        rx: new SVG.Number(p.width).divide(2)
      , ry: new SVG.Number(p.height).divide(2)
      })
    }
    
  }

  // Add parent method
, construct: {
    // Create circle element, based on ellipse
    circle: function(size) {
      return this.ellipse(size, size)
    }
    // Create an ellipse
  , ellipse: function(width, height) {
      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
    }
    
  }

})