SVG.Image = SVG.invent({
  // Initialize node
  create: 'image'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // (re)load image
    load: function(url) {
      return (url ? this.attr('href', (this.src = url), SVG.xlink) : this)
    }
  }
  
  // Add parent method
, construct: {
    // Create image element, load image and set its size
    image: function(source, width, height) {
      width = width != null ? width : 100
      return this.put(new SVG.Image().load(source).size(width, height != null ? height : width))
    }
  }
})