// Define list of available attributes for stroke and fill
var _strokeAttr = ['width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
    _fillAttr   = ['opacity', 'rule'];

SVG.extend(SVG.Shape, {
  
  // Set fill color and opacity
  fill: function(fill) {
    var index;
    
    /* set fill color if not null */
    if (fill.color != null)
      this.attr('fill', fill.color);
    
    /* set all attributes from _fillAttr list with prependes 'fill-' if not null */
    for (index = _fillAttr.length - 1; index >= 0; index--)
      if (fill[_fillAttr[index]] != null)
        this.attr('fill-' + _fillAttr[index], fill[_fillAttr[index]]);
    
    return this;
  },
  // Set stroke color and opacity
  stroke: function(stroke) {
    var index;
    
    // set stroke color if not null
    if (stroke.color)
      this.attr('stroke', stroke.color);
    
    // set all attributes from _strokeAttr list with prependes 'stroke-' if not null
    for (index = _strokeAttr.length - 1; index >= 0; index--)
      if (stroke[_strokeAttr[index]] != null)
        this.attr('stroke-' + _strokeAttr[index], stroke[_strokeAttr[index]]);
    
    return this;
  }
  
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
  /* Add sugar for fill and stroke */
  ['fill', 'stroke'].forEach(function(method) {
    SVG.FX.prototype[method] = function(o) {
      var attr, key;

      for (key in o) {
        attr = key == 'color' ? method : method + '-' + key;
        this.attrs[attr] = {
          from: this.target.attrs[attr],
          to:   o[key]
        };
      };

      return this;
    };
  });
  
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



