// ### This module accounts for the main svg document

//
SVG.Doc = function(element) {
  this.constructor.call(this, SVG.create('svg'))
  
  /* ensure the presence of a html element */
  this.parent = typeof element == 'string' ?
    document.getElementById(element) :
    element
  
  /* set svg element attributes and create the <defs> node */
  this
    .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
    .attr('xlink', SVG.xlink, SVG.ns)
    .defs()
  
  /* ensure correct rendering for safari */
  this.stage()
}

// Inherits from SVG.Container
SVG.Doc.prototype = new SVG.Container

// Hack for safari preventing text to be rendered in one line.
// Basically it sets the position of the svg node to absolute
// when the dom is loaded, and resets it to relative a few milliseconds later.
SVG.Doc.prototype.stage = function() {
  var check,
      element = this,
      wrapper = document.createElement('div')
  
  /* set temp wrapper to position relative */
  wrapper.style.cssText = 'position:relative;height:100%;'
  
  /* put element into wrapper */
  element.parent.appendChild(wrapper)
  wrapper.appendChild(element.node)
  
  /* check for dom:ready */
  check = function() {
    if (document.readyState === 'complete') {
      element.attr('style', 'position:absolute;')
      setTimeout(function() {
        /* set position back to relative */
        element.attr('style', 'position:relative;')
        
        /* remove temp wrapper */
        element.parent.removeChild(element.node.parentNode)
        element.node.parentNode.removeChild(element.node)
        element.parent.appendChild(element.node)
        
      }, 5)
    } else {
      setTimeout(check, 10)
    }
  }
  
  check()
  
  return this
}