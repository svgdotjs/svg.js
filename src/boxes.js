SVG.BBox = SVG.invent({
  // Initialize
  create: function(element) {
    var box

    // Initialize zero box
    this.x      = 0
    this.y      = 0
    this.width  = 0
    this.height = 0
    
    // Get values if element is given
    if (element) {
      // Get current extracted transformations
      var t = new SVG.Matrix(element).extract()
      
      // Find native bbox
      if (element.node.getBBox)
        box = element.node.getBBox()
      // Mimic bbox
      else
        box = {
          x:      element.node.clientLeft
        , y:      element.node.clientTop
        , width:  element.node.clientWidth
        , height: element.node.clientHeight
        }
      
      // Include translations on x an y
      this.x = box.x + t.x
      this.y = box.y + t.y
      
      // Plain width and height
      this.width  = box.width  * t.scaleX
      this.height = box.height * t.scaleY
    }

    // Add center, right and bottom
    fullBox(this)
  }

  // define Parent
, parent: SVG.Element

  // Constructor
, construct: {
    // Get bounding box
    bbox: function() {
      return new SVG.BBox(this)
    }
  }

})

SVG.RBox = SVG.invent({
  // Initialize
  create: function(element) {
    var box = {}

    // Initialize zero box
    this.x      = 0
    this.y      = 0
    this.width  = 0
    this.height = 0
    
    if (element) {
      var e = element.doc().parent()
        , zoom = 1
      
      // Actual, native bounding box
      box = element.node.getBoundingClientRect()
      
      // Get screen offset
      this.x = box.left
      this.y = box.top
      
      // Subtract parent offset
      this.x -= e.offsetLeft
      this.y -= e.offsetTop
      
      while (e = e.offsetParent) {
        this.x -= e.offsetLeft
        this.y -= e.offsetTop
      }
      
      // Calculate cumulative zoom from svg documents
      e = element
      while (e.parent && (e = e.parent())) {
        if (e.viewbox) {
          zoom *= e.viewbox().zoom
          this.x -= e.x() || 0
          this.y -= e.y() || 0
        }
      }
    }
    
    // Recalculate viewbox distortion
    this.width  = box.width  /= zoom
    this.height = box.height /= zoom
    
    // Offset by window scroll position, because getBoundingClientRect changes when window is scrolled
    this.x += window.scrollX
    this.y += window.scrollY

    // Add center, right and bottom
    fullBox(this)
  }

  // define Parent
, parent: SVG.Element

  // Constructor
, construct: {
    // Get rect box
    rbox: function() {
      return new SVG.RBox(this)
    }
  }

})

// Add universal merge method
;[SVG.BBox, SVG.RBox].forEach(function(c) {

  SVG.extend(c, {
    // Merge rect box with another, return a new instance
    merge: function(box) {
      var b = new c()

      // Merge box
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
      
      return fullBox(b)
    }

  })

})
