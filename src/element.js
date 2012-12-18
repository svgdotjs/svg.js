
SVG.Element = function Element(n) {
  this.node = n;
  this.attrs = {};
};

// Add element-specific functions
SVG.extend(SVG.Element, {
  
  // move element to given x and y values
  move: function(x, y) {
    this.attr('x', x);
    this.attr('y', y);

    return this;
  },
  
  // set element size to given width and height
  size: function(w, h) {
    this.attr('width', w);
    this.attr('height', h);

    return this;
  },
  
  // remove element
  remove: function() {
    return this.parent != null ? this.parent.remove(this) : void 0;
  },

  // get parent document
  parentDoc: function() {
    return this._parent(SVG.Doc);
  },

  // get parent svg wrapper
  parentSVG: function() {
    return this.parentDoc();
  },
  
  // set svg element attribute
  attr: function(a, v, n) {
    
    if (arguments.length < 2) {
      if (typeof a == 'object')
        for (v in a) this.attr(v, a[v]);
      else
        return this.attrs[a];
    
    } else {
      this.attrs[a] = v;
      n != null ?
        this.node.setAttributeNS(n, a, v) :
        this.node.setAttribute(a, v);
        
    }
    
    return this;
  },
  
  // transformations
  transform: function(t, a) {
    var n = [],
        s = this.attr('transform') || '',
        l = s.match(/([a-z]+\([^\)]+\))/g) || [];
    
    if (a === true) {
      var v = t.match(/^([A-Za-z\-]+)/)[1],
          r = new RegExp('^' + v);
      
      for (var i = 0, s = l.length; i < s; i++)
        if (!r.test(l[i]))
          n.push(l[i]);
    } else
      n = l;
    
    n.push(t);
    
    this.attr('transform', n.join(' '));
    
    return this;
  },

  // get bounding box
  bbox: function() {
    var b = this.node.getBBox();
    
    b.cx = b.x + b.width / 2;
    b.cy = b.y + b.height / 2;
    
    return b;
  },
  
  // clip element using another element
  clip: function(block) {
    var p = this.parentSVG().defs().clipPath();
    block(p);

    return this.clipTo(p);
  },

  // distribute clipping path to svg element
  clipTo: function(p) {
    return this.attr('clip-path', 'url(#' + p.id + ')');
  },

  // private: find svg parent
  _parent: function(pt) {
    var e = this;

    while (e != null && !(e instanceof pt))
      e = e.parent;

    return e;
  }
  
});
