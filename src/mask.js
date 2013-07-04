SVG.Mask = function() {
  this.constructor.call(this, SVG.create('mask'))

  /* keep references to masked elements */
  this.targets = []
}

// Inherit from SVG.Container
SVG.Mask.prototype = new SVG.Container

//
SVG.extend(SVG.Mask, {
  // Unmask all masked elements and remove itself
  remove: function() {
    /* unmask all targets */
    for (var i = this.targets.length - 1; i >= 0; i--)
      if (this.targets[i])
        this.targets[i].unmask()
    delete this.targets

    /* remove mask from parent */
    this.parent.removeElement(this)
    
    return this
  }
})

//
SVG.extend(SVG.Element, {
  // Distribute mask to svg element
  maskWith: function(element) {
    /* use given mask or create a new one */
    this.masker = element instanceof SVG.Mask ? element : this.parent.mask().add(element)

    /* store reverence on self in mask */
    this.masker.targets.push(this)
    
    /* apply mask */
    return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
  }
  // Unmask element
, unmask: function() {
    delete this.masker
    return this.attr('mask', null)
  }
  
})

//
SVG.extend(SVG.Container, {
  // Create masking element
  mask: function() {
    return this.defs().put(new SVG.Mask)
  }
  
})