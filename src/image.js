SVG.Image = function() {
  this.constructor.call(this, SVG.create('image'))
}

// Inherit from SVG.Element
SVG.Image.prototype = new SVG.Shape

SVG.extend(SVG.Image, {
  
  // (re)load image
  load: function(url) {
    return (url ? this.attr('xlink:href', (this.src = url), SVG.xlink) : this)
  }
  
})