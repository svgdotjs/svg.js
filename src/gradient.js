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
      this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
      this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
  }
  // To position
, to: function(x, y) {
    return this.type == 'radial' ?
      this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
      this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
  }
  // Radius for radial gradient
, radius: function(r) {
    return this.type == 'radial' ?
      this.attr({ r: new SVG.Number(r) }) :
      this
  }
  // Add a color stop
, at: function(stop) {
    return this.put(new SVG.Stop(stop))
  }
  // Update gradient
, update: function(block) {
    /* remove all stops */
    this.clear()
    
    /* invoke passed block */
    block(this)
    
    return this
  }
  // Return the fill id
, fill: function() {
    return 'url(#' + this.attr('id') + ')'
  }
  // Alias string convertion to fill
, toString: function() {
    return this.fill()
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

//
SVG.extend(SVG.Container, {
  // Create gradient element in defs
  gradient: function(type, block) {
    return this.defs().gradient(type, block)
  }
  
})


SVG.Stop = function(stop) {
  this.constructor.call(this, SVG.create('stop'))
  
  /* immediatelly build stop */
  this.update(stop)
}

// Inherit from SVG.Element
SVG.Stop.prototype = new SVG.Element

//
SVG.extend(SVG.Stop, {
  // add color stops
  update: function(o) {
    /* set attributes */
    if (o.opacity != null) this.attr('stop-opacity', o.opacity)
    if (o.color   != null) this.attr('stop-color', o.color)
    if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))

    return this
  }
  
})

