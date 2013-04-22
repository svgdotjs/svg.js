// Get the rectangular box of a given element
SVG.RBox = function(element) {
  var box, zoom
    , e = element.doc().parent
    , zoom = element.doc().viewbox().zoom
  
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
  
  /* recalculate viewbox distortion */
  this.x /= zoom
  this.y /= zoom
  this.width  = box.width  /= zoom
  this.height = box.height /= zoom
  
  /* add the center */
  this.cx = this.x + this.width  / 2
  this.cy = this.y + this.height / 2
  
}