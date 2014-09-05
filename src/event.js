// Add events to elements
;[  'click'
  , 'dblclick'
  , 'mousedown'
  , 'mouseup'
  , 'mouseover'
  , 'mouseout'
  , 'mousemove'
  // , 'mouseenter' -> not supported by IE
  // , 'mouseleave' -> not supported by IE
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

// Initialize events and listeners stack
SVG.events = {}
SVG.listeners = {}

// Event constructor
SVG.registerEvent = function(event) {
  if (!SVG.events[event])
    SVG.events[event] = new CustomEvent(event)
}

// Add event binder in the SVG namespace
SVG.on = function(node, event, listener) {
  // create listener
  var l = listener.bind(node.instance || node)

  // ensure reference objects
  SVG.listeners[node]        = SVG.listeners[node]        || {}
  SVG.listeners[node][event] = SVG.listeners[node][event] || {}

  // reference listener
  SVG.listeners[node][event][listener] = l

  // add listener
  node.addEventListener(event, l, false)
}

// Add event unbinder in the SVG namespace
SVG.off = function(node, event, listener) {
  if (listener) {
    // remove listener reference
    if (SVG.listeners[node] && SVG.listeners[node][event]) {
      // remove listener
      node.removeEventListener(event, SVG.listeners[node][event][listener], false)

      delete SVG.listeners[node][event][listener]
    }

  } else if (event) {
    // remove all listeners for the event
    if (SVG.listeners[node][event]) {
      for (listener in SVG.listeners[node][event])
        SVG.off(node, event, listener)

      delete SVG.listeners[node][event]
    }

  } else {
    // remove all listeners on a given node
    if (SVG.listeners[node]) {
      for (event in SVG.listeners[node])
        SVG.off(node, event)

      delete SVG.listeners[node]
    }
  }
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
, fire: function(event, data) {
    // Add detail data to event
    SVG.events[event].detail = data
    
    // Dispatch event
    this.node.dispatchEvent(SVG.events[event])

    // Remove detail
    delete SVG.events[event].detail

    return this
  }
})