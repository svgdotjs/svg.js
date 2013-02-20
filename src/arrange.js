// ### This module adds backward / forward functionality to elements.

//
SVG.extend(SVG.Element, {
  // Get all siblings, including myself
  siblings: function() {
    return this.parent.children()
  }
  // Get the curent position siblings
, position: function() {
    return this.siblings().indexOf(this)
  }
  // Get the next element (will return null if there is none)
, next: function() {
    return this.siblings()[this.position() + 1]
  }
  // Get the next element (will return null if there is none)
, previous: function() {
    return this.siblings()[this.position() - 1]
  }
  // Send given element one step forward
, forward: function() {
    return this.parent.remove(this).put(this, this.position() + 1)
  }
  // Send given element one step backward
, backward: function() {
    var i
    
    this.parent.level()
    
    i = this.position()
    
    if (i > 1)
      this.parent.remove(this).add(this, i - 1)
    
    return this
  }
  // Send given element all the way to the front
, front: function() {
    return this.parent.remove(this).put(this)
  }
  // Send given element all the way to the back
, back: function() {
    this.parent.level()
    
    if (this.position() > 1)
      this.parent.remove(this).add(this, 0)
    
    return this
  }
  
})