SVG.Image = function() {
  this.constructor.call(this, SVG.create('image'))
}

// Inherit from SVG.Element
SVG.Image.prototype = new SVG.Shape

//
SVG.extend(SVG.Image, {
  // (re)load image
  load: function(url) {
    return (url ? this.attr('href', (this.src = url), SVG.xlink) : this)
  }
})

//
SVG.extend(SVG.Container, {
  // Create image element, load image and set its size
  image: function(source, width, height) {
    width = width != null ? width : 100
    return this.put(new SVG.Image().load(source).size(width, height != null ? height : width))
  }

})