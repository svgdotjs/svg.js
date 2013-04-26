SVG.TextNode = function(text) {
 this.constructor.call(this, document.createTextNode(text))
}
 
// Inherit from SVG.Element
SVG.TextNode.prototype = new SVG.Element
 
SVG.extend(SVG.TextNode, {
 
 extractText: function() {
  return this.node.nodeValue != null ? this.node.nodeValue : ''
 }
 
})

SVG.TextShape = function(element) {
  this.constructor.call(this, element)
}

// Inherit from SVG.Shape
SVG.TextShape.prototype = new SVG.Shape

SVG.extend(SVG.TextShape, {
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
, extractText: function() {
   var t = [], 
       arr = this.children()
   for (var i = 0, l = arr.length; i < l; i++)
    t[t.length] = arr[i].extractText()
   return t.join("")
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
  // Iterates over all children except text nodes and invokes a given block
, each: function(block) {
    var index,
        children = this.children()
  
    for (index = 0, length = children.length; index < length; index++)
      if (children[index] instanceof SVG.TextShape)
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
  // Create a group element
, tspan: function() {
    return this.put(new SVG.TSpan)
  }
  // Create text element
, textNode: function(text) {
    return this.put(new SVG.TextNode(text))
  }
  // Get first child, skipping the defs node
, first: function() {
    return this.children()[0]
  }
  // Get the last child
, last: function() {
    return this.children()[this.children().length - 1]
  }
  // Remove all elements in this container
, clear: function() {
    /* remove children */
    for (var i = this.children().length - 1; i >= 0; i--)
      this.removeElement(this.children()[i])
    
    return this
  }
  
})

// List font style attributes as they should be applied to style 
var _styleAttr = ('size family weight stretch variant style').split(' ')

SVG.Text = function() {
  this.constructor.call(this, SVG.create('text'))
  
  /* define default style */
  this.styles = {
    'font-size':    16
  , 'font-family':  'Helvetica, Arial, sans-serif'
  , 'text-anchor':  'start'
  }
}

// Inherit from SVG.Element
SVG.Text.prototype = new SVG.TextShape

SVG.extend(SVG.Text, {
  // Move over x-axis
  x: function(x, a) {
    /* act as getter */
    if (x == null) return a ? this.attr('x') : this.bbox().x
    
    /* set x taking anchor in mind */
    if (!a) {
      a = this.style('text-anchor')
      x = a == 'start' ? x : a == 'end' ? x + this.bbox().width : x + this.bbox().width / 2
    }
    
    return this.attr('x', x)
  }
// Move over y-axis
, y: function(y, a) {
   /* act as getter */
   if (y == null) return a ? this.attr('y') : this.bbox().y
   
   /* set y taking anchor in mind */
   if (!a) {
     a = this.style('text-anchor')
     y = a == 'start' ? y : a == 'end' ? x + this.bbox().height : y + this.bbox().height / 2
   }
   
   return this.attr('y', y)
  }
  // Move center over x-axis
, cx: function(x, a) {
    return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
  }
  // Move center over y-axis
, cy: function(y, a) {
    return y == null ? this.bbox().cy : this.y(a ? y : y - this.bbox().height / 2)
  }
  // Move element to given x and y values
, move: function(x, y, a) {
    return this.x(x, a).y(y, a)
  }
  // Move element by its center
, center: function(x, y, a) {
    return this.cx(x, a).cy(y, a)
  }
  // Set font size
, size: function(size) {
    return this.attr('font-size', size)
  }
 
})

// tspan class
SVG.TSpan = function() {
  this.constructor.call(this, SVG.create('tspan'))
}

// Inherit from SVG.Shape
SVG.TSpan.prototype = new SVG.Text
