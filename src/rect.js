SVG.Rect = function() {
  this.constructor.call(this, SVG.create('rect'))
}

// Inherit from SVG.Shape
SVG.Rect.prototype = new SVG.Shape

//
SVG.extend(SVG.Container, {
  // Create a rect element
  rect: function(width, height) {
    return this.put(new SVG.Rect().size(width, height))
  }

})