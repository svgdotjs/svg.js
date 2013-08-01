SVG.Polyline = function() {
  this.constructor.call(this, SVG.create('polyline'))
}

// Inherit from SVG.Shape
SVG.Polyline.prototype = new SVG.Shape

SVG.Polygon = function() {
  this.constructor.call(this, SVG.create('polygon'))
}

// Inherit from SVG.Shape
SVG.Polygon.prototype = new SVG.Shape

// Add polygon-specific functions
SVG.extend(SVG.Polyline, SVG.Polygon, {
  // Define morphable array
  morphArray:  SVG.PointArray
  // Plot new path
, plot: function(p) {
    return this.attr('points', (this.points = new SVG.PointArray(p, [[0,0]])))
  }
  // Move by left top corner
, move: function(x, y) {
    return this.attr('points', this.points.move(x, y))
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
    return this.attr('points', this.points.size(width, height))
  }

})

//
SVG.extend(SVG.Container, {
  // Create a wrapped polyline element
  polyline: function(p) {
    return this.put(new SVG.Polyline).plot(p)
  }
  // Create a wrapped polygon element
, polygon: function(p) {
    return this.put(new SVG.Polygon).plot(p)
  }

})