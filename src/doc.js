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

    /* turno of sub pixel offset by default */
    this.doSubPixelOffsetFix = false
    
    /* ensure correct rendering */
    if (this.parent.nodeName != 'svg')
      this.stage()
  }

  // Inherit from
, inherit: SVG.Container

  // Add class methods
, extend: {
    // Hack for safari preventing text to be rendered in one line.
    // Basically it sets the position of the svg node to absolute
    // when the dom is loaded, and resets it to relative a few milliseconds later.
    // It also handles sub-pixel offset rendering properly.
    stage: function() {
      var check
        , element = this
        , wrapper = document.createElement('div')

      /* set temporary wrapper to position relative */
      wrapper.style.cssText = 'position:relative;height:100%;'

      /* put element into wrapper */
      element.parent.appendChild(wrapper)
      wrapper.appendChild(element.node)

      /* check for dom:ready */
      check = function() {
        if (document.readyState === 'complete') {
          element.style('position:absolute;')
          setTimeout(function() {
            /* set position back to relative */
            element.style('position:relative;overflow:hidden;')

            /* save defs */
            element.node.removeChild(element._defs.node)
            /* remove temporary wrapper */
            element.parent.removeChild(element.node.parentNode)
            element.node.parentNode.removeChild(element.node)
            element.parent.appendChild(element.node)
            element.node.appendChild(element._defs.node)

            /* after wrapping is done, fix sub-pixel offset */
            element.subPixelOffsetFix()
            
            /* make sure sub-pixel offset is fixed every time the window is resized */
            SVG.on(window, 'resize', function() {
              element.subPixelOffsetFix()
            })
            
          }, 5)
        } else {
          setTimeout(check, 10)
        }
      }

      check()

      return this
    }

    // Creates and returns defs element
  , defs: function() {
      return this._defs
    }

    // Fix for possible sub-pixel offset. See:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
  , subPixelOffsetFix: function() {
      if (this.doSubPixelOffsetFix) {
        var pos = this.node.getScreenCTM()
        
        if (pos)
          this
            .style('left', (-pos.e % 1) + 'px')
            .style('top',  (-pos.f % 1) + 'px')
      }
      
      return this
    }

  , fixSubPixelOffset: function() {
      this.doSubPixelOffsetFix = true

      return this
    }
  }
  
})
