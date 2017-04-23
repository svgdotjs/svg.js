SVG.Mask = SVG.invent({
  // Initialize node
  create: 'mask'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Unmask all masked elements and remove itself
    remove: function() {
      // unmask all targets
      this.targets().forEach(function(el) {
        el.unmask()
      })

      // remove mask from parent
      return SVG.Element.prototype.remove.call(this)
    }

  , targets: function() {
      return SVG.select('svg [mask*="' + this.id() + '"]')
    }
  }

  // Add parent method
, construct: {
    // Create masking element
    mask: function() {
      return this.defs().put(new SVG.Mask)
    }
  }
})


SVG.extend(SVG.Element, {
  // Distribute mask to svg element
  maskWith: function(element) {
    // use given mask or create a new one
    var masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)

    // apply mask
    return this.attr('mask', 'url("#' + masker.id() + '")')
  }
  // Unmask element
, unmask: function() {
    return this.attr('mask', null)
  }
, masker: function() {
    return this.reference('mask')
  }
})
