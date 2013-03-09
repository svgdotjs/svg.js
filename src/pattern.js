SVG.Pattern = function(type) {
  this.constructor.call(this, SVG.create('pattern'))
}

// Inherit from SVG.Container
SVG.Pattern.prototype = new SVG.Container

//
SVG.extend(SVG.Pattern, {
  // Return the fill id
  fill: function() {
    return 'url(#' + this.attr('id') + ')'
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
      x:            0
    , y:            0
    , width:        width
    , height:       height
    , patternUnits: 'userSpaceOnUse'
    })
  }
  
});