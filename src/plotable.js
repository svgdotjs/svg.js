
SVG.extend(SVG.Polyline, SVG.Polygon, SVG.Path, {
  // Move over x-axis
  x: function(x) {
    return x == null ? this.bbox().x : this.transform('x', x)
  }
  // Move over y-axis
, y: function(y) {
    return y == null ? this.bbox().y : this.transform('y', y)
  }
  // Set the actual size in pixels
, size: function(width, height) {
    var scale = width / this._offset.width
    
    return this.transform({
      scaleX: scale
    , scaleY: height != null ? height / this._offset.height : scale
    })
  }
  // Set path data
, plot: function(data) {
    var x = this.trans.scaleX
      , y = this.trans.scaleY
    
    /* native plot */
    this._plot(data)
    
    /* store offset */
    this._offset = this.transform({ scaleX: 1, scaleY: 1 }).bbox()
    
    /* get and store the actual offset of the element */
    if (this.unbiased) {
      this._offset.x = this._offset.y = 0
    } else {
      this._offset.x -= this.trans.x
      this._offset.y -= this.trans.y
    }
    
    return this.transform({ scaleX: x, scaleY: y })
  }
  
})