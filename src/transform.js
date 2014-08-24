SVG.extend(SVG.Element, SVG.FX, {
  // Add transformations
  transform: function(o, relative) {
    // get target in case of the fx module, otherwise reference this
    var target = this.target || this

    // full getter
    if (o == null)
      return target.ctm().extract()

    // singular getter
    else if (typeof o === 'string')
      return target.ctm().extract()[o]

    // get current matrix
    var matrix = new SVG.Matrix(target)

    // ensure relative flag
    relative = !!relative || !!o.relative
    
    // act on matrix
    if (o.a != null) {
      matrix = relative ?
        // relative
        matrix.multiply(new SVG.Matrix(o)) :
        // absolute
        new SVG.Matrix(o)
    
    // act on rotate
    } else if (o.rotation != null) {
      o.cx = o.cx == null ? target.bbox().cx : o.cx
      o.cy = o.cy == null ? target.bbox().cy : o.cy

      matrix = relative ?
        // relative
        target.attr('transform', matrix + ' rotate(' + [o.rotation, o.cx, o.cy].join() + ')').ctm() :
        // absolute
        matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy)
    
    // act on scale
    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
      o.cx = o.cx == null ? target.bbox().cx : o.cx
      o.cy = o.cy == null ? target.bbox().cy : o.cy

      if (!relative) {
        // absolute; multiply inversed values
        var e = matrix.extract()
        o.scaleX = o.scaleX * 1 / e.scaleX
        o.scaleY = o.scaleY * 1 / e.scaleY
      }

      matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy)

    // act on skew
    } else if (o.skewX != null || o.skewY != null) {
      o.skewX = o.skewX != null ? o.skewX : 0
      o.skewY = o.skewY != null ? o.skewY : 0
      o.cx = o.cx == null ? target.bbox().cx : o.cx
      o.cy = o.cy == null ? target.bbox().cy : o.cy

      if (!relative) {
        // absolute; reset skew values
        var e = matrix.extract()
        matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse())
      }
      
      matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy)

    // act on flip
    } else if (o.flip) {
      matrix = matrix.flip(
        o.flip
      , o.offset == null ? target.bbox()['c' + o.flip] : o.offset
      )

    // act on translate
    } else if (o.x != null || o.y != null) {
      if (relative) {
        // relative
        matrix = matrix.translate(o.x, o.y)
      } else {
        // absolute
        if (o.x != null) matrix.e = o.x
        if (o.y != null) matrix.f = o.y
      }
    }

    return this.attr('transform', matrix)
  }
})

SVG.extend(SVG.Element, {
  // Reset all transformations
  untransform: function() {
    return this.attr('transform', null)
  }
})