SVG.Doc = SVG.invent({
  // Initialize node
  create: function(element) {
    /* ensure the presence of a html element */
    this.parent = typeof element == 'string' ?
      document.getElementById(element) :
      element
    
    /* If the target is an svg element, use that element as the main wrapper.
       This allows svg.js to work with svg documents as well. */
    this.constructor
      .call(this, this.parent.nodeName == 'svg' ? this.parent : SVG.create('svg'))
    
    /* set svg element attributes */
    this
      .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
      .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
    
    /* create the <defs> node */
    this._defs = new SVG.Defs
    this._defs.parent = this
    this.node.appendChild(this._defs.node)

    /* turn off sub pixel offset by default */
    this.doSpof = false
    
    /* ensure correct rendering */
    if (this.parent != this.node)
      this.stage()
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    /* enable drawing */
    stage: function() {
      var element = this

      /* insert element */
      this.parent.appendChild(this.node)

      /* fix sub-pixel offset */
      element.spof()
      
      /* make sure sub-pixel offset is fixed every time the window is resized */
      SVG.on(window, 'resize', function() {
        element.spof()
      })

      return this
    }

    // Creates and returns defs element
  , defs: function() {
      return this._defs
    }

    // Fix for possible sub-pixel offset. See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
  , spof: function() {
      if (this.doSpof) {
        var pos = this.node.getScreenCTM()
        
        if (pos)
          this
            .style('left', (-pos.e % 1) + 'px')
            .style('top',  (-pos.f % 1) + 'px')
      }
      
      return this
    }

    // Enable sub-pixel offset
  , fixSubPixelOffset: function() {
      this.doSpof = true

      return this
    }
  }
  
})
