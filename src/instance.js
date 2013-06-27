SVG.Use = function() {
  this.constructor.call(this, SVG.create('use'))
}

// Inherit from SVG.Shape
SVG.Use.prototype = new SVG.Element

//
SVG.extend(SVG.Use, {
  
  // (re)load image
  load: function(url) {
    return (url ? this.attr('xlink:href', (this.src = url), SVG.xlink) : this)
  }
  
})

//
SVG.extend(SVG.Container, {
  // Create a use element
  use: function(element) {
    if (element instanceof SVG.Element)
      element = element.id

    return this.put(new SVG.Use().)
  }

})