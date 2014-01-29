SVG.Path = function() {
  this.constructor.call(this, SVG.create('path'))
}

// Inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape

SVG.extend(SVG.Path, {
  // Plot new poly points
  plot: function(p) {
    return this.attr('d', (this.array = new SVG.PathArray(p, [{ type:'M',x:0,y:0 }])))
  }
  // Move by left top corner
, move: function(x, y) {
    return this.attr('d', this.array.move(x, y))
  }
  // Move by left top corner over x-axis
, x: function(x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  }
  // Move by left top corner over y-axis
, y: function(y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  }
  // Set element size to given width and height
, size: function(width, height) {
    var p = this._proportionalSize(width, height)
    
    return this.attr('d', this.array.size(p.width, p.height))
  }
  // Set width of element
, width: function(width) {
    return width == null ? this.bbox().width : this.size(width, this.bbox().height)
  }
  // Set height of element
, height: function(height) {
    return height == null ? this.bbox().height : this.size(this.bbox().width, height)
  }

})

//
SVG.extend(SVG.Container, {
  // Create a wrapped path element
  path: function(d) {
    return this.put(new SVG.Path).plot(d)
  }

})