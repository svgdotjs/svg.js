SVG.Use = function() {
  this.constructor.call(this, SVG.create('use'))
}

// Inherit from SVG.Shape
SVG.Use.prototype = new SVG.Shape

//
SVG.extend(SVG.Use, {
  // Use element as a reference
  element: function(element) {
    /* store target element */
    this.target = element

    /* set lined element */
    return this.attr('href', '#' + element, SVG.xlink)
  }
  
})

//
SVG.extend(SVG.Container, {
  // Create a use element
  use: function(element) {
    return this.put(new SVG.Use).element(element)
  }

})