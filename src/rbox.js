// Get the rectangular box of a given element
SVG.RBox = function(element, relative) {
  /* initialize zero box */
  this.x = this.y = this.width = this.height = null;

  if (element) {
    var svg     = element.node.ownerSVGElement || element.node,
    p     = svg.createSVGPoint(),
    relative  = relative?relative.node:element.node.ownerSVGElement,
    matrix    = element.node.getTransformToElement(relative),
    box     = element.node.getBBox(),
    frame   = [[box.x, box.y], [box.x+box.width, box.y], [box.x+box.width, box.y+box.height], [box.x, box.y+box.height]],
    right   = null,
    bottom    = null;

    for(var i = 0; i<4; i++) {
      p.x = frame[i][0];
      p.y = frame[i][1];
      p = p.matrixTransform(matrix);
      if(this.x === null || p.x < this.x) {
        this.x = p.x;
      }
      if(this.y === null || p.y < this.y) {
        this.y = p.y;
      }
      if(right === null || p.x > right) {
        right = p.x;
      }
      if(bottom === null || p.y > bottom) {
        bottom = p.y;
      }
    }
    this.width  = right - this.x;
    this.height = bottom - this.y;
  }

  /* add the center */
  this.cx = this.x + this.width  / 2;
  this.cy = this.y + this.height / 2;
}

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
