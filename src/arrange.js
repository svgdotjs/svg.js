// ### This module adds backward / forward functionality to elements.

//
SVG.extend(SVG.Element, {
  // Get all siblings, including myself
  siblings: function() {
    return this.parent.children()
  }
  // Get the curent position siblings
, position: function() {
    return this.parent.index(this)
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
    var i = this.position()
    return this.parent.removeElement(this).put(this, i + 1)
  }
  // Send given element one step backward
, backward: function() {
    var i = this.position()
    
    if (i > 0)
      this.parent.removeElement(this).add(this, i - 1)

    return this
  }
  // Send given element all the way to the front
, front: function() {
    return this.parent.removeElement(this).put(this)
  }
  // Send given element all the way to the back
, back: function() {
    if (this.position() > 0)
      this.parent.removeElement(this).add(this, 0)
    
    return this
  }
  // Inserts a given element before the targeted element
, before: function(element) {
    element.remove()

    var i = this.position()
    
    this.parent.add(element, i)

    return this
  }
  // Insters a given element after the targeted element
, after: function(element) {
    element.remove()
    
    var i = this.position()
    
    this.parent.add(element, i + 1)

    return this
  }

})