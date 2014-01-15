// Get the rectangular box of a given element
SVG.RBox = function(element, relative) {
  var e, zoom
    , box = {}

  /* initialize zero box */
  this.x      = 0
  this.y      = 0
  this.width  = 0
  this.height = 0
  
  if (element) {
    var p        = element.node.ownerSVGElement.createSVGPoint(),
        relative = relative?relative.node?element.node.ownerSVGElement
    /* actual, native bounding box */
    box = element.node.getBoundingClientRect()
    p.x = box.left
    p.y = box.top
    /* get screen offset */
    p = p.matrixTransform(relative.getScreenCTM().inverse())
    this.x = p.x
    this.y = p.y
    p.x = box.right
    p.y = box.bottom
    p = p.matrixTransform(relative.getScreenCTM().inverse())
    this.width  = p.x - this.x
    this.height = p.y - this.y
  }

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
