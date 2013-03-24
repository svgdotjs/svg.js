
SVG.Clip = function Clip() {
  this.constructor.call(this, SVG.create('clipPath'))
}

// Inherit from SVG.Container
SVG.Clip.prototype = new SVG.Container

SVG.extend(SVG.Element, {
  
  // Distribute clipPath to svg element
  clipWith: function(element) {
    /* use given clip or create a new one */
    this.clip = element instanceof SVG.Clip ? element : this.parent.clip().add(element)
    
    return this.attr('clip-path', 'url(#' + this.clip.attr('id') + ')')
  }
  
})

// Add container method
SVG.extend(SVG.Container, {
  // Create clipping element
  clip: function() {
    return this.defs().put(new SVG.Clip)
  }
  
})
