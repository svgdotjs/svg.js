SVG.ClipPath = SVG.invent({
  // Initialize node
  create: 'clipPath'

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Unclip all clipped elements and remove itself
    remove: function() {
      // unclip all targets
      this.targets().each(function() {
        this.unclip()
      })

      // remove clipPath from parent
      this.parent().removeElement(this)

      return this
    }
    
  , targets: function() {
      return SVG.select('svg [clip-path*="' +this.id() +'"]')
    }
  }

  // Add parent method
, construct: {
    // Create clipping element
    clip: function() {
      return this.defs().put(new SVG.ClipPath)
    }
  }
})

//
SVG.extend(SVG.Element, {
  // Distribute clipPath to svg element
  clipWith: function(element) {
    // use given clip or create a new one
    var clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)

    // apply mask
    return this.attr('clip-path', 'url("#' + clipper.attr('id') + '")')
  }
  // Unclip element
, unclip: function() {
    return this.attr('clip-path', null)
  }
, clipper: function() {
    return this.reference('clip-path')
  }

})