SVG.Path = function(unbiased) {
  this.constructor.call(this, SVG.create('path'))
  
  this.unbiased = unbiased
}

// Inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape

SVG.extend(SVG.Path, {
  // Private: Native plot
  _plot: function(data) {
    return this.attr('d', data || 'M0,0')
  }
  
})