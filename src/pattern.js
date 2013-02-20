SVG.Pattern = function(type) {
  this.constructor.call(this, SVG.create('pattern'))
  
  /* set unique id */
  this.attr('id', (this.id = 'svgjs_element_' + (SVG.did++)))
}

// Inherit from SVG.Container
SVG.Pattern.prototype = new SVG.Container

//
SVG.extend(SVG.Pattern, {
  // Return the fill id
  fill: function() {
    return 'url(#' + this.id + ')'
  }
  
})

//
SVG.extend(SVG.Defs, {
  
  /* define gradient */
  pattern: function(width, height, block) {
    var element = this.put(new SVG.Pattern())
    
    /* invoke passed block */
    block(element)
    
    return element.attr({
      x:            0,
      y:            0,
      width:        width,
      height:       height,
      patternUnits: 'userSpaceOnUse'
    })
  }
  
});