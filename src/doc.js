// ### This module accounts for the main svg document

//
SVG.Doc = function(element) {
  /* ensure the presence of a html element */
  this.parent = typeof element == 'string' ?
    document.getElementById(element) :
    element
  
  /* set svg element attributes and create the <defs> node */
  this.constructor
    .call(this, this.parent.nodeName == 'svg' ? this.parent : SVG.create('svg'))
  
  this
    .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
    .attr('xlink', SVG.xlink, SVG.ns)
    .defs()
  
  /* ensure correct rendering */
  if (this.parent.nodeName != 'svg')
    this.stage()
}

// Inherits from SVG.Container
SVG.Doc.prototype = new SVG.Container

// Hack for safari preventing text to be rendered in one line.
// Basically it sets the position of the svg node to absolute
// when the dom is loaded, and resets it to relative a few milliseconds later.
// Also handles sub-pixel offset rendering properly.
SVG.Doc.prototype.stage = function() {
  var check
    , element = this
    , wrapper = document.createElement('div')
  
  /* set temp wrapper to position relative */
  wrapper.style.cssText = 'position:relative;height:100%;'
  
  /* put element into wrapper */
  element.parent.appendChild(wrapper)
  wrapper.appendChild(element.node)
  
  /* check for dom:ready */
  check = function() {
    if (document.readyState === 'complete') {
      element.style('position:absolute;')
      setTimeout(function() {
        /* set position back to relative */
        element.style('position:relative;')
        
        /* remove temp wrapper */
        element.parent.removeChild(element.node.parentNode)
        element.node.parentNode.removeChild(element.node)
        element.parent.appendChild(element.node)
        
        /* after wrapping is done, fix sub-pixel offset */
        element.fixSubPixelOffset();
        window.addEventListener('resize', element.fixSubPixelOffset)
      }, 5)
    } else {
      setTimeout(check, 10)
    }
  }
  
  check()
  
  return this
}

// Fix for possible sub-pixel offset. See:
// https://bugzilla.mozilla.org/show_bug.cgi?id=608812
SVG.Doc.prototype.fixSubPixelOffset = function() {
  var pos  = this.node.getScreenCTM();
  var left = -pos.e % 1;
  var top  = -pos.f % 1;

  this.node.style('left: ' + left + 'px;top:' + top + 'px;');
}
