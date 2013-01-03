
// define list of available attributes for stroke and fill
var _strokeAttr = ['width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
    _fillAttr   = ['opacity', 'rule'];


// Add shape-specific functions
SVG.extend(SVG.Shape, {
  
  // set fill color and opacity
  fill: function(f) {
    var i;
    
    // set fill color if not null
    if (f.color != null)
      this.attr('fill', f.color);
    
    // set all attributes from _fillAttr list with prependes 'fill-' if not null
    for (i = _fillAttr.length - 1; i >= 0; i--)
      if (f[_fillAttr[i]] != null)
        this.attr('fill-' + _fillAttr[i], f[_fillAttr[i]]);
    
    return this;
  },

  // set stroke color and opacity
  stroke: function(s) {
    var i;
    
    // set stroke color if not null
    if (s.color)
      this.attr('stroke', s.color);
    
    // set all attributes from _strokeAttr list with prependes 'stroke-' if not null
    for (i = _strokeAttr.length - 1; i >= 0; i--)
      if (s[_strokeAttr[i]] != null)
        this.attr('stroke-' + _strokeAttr[i], s[_strokeAttr[i]]);
    
    return this;
  }
  
});

// Add element-specific functions
SVG.extend(SVG.Element, {
  
  // rotation
  rotate: function(d) {
    return this.transform({
      rotation: d || 0
    });
  },
  
  // skew
  skew: function(x, y) {
    return this.transform({
      skewX: x || 0,
      skewY: y || 0
    });
  }
  
});

// Add group-specific functions
SVG.extend(SVG.G, {
  
  // move using translate
  move: function(x, y) {
    return this.transform({ x: x, y: y });
  }
  
});

// Add text-specific functions
SVG.extend(SVG.Text, {
  
  // set font 
  font: function(o) {
    var k, a = {};
    
    for (k in o)
      k == 'leading' ?
        a[k] = o[k] :
      k == 'anchor' ?
        a['text-anchor'] = o[k] :
      _styleAttr.indexOf(k) > -1 ?
        a['font-'+ k] = o[k] :
        void 0;
    
    return this.attr(a).text(this.content);
  }
  
});

// add methods to SVG.FX
if (SVG.FX) {
  // add sugar for fill and stroke
  ['fill', 'stroke'].forEach(function(m) {
    SVG.FX.prototype[m] = function(o) {
      var a, k;

      for (k in o) {
        a = k == 'color' ? m : m + '-' + k;
        this.attrs[a] = {
          from: this.target.attrs[a],
          to:   o[k]
        };
      };

      return this;
    };
  });
  
  SVG.extend(SVG.FX, {

    // rotation
    rotate: function(d) {
      return this.transform({
        rotation: d || 0
      });
    },

    // skew
    skew: function(x, y) {
      return this.transform({
        skewX: x || 0,
        skewY: y || 0
      });
    }

  });
}



