SVG.Container = function(element) {
  this.constructor.call(this, element)
}

// Inherit from SVG.Element
SVG.Container.prototype = new SVG.Element

//
SVG.extend(SVG.Container, {
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
  // Iterates over all children and invokes a given block
, each: function(block) {
    var index,
        children = this.children()
  
    for (index = 0, length = children.length; index < length; index++)
      if (children[index] instanceof SVG.Shape)
        block.apply(children[index], [index, children])
  
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
  // Returns defs element
, defs: function() {
    return this._defs || (this._defs = this.put(new SVG.Defs, 0))
  }
  // Re-level defs to first positon in element stack
, level: function() {
    return this.removeElement(this.defs()).put(this.defs(), 0)
  }
  // Create a group element
, group: function() {
    return this.put(new SVG.G)
  }
  // Create a rect element
, rect: function(width, height) {
    return this.put(new SVG.Rect().size(width, height))
  }
  // Create circle element, based on ellipse
, circle: function(size) {
    return this.ellipse(size, size)
  }
  // Create an ellipse
, ellipse: function(width, height) {
    return this.put(new SVG.Ellipse().size(width, height).move(0, 0))
  }
  // Create a line element
, line: function(x1, y1, x2, y2) {
    return this.put(new SVG.Line().plot(x1, y1, x2, y2))
  }
  // Create a wrapped polyline element
, polyline: function(points, unbiased) {
    return this.put(new SVG.Polyline(unbiased)).plot(points)
  }
  // Create a wrapped polygon element
, polygon: function(points, unbiased) {
    return this.put(new SVG.Polygon(unbiased)).plot(points)
  }
  // Create a wrapped path element
, path: function(data, unbiased) {
    return this.put(new SVG.Path(unbiased)).plot(data)
  }
  // Create image element, load image and set its size
, image: function(source, width, height) {
    width = width != null ? width : 100
    return this.put(new SVG.Image().load(source).size(width, height != null ? height : width))
  }
  // Create text element
, text: function(text) {
    return this.put(new SVG.Text().text(text))
  }
  // Create nested svg document
, nested: function() {
    return this.put(new SVG.Nested)
  }
  // Create gradient element in defs
, gradient: function(type, block) {
    return this.defs().gradient(type, block)
  }
  // Create pattern element in defs
, pattern: function(width, height, block) {
    return this.defs().pattern(width, height, block)
  }
  // Create masking element
, mask: function() {
    return this.defs().put(new SVG.Mask)
  }
  // Create clipping element
, clip: function() {
    return this.defs().put(new SVG.Clip)
  }
  // Get first child, skipping the defs node
, first: function() {
    return this.children()[0] instanceof SVG.Defs ? this.children()[1] : this.children()[0]
  }
  // Get the last child
, last: function() {
    return this.children()[this.children().length - 1]
  }
  // Get the viewBox and calculate the zoom value
, viewbox: function(v) {
    if (arguments.length == 0)
      /* act as a getter if there are no arguments */
      return new SVG.ViewBox(this)
    
    /* otherwise act as a setter */
    v = arguments.length == 1 ?
      [v.x, v.y, v.width, v.height] :
      [].slice.call(arguments)
    
    return this.attr('viewBox', v.join(' '))
  }
  // Remove all elements in this container
, clear: function() {
    /* remove children */
    for (var i = this.children().length - 1; i >= 0; i--)
      this.removeElement(this.children()[i])
    
    /* create new defs node */
    this.defs()
    
    return this
  }
  
})