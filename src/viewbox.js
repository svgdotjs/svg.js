
SVG.ViewBox = function(element) {
  var width, height
    , box  = element.bbox()
    , view = (element.attr('viewBox') || '').match(/[\d\.]+/g)
  
  /* clone attributes */
  this.x      = box.x
  this.y      = box.y
  this.width  = box.width
  this.height = box.height
  
  if (view) {
    /* get width and height from viewbox */
    width  = parseFloat(view[2])
    height = parseFloat(view[3])

    /* calculate real pixel dimensions on parent SVG.Doc element */
    if (element instanceof SVG.Doc) {
      this.x      = 0
      this.y      = 0
      this.width  = element.node.offsetWidth
      this.height = element.node.offsetHeight
    }
    
    /* calculate zoom accoring to viewbox */
    this.scale = (this.width / this.height > width / height) ?
      this.height / height :
      this.width  / width
    
  } else {
    this.scale = 1
  }
  
}