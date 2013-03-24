SVG.Gradient = function(type) {
  this.constructor.call(this, SVG.create(type + 'Gradient'))
  
  /* store type */
  this.type = type
}

// Inherit from SVG.Container
SVG.Gradient.prototype = new SVG.Container

//
SVG.extend(SVG.Gradient, {
  // From position
  from: function(x, y) {
    return this.type == 'radial' ?
      this.attr({ fx: x + '%', fy: y + '%' }) :
      this.attr({ x1: x + '%', y1: y + '%' })
  }
  // To position
, to: function(x, y) {
    return this.type == 'radial' ?
      this.attr({ cx: x + '%', cy: y + '%' }) :
      this.attr({ x2: x + '%', y2: y + '%' })
  }
  // Radius for radial gradient
, radius: function(radius) {
    return this.type == 'radial' ?
      this.attr({ r: radius + '%' }) :
      this
  }
  // Add a color stop
, at: function(stop) {
    return this.put(new SVG.Stop(stop))
  }
  // Update gradient
, update: function(block) {
    /* remove all stops */
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild)
    
    /* invoke passed block */
    block(this)
    
    return this
  }
  // Return the fill id
, fill: function() {
    return 'url(#' + this.attr('id') + ')'
  }
  
})

//
SVG.extend(SVG.Defs, {
  // define gradient
  gradient: function(type, block) {
    var element = this.put(new SVG.Gradient(type))
    
    /* invoke passed block */
    block(element)
    
    return element
  }
  
})


SVG.Stop = function(stop) {
  this.constructor.call(this, SVG.create('stop'))
  
  /* immediatelly build stop */
  this.update(stop)
}

// Inherit from SVG.Element
SVG.Stop.prototype = new SVG.Element()

//
SVG.extend(SVG.Stop, {
  // add color stops
  update: function(o) {
    var index
      , attr = ['opacity', 'color']
    
    /* build style attribute */
    for (index = attr.length - 1; index >= 0; index--)
      if (o[attr[index]] != null)
        this.style('stop-' + attr[index], o[attr[index]])
    
    /* set attributes */
    return this.attr('offset', (o.offset != null ? o.offset : this.attr('offset')) + '%')
  }
  
})

