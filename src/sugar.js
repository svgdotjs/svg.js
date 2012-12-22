
// Add shape-specific functions
SVG.extend(SVG.Shape, {
  
  // set fill color and opacity
  fill: function(f) {
    if (f.color != null)
      this.attr('fill', f.color);

    if (f.opacity != null)
      this.attr('fill-opacity', f.opacity);

    return this;
  },

  // set stroke color and opacity
  stroke: function(s) {
    if (s.color)
      this.attr('stroke', s.color);
    
    var a = ('width opacity linecap linejoin miterlimit dasharray dashoffset').split(' ');
    
    for (var i = a.length - 1; i >= 0; i--)
      if (s[a[i]] != null)
        this.attr('stroke-' + a[i], s[a[i]]);
    
    return this;
  }
  
});

// Add element-specific functions
SVG.extend(SVG.Element, {
  
  // rotation
  rotate: function(o) {
    var b = this.bbox();
    
    if (typeof o == 'number')
      o = { deg: o };
    
    return this.transform(
      'rotate(' +
      (o.deg || 0) + ' ' +
      (o.x == null ? b.cx : o.x) + ' ' +
      (o.y == null ? b.cx : o.y) + ')',
    o.relative);
  }
  
});

// Add group-specific functions
SVG.extend(SVG.G, {
  
  // move using translate
  move: function(x, y) {
    return this.transform('translate(' + x + ' ' + y + ')');
  }
  
});

// Add text-specific functions
SVG.extend(SVG.Text, {
  
  // set font 
  font: function(o) {
    var a = {};
    
    for (var k in o)
      k == 'leading' ?
        a[k] = o[k] :
      k == 'anchor' ?
        a['text-anchor'] = o[k] :
      this._s.indexOf(k) > -1 ?
        a['font-'+ k] = o[k] :
        void 0;
    
    return this.attr(a).text(this.content);
  },
  
});



