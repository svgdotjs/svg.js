// Define list of available attributes for stroke and fill
SVG._stroke = ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
SVG._fill   = ['color', 'opacity', 'rule']


// Prepend correct color prefix
var _colorPrefix = function(type, attr) {
  return attr == 'color' ? type : type + '-' + attr
}

/* Add sugar for fill and stroke */
;['fill', 'stroke'].forEach(function(method) {
  var extension = {}
  
  extension[method] = function(o) {
    var indexOf
    
    if (typeof o == 'string' || SVG.Color.isRgb(o))
      this.attr(method, o)
    
    else
      /* set all attributes from _fillAttr and _strokeAttr list */
      for (index = SVG['_' + method].length - 1; index >= 0; index--)
        if (o[SVG['_' + method][index]] != null)
          this.attr(_colorPrefix(method, SVG['_' + method][index]), o[SVG['_' + method][index]])
    
    return this
  }
  
  SVG.extend(SVG.Shape, SVG.FX, extension)
  
})

SVG.extend(SVG.Element, SVG.FX, {
  // Rotation
  rotate: function(deg, x, y) {
    return this.transform({
      rotation: deg || 0
    , cx: x
    , cy: y
    })
  }
  // Skew
, skew: function(x, y) {
    return this.transform({
      skewX: x || 0
    , skewY: y || 0
    })
  }
  // Scale
, scale: function(x, y) {
    return this.transform({
      scaleX: x,
      scaleY: y == null ? x : y
    })
  }
  // Matrix
, matrix: function(m) {
    return this.transform({ matrix: m })
  }
  // Opacity
, opacity: function(value) {
    return this.attr('opacity', value)
  }

})


if (SVG.Text) {
  SVG.extend(SVG.Text, SVG.FX, {
    // Set font 
    font: function(o) {
      for (var key in o)
        key == 'anchor' ?
          this.attr('text-anchor', o[key]) :
        _styleAttr.indexOf(key) > -1 ?
          this.attr('font-'+ key, o[key]) :
          this.attr(key, o[key])
      
      return this
    }
    
  })
}

