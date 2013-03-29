
SVG.ViewBox = function(element) {
  var x, y, width, height
    , box  = element.bbox()
    , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
  
  /* clone attributes */
  this.x      = box.x
  this.y      = box.y
  this.width  = element.node.offsetWidth  || element.attr('width')
  this.height = element.node.offsetHeight || element.attr('height')
  
  if (view) {
    /* get width and height from viewbox */
    x      = parseFloat(view[0])
    y      = parseFloat(view[1])
    width  = parseFloat(view[2])
    height = parseFloat(view[3])
    
    /* calculate zoom accoring to viewbox */
    this.zoom = ((this.width / this.height) > (width / height)) ?
      this.height / height :
      this.width  / width

    /* calculate real pixel dimensions on parent SVG.Doc element */
    this.x      = x
    this.y      = y
    this.width  = width
    this.height = height
  }
  
  /* ensure a default zoom value */
  this.zoom = this.zoom || 1
  
}

SVG.extend(SVG.ViewBox, {
  // Parse viewbox to string
  toString: function() {
    return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
  }
  
})