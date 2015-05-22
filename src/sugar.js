// Define list of available attributes for stroke and fill
var sugar = {
  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
, fill:   ['color', 'opacity', 'rule']
, prefix: function(t, a) {
    return a == 'color' ? t : t + '-' + a
  }
}

/* Add sugar for fill and stroke */
;['fill', 'stroke'].forEach(function(m) {
  var i, extension = {}
  
  extension[m] = function(o) {
    if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
      this.attr(m, o)

    else
      /* set all attributes from sugar.fill and sugar.stroke list */
      for (i = sugar[m].length - 1; i >= 0; i--)
        if (o[sugar[m][i]] != null)
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])
    
    return this
  }
  
  SVG.extend(SVG.Element, SVG.FX, extension)
  
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
      scaleX: x
    , scaleY: y == null ? x : y
    })
  }
  // Translate
, translate: function(x, y) {
    return this.transform({
      x: x
    , y: y
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

SVG.extend(SVG.Rect, SVG.Ellipse, SVG.FX, {
  // Add x and y radius
  radius: function(x, y) {
    return this.attr({ rx: x, ry: y || x })
  }

})

SVG.extend(SVG.Path, {
  // Get path length
  length: function() {
    return this.node.getTotalLength()
  }
  // Get point at length
, pointAt: function(length) {
    return this.node.getPointAtLength(length)
  }

})

SVG.extend(SVG.Parent, SVG.Text, SVG.FX, {
  // Set font 
  font: function(o) {
    for (var k in o)
      k == 'leading' ?
        this.leading(o[k]) :
      k == 'anchor' ?
        this.attr('text-anchor', o[k]) :
      k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ?
        this.attr('font-'+ k, o[k]) :
        this.attr(k, o[k])
    
    return this
  }
  
})

