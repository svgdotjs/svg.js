
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
  rotate: function(d, x, y) {
    var b = this.bbox();
    
    return this.transform({
      rotation: d || 0,
      cx:       x == null ? b.cx : x,
      cy:       y == null ? b.cx : y
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
      this._s.indexOf(k) > -1 ?
        a['font-'+ k] = o[k] :
        void 0;
    
    return this.attr(a).text(this.content);
  }
  
});



