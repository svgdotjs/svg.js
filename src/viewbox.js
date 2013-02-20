
SVG.ViewBox = function(element) {
  var x, y, width, height
    , box  = element.bbox()
    , view = (element.attr('viewBox') || '').match(/[\d\.]+/g)
  
  /* clone attributes */
  this.x      = box.x
  this.y      = box.y
  this.width  = element.node.offsetWidth
  this.height = element.node.offsetHeight
  this.zoom   = 1
  
  if (view) {
    /* get width and height from viewbox */
    x      = parseFloat(view[0])
    y      = parseFloat(view[1])
    width  = parseFloat(view[2]) - x
    height = parseFloat(view[3]) - y
    
    /* calculate zoom accoring to viewbox */
    this.zoom = ((this.width / this.height) > (width / height)) ?
      this.height / height :
      this.width  / width

    /* calculate real pixel dimensions on parent SVG.Doc element */
    if (element instanceof SVG.Doc) {
      this.x      = x
      this.y      = y
      this.width  = width
      this.height = height
    }
  }
}