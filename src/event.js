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

// Initialize listeners stack
SVG.listeners = []
SVG.handlerMap = []

// Only kept for consistency of API
SVG.registerEvent = function(){};

// Add event binder in the SVG namespace
SVG.on = function(node, event, listener) {
  // create listener, get object-index
  var l     = listener.bind(node.instance || node)
    , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
  
  // ensure valid object
  SVG.listeners[index]        = SVG.listeners[index]        || {}
  SVG.listeners[index][event] = SVG.listeners[index][event] || {}

  // reference listener
  SVG.listeners[index][event][listener] = l

  // add listener
  node.addEventListener(event, l, false)
}

// Add event unbinder in the SVG namespace
SVG.off = function(node, event, listener) {
  var index = SVG.handlerMap.indexOf(node)
  
  if (listener) {
    // remove listener reference
    if (index != -1 && SVG.listeners[index][event]) {
      // remove listener
      node.removeEventListener(event, SVG.listeners[index][event][listener], false)

      delete SVG.listeners[index][event][listener]
    }

  } else if (event) {
    // remove all listeners for the event
    if (SVG.listeners[index][event]) {
      for (listener in SVG.listeners[index][event])
        SVG.off(node, event, listener)

      delete SVG.listeners[index][event]
    }

  } else {
    // remove all listeners on a given node
    if (index != -1) {
      for (event in SVG.listeners[index])
        SVG.off(node, event)

      delete SVG.listeners[index]
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
    
    // Dispatch event
    this.node.dispatchEvent(new CustomEvent(event, {detail:data}))

    return this
  }
})