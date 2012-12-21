
SVG.Element = function Element(n) {
  this.node = n;
  this.attrs = {};
  
  this._s = ('size family weight stretch variant style').split(' ');
};

// Add element-specific functions
SVG.extend(SVG.Element, {
  
  // move element to given x and y values
  move: function(x, y) {
    return this.attr({ x: x, y: y });
  },
  
  // set element size to given width and height
  size: function(w, h) {
    return this.attr({ width: w, height: h });
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
  mother: function() {
    return this.parentDoc();
  },
  
  // set svg element attribute
  attr: function(a, v, n) {
    if (arguments.length < 2) {
      if (typeof a == 'object')
        for (v in a) this.attr(v, a[v]);
        
      else if (this._isStyle(a))
        return a == 'text' ?
                 this.content :
               a == 'leading' ?
                 this[a] :
                 this.style[a];
        
      else
        return this.attrs[a];
    
    } else {
      this.attrs[a] = v;
      if (a == 'x' && this._isText())
        for (var i = this.lines.length - 1; i >= 0; i--)
          this.lines[i].attr(a, v);
      else
        n != null ?
          this.node.setAttributeNS(n, a, v) :
          this.node.setAttribute(a, v);
      
      if (this._isStyle(a)) {
        a == 'text' ?
          this.text(v) :
        a == 'leading' ?
          this[a] = v :
          this.style[a] = v;
      
        this.text(this.content);
      }
    }
    
    return this;
  },
  
  // transformations
  transform: function(t, r) {
    var n = [],
        s = this.attr('transform') || '',
        l = s.match(/([a-z]+\([^\)]+\))/g) || [];
    
    if (r !== true) {
      var v = t.match(/^([A-Za-z\-]+)/)[1],
          r = new RegExp('^' + v);
      
      for (var i = 0, s = l.length; i < s; i++)
        if (!r.test(l[i]))
          n.push(l[i]);
      
    } else
      n = l;
    
    n.push(t);
    
    return this.attr('transform', n.join(' '));
  },

  // get bounding box
  bbox: function() {
    var b = this.node.getBBox();
    
    b.cx = b.x + b.width / 2;
    b.cy = b.y + b.height / 2;
    
    return b;
  },
  
  // private: find svg parent
  _parent: function(pt) {
    var e = this;

    while (e != null && !(e instanceof pt))
      e = e.parent;

    return e;
  },
  
  // private: is this text style
  _isStyle: function(a) {
    return typeof a == 'string' && this._isText() ? (/^font|text|leading/).test(a) : false;
  },
  
  // private: element type tester
  _isText: function() {
    return this instanceof SVG.Text;
  }
  
});
