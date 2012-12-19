
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
    
    //-D if (this.attrs['fill-opacity'] == null)
    //-D   this.fill({ opacity: 0 });

    return this;
  }
  
});

// Add element-specific functions
SVG.extend(SVG.Element, {
  
  // rotation
  rotate: function(o) {
    var b = this.bbox();
    
    if (o.x == null) o.x = b.cx;
    if (o.y == null) o.y = b.cy;

    return this.transform('rotate(' + (o.deg || 0) + ' ' + o.x + ' ' + o.y + ')', o.absolute);
  }
  
});

// Add group-specific functions
SVG.extend(SVG.G, {
  
  // move using translate
  move: function(x, y) {
    return this.transform('translate(' + x + ' ' + y + ')', true);
  }
  
});




