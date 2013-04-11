
SVG.BBox = function(element) {
  var box
  
  /* actual, native bounding box */
  try {
    box = element.node.getBBox()
  } catch(e) {
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
  
  /* add the center */
  this.cx = this.x + this.width / 2
  this.cy = this.y + this.height / 2
  
}