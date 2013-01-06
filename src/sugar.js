// Define list of available attributes for stroke and fill
SVG._stroke = ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'];
SVG._fill   = ['color', 'opacity', 'rule'];


// Prepend correct color prefix
var _colorPrefix = function(type, attr) {
  return attr == 'color' ? type : type + '-' + attr;
};

/* Add sugar for fill and stroke */
['fill', 'stroke'].forEach(function(method) {
  
  // Set fill color and opacity
  SVG.Shape.prototype[method] = function(o) {
    var index;
    
    if (typeof o == 'string')
      this.attr(method, o);
    
    else
      /* set all attributes from _fillAttr and _strokeAttr list */
      for (index = SVG['_' + method].length - 1; index >= 0; index--)
        if (o[SVG['_' + method][index]] != null)
          this.attr(_colorPrefix(method, SVG['_' + method][index]), o[SVG['_' + method][index]]);
    
    return this;
  };
  
});

SVG.extend(SVG.Element, {
  // Rotation
  rotate: function(angle) {
    return this.transform({
      rotation: angle || 0
    });
  },
  // Skew
  skew: function(x, y) {
    return this.transform({
      skewX: x || 0,
      skewY: y || 0
    });
  }
  
});

SVG.extend(SVG.G, {
  // Move using translate
  move: function(x, y) {
    return this.transform({
      x: x,
      y: y
    });
  }
  
});

SVG.extend(SVG.Text, {
  // Set font 
  font: function(o) {
    var key, attr = {};
    
    for (key in o)
      key == 'leading' ?
        attr[key] = o[key] :
      key == 'anchor' ?
        attr['text-anchor'] = o[key] :
      _styleAttr.indexOf(key) > -1 ?
        attr['font-'+ key] = o[key] :
        void 0;
    
    return this.attr(attr).text(this.content);
  }
  
});


if (SVG.FX) {
  SVG.extend(SVG.FX, {
    // Rotation
    rotate: function(angle) {
      return this.transform({
        rotation: angle || 0
      });
    },

    // Skew
    skew: function(x, y) {
      return this.transform({
        skewX: x || 0,
        skewY: y || 0
      });
    }

  });
}



