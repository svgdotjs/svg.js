SVG.Doc = SVG.invent({
  // Initialize node
  create: function(element) {
    /* ensure the presence of a dom element */
    element = typeof element == 'string' ?
      document.getElementById(element) :
      element
    
    /* If the target is an svg element, use that element as the main wrapper.
       This allows svg.js to work with svg documents as well. */
    if (element.nodeName == 'svg') {
      this.constructor.call(this, element)
    } else {
      this.constructor.call(this, SVG.create('svg'))
      element.appendChild(this.node)
    }
    
    /* set svg element attributes and ensure defs node */
    this
      .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
      .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
      .defs()
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Creates and returns defs element
    defs: function() {
      if (!this._defs) {
        var defs

        // Find or create a defs element in this instance
        if (defs = this.node.getElementsByTagName('defs')[0])
          this._defs = SVG.adopt(defs)
        else
          this._defs = new SVG.Defs

        // Make sure the defs node is at the end of the stack
        this.node.appendChild(this._defs.node)
      }

      return this._defs
    }
    // custom parent method
  , parent: function() {
      return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode
    }
  }
  
})
