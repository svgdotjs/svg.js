// Add events to elements
;[  'click'
  , 'dblclick'
  , 'mousedown'
  , 'mouseup'
  , 'mouseover'
  , 'mouseout'
  , 'mousemove'
  , 'mouseenter'
  , 'mouseleave'
  , 'touchstart'
  , 'touchmove'
  , 'touchleave'
  , 'touchend'
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

// Initialize events stack
SVG.events = {}

// Event constructor
SVG.registerEvent = function(event) {
  if (!SVG.events[event])
    SVG.events[event] = new Event(event)
}

// Add event binder in the SVG namespace
SVG.on = function(node, event, listener) {
  node.addEventListener(event, listener.bind(node.instance || node), false)
}

// Add event unbinder in the SVG namespace
SVG.off = function(node, event, listener) {
  node.removeEventListener(event, listener.bind(node.instance || node), false)
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
  // Fire given event
, fire: function(event) {
    this.node.dispatchEvent(SVG.events[event])

    return this
  }
})