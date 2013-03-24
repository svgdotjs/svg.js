SVG.Mask = function() {
  this.constructor.call(this, SVG.create('mask'))
}

// Inherit from SVG.Container
SVG.Mask.prototype = new SVG.Container

SVG.extend(SVG.Element, {
  // Distribute mask to svg element
  maskWith: function(element) {
    /* use given mask or create a new one */
    this.mask = element instanceof SVG.Mask ? element : this.parent.mask().add(element)
    
    return this.attr('mask', 'url(#' + this.mask.attr('id') + ')')
  }
  
})