SVG.Container = function(element) {
  this.constructor.call(this, element)
}

// Inherit from SVG.Parent
SVG.Container.prototype = new SVG.Parent

//
SVG.extend(SVG.Container, {
  // Get the viewBox and calculate the zoom value
  viewbox: function(v) {
    if (arguments.length == 0)
      /* act as a getter if there are no arguments */
      return new SVG.ViewBox(this)
    
    /* otherwise act as a setter */
    v = arguments.length == 1 ?
      [v.x, v.y, v.width, v.height] :
      [].slice.call(arguments)
    
    return this.attr('viewBox', v)
  }
  
})