// ### Manage events on elements

//     rect.click(function() {
//       this.fill({ color: '#f06' })
//     })
;[ 'click'
, 'dblclick'
, 'mousedown'
, 'mouseup'
, 'mouseover'
, 'mouseout'
, 'mousemove'
, 'mouseenter'
, 'mouseleave'
, 'touchstart'
, 'touchend'
, 'touchmove'
, 'touchcancel' ].forEach(function(event) {
  
  /* add event to SVG.Element */
  SVG.Element.prototype[event] = function(f) {
    var self = this
    
    /* bind event to element rather than element node */
    this.node['on' + event] = typeof f == 'function' ?
      function() { return f.apply(self, arguments) } : null
    
    return this
  }
  
})

// Add event binder in the SVG namespace
SVG.on = function(node, event, listener) {
  if (node.addEventListener)
    node.addEventListener(event, listener, false)
  else
    node.attachEvent('on' + event, listener)
}

// Add event unbinder in the SVG namespace
SVG.off = function(node, event, listener) {
  if (node.removeEventListener)
    node.removeEventListener(event, listener, false)
  else
    node.detachEvent('on' + event, listener)
}

//
SVG.extend(SVG.Element, {
  // Bind given event to listener
  on: function(event, listener) {
    SVG.on(this.node, event, listener)
    
    return this
  }
  // Unbind event from listener
, off: function(event, listener) {
    SVG.off(this.node, event, listener)
    
    return this
  }
})