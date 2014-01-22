SVG.Path = function(unbiased) {
  this.constructor.call(this, SVG.create('path'))
  
  this.unbiased = !!unbiased
}

// Inherit from SVG.Shape
SVG.Path.prototype = new SVG.Shape

SVG.extend(SVG.Path, {
  // Move over x-axis
  x: function(x) {
    return x == null ? this.bbox().x : this.transform('x', x)
  }
  // Move over y-axis
, y: function(y) {
    return y == null ? this.bbox().y : this.transform('y', y)
  }
  // Set width of element
, width: function(width) {
    var b = this.bbox()

    return width == null ? b.width : this.size(width, b.height)
  }
  // Set height of element
, height: function(height) {
    var b = this.bbox()

    return height == null ? b.height : this.size(b.width, height)
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
  // Private: Native plot
, _plot: function(data) {
    return this.attr('d', data || 'M0,0')
  }
  
})

//
SVG.extend(SVG.Container, {
  // Create a wrapped path element
  path: function(data, unbiased) {
    return this.put(new SVG.Path(unbiased)).plot(data)
  }

})