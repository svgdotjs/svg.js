// Fix for possible sub-pixel offset. See:
// https://bugzilla.mozilla.org/show_bug.cgi?id=608812
SVG.extend(SVG.Doc, {
  // Callback
  spof: function() {
    if (this.doSpof) {
      var pos = this.node.getScreenCTM()
      
      if (pos)
        this
          .style('left', (-pos.e % 1) + 'px')
          .style('top',  (-pos.f % 1) + 'px')
    }
    
    return this
  }

  // Sub-pixel offset enabler
, fixSubPixelOffset: function() {
    var self = this

    // Enable spof
    this.doSpof = true

    // Make sure sub-pixel offset is fixed every time the window is resized
    SVG.on(window, 'resize', function() { self.spof() })

    return this.spof()
  }
  
})