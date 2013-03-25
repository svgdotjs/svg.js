SVG.Clip = function() {
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