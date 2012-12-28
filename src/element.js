
SVG.Element = function Element(n) {
  this.node = n;
  this.attrs = {};
  this.trans = {
    x:        0,
    y:        0,
    scaleX:   1,
    scaleY:   1,
    rotation: 0,
    skewX:    0,
    skewY:    0
  };
  
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
  
  // position element by its center
  center: function(x, y) {
    var b = this.bbox();
    
    return this.move(x - b.width / 2, y - b.height / 2);
  },
  
  // remove element
  remove: function() {
    return this.parent != null ? this.parent.remove(this) : void 0;
  },
  
  // get parent document
  parentDoc: function() {
    return this._parent(SVG.Doc);
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
  
  transform: function(o) {
    // act as a getter if the first argument is a string
    if (typeof o === 'string')
      return this.trans[o];
      
    // ... otherwise continue as a setter
    var k,
        t = [],
        b = this.bbox(),
        s = this.attr('transform') || '',
        l = s.match(/[a-z]+\([^\)]+\)/g) || [];
    
    // merge values
    for (k in o)
      if (o[k] != null)
        this.trans[k] = o[k];
    
    // alias current transformations
    o = this.trans;
    
    // add rotate
    if (o.rotation != 0)
      t.push('rotate(' + o.rotation + ',' + (o.cx != null ? o.cx : b.cx) + ',' + (o.cy != null ? o.cy : b.cy) + ')');
    
    // add scale
    t.push('scale(' + o.scaleX + ',' + o.scaleY + ')');
    
    // add skew on x axis
    if (o.skewX != 0)
      t.push('skewX(' + o.skewX + ')');
    
    // add skew on y axis
    if (o.skewY != 0)
      t.push('skewY(' + o.skewY + ')')
    
    // add translate
    t.push('translate(' + o.x + ',' + o.y + ')');
    
    // add only te required transformations
    return this.attr('transform', t.join(' '));
  },
  
  // get bounding box
  bbox: function() {
    // actual bounding box
    var b = this.node.getBBox();
    
    return {
      // include translations on x an y
      x:      b.x + this.trans.x,
      y:      b.y + this.trans.y,
      
      // add the center
      cx:     b.x + this.trans.x + b.width  / 2,
      cy:     b.y + this.trans.y + b.height / 2,
      
      // plain width and height
      width:  b.width,
      height: b.height
    };
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
