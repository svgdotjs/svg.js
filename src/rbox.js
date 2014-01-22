// Get the rectangular box of a given element
SVG.RBox = function(element) {
  var e, zoom
    , box = {}

  /* initialize zero box */
  this.x      = 0
  this.y      = 0
  this.width  = 0
  this.height = 0
  
  if (element) {
    e = element.doc().parent
    zoom = element.doc().viewbox().zoom
    
    /* actual, native bounding box */
    box = element.node.getBoundingClientRect()
    
    /* get screen offset */
    this.x = box.left
    this.y = box.top
    
    /* subtract parent offset */
    this.x -= e.offsetLeft
    this.y -= e.offsetTop
    
    while (e = e.offsetParent) {
      this.x -= e.offsetLeft
      this.y -= e.offsetTop
    }
    
    /* calculate cumulative zoom from svg documents */
    e = element
    while (e = e.parent) {
      if (e.type == 'svg' && e.viewbox) {
        zoom *= e.viewbox().zoom
        this.x -= e.x() || 0
        this.y -= e.y() || 0
      }
    }
  }
  
  /* recalculate viewbox distortion */
  this.x /= zoom
  this.y /= zoom
  this.width  = box.width  /= zoom
  this.height = box.height /= zoom
  
  /* add the center */
  this.cx = this.x + this.width  / 2
  this.cy = this.y + this.height / 2
  
}

//
SVG.extend(SVG.RBox, {
  // merge rect box with another, return a new instance
  merge: function(box) {
    var b = new SVG.RBox()

    /* merge box */
    b.x      = Math.min(this.x, box.x)
    b.y      = Math.min(this.y, box.y)
    b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
    b.height = Math.max(this.y + this.height, box.y + box.height) - b.y

    /* add the center */
    b.cx = b.x + b.width / 2
    b.cy = b.y + b.height / 2

    return b
  }

})