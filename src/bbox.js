 
SVG.BBox = function(element) {
  var box

  /* initialize zero box */
  this.x      = 0
  this.y      = 0
  this.width  = 0
  this.height = 0
  
  /* get values if element is given */
  if (element) {
    try {
      /* actual, native bounding box */
      box = element.node.getBBox()
    } catch(e) {
      /* fallback for some browsers */
      box = {
        x:      element.node.clientLeft
      , y:      element.node.clientTop
      , width:  element.node.clientWidth
      , height: element.node.clientHeight
      }
    }
    
    /* include translations on x an y */
    this.x = box.x + element.trans.x
    this.y = box.y + element.trans.y
    
    /* plain width and height */
    this.width  = box.width  * element.trans.scaleX
    this.height = box.height * element.trans.scaleY
  }

  /* add center, right and bottom */
  boxProperties(this)
  
}

//
SVG.extend(SVG.BBox, {
  // merge bounding box with another, return a new instance
  merge: function(box) {
    var b = new SVG.BBox()

    /* merge box */
    b.x      = Math.min(this.x, box.x)
    b.y      = Math.min(this.y, box.y)
    b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
    b.height = Math.max(this.y + this.height, box.y + box.height) - b.y

    /* add center, right and bottom */
    boxProperties(b)

    return b
  }

})