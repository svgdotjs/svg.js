SVG.Parent = function(element) {
  this.constructor.call(this, element)
}

// Inherit from SVG.Element
SVG.Parent.prototype = new SVG.Element

//
SVG.extend(SVG.Parent, {
	// Returns all child elements
  children: function() {
    return this._children || (this._children = [])
  }
  // Add given element at a position
, add: function(element, i) {
    if (!this.has(element)) {
      /* define insertion index if none given */
      i = i == null ? this.children().length : i
      
      /* remove references from previous parent */
      if (element.parent) {
        var index = element.parent.children().indexOf(element)
        element.parent.children().splice(index, 1)
      }
      
      /* add element references */
      this.children().splice(i, 0, element)
      this.node.insertBefore(element.node, this.node.childNodes[i] || null)
      element.parent = this
    }

    /* reposition defs */
    if (this._defs) {
      this.node.removeChild(this._defs.node)
      this.node.appendChild(this._defs.node)
    }
    
    return this
  }
  // Basically does the same as `add()` but returns the added element instead
, put: function(element, i) {
    this.add(element, i)
    return element
  }
  // Checks if the given element is a child
, has: function(element) {
    return this.children().indexOf(element) >= 0
  }
  // Get a element at the given index
, get: function(i) {
    return this.children()[i]
  }
  // Get first child, skipping the defs node
, first: function() {
    return this.children()[0]
  }
  // Get the last child
, last: function() {
    return this.children()[this.children().length - 1]
  }
  // Iterates over all children and invokes a given block
, each: function(block, deep) {
    var i, il
      , children = this.children()
    
    for (i = 0, il = children.length; i < il; i++) {
      if (children[i] instanceof SVG.Element)
        block.apply(children[i], [i, children])

      if (deep && (children[i] instanceof SVG.Container))
        children[i].each(block, deep)
    }
  
    return this
  }
  // Remove a child element at a position
, removeElement: function(element) {
    var i = this.children().indexOf(element)

    this.children().splice(i, 1)
    this.node.removeChild(element.node)
    element.parent = null
    
    return this
  }
  // Remove all elements in this container
, clear: function() {
    /* remove children */
    for (var i = this.children().length - 1; i >= 0; i--)
      this.removeElement(this.children()[i])

    /* remove defs node */
    if (this._defs)
      this._defs.clear()

    return this
  }
 , // Get defs
  defs: function() {
    return this.doc().defs()
  }
})