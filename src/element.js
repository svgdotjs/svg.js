
SVG.Element = function Element(node) {
  this.node = node;
  this.attrs = {};
};

// Add element-specific functions
SVG.Utils.merge(SVG.Element, {
  
  // move element to given x and y values
  move: function(x, y) {
    this.attr('x', x);
    this.attr('y', y);

    return this;
  },

  // set element opacity
  opacity: function(o) {
    return this.attr('opacity', Math.max(0, Math.min(1, o)));
  },

  // set element size to given width and height
  size: function(w, h) {
    this.attr('width', w);
    this.attr('height', h);

    return this;
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

  // remove element
  destroy: function() {
    return this.parent != null ? this.parent.remove(this) : void 0;
  },

  // get parent document
  parentDoc: function() {
    return this._parent(SVG.Document);
  },

  // get parent svg wrapper
  parentSVG: function() {
    return this.parentDoc();
  },

  //_D // set svg element attribute
  //_D setAttribute: function(a, v, ns) {
  //_D   this.attrs[a] = v;
  //_D 
  //_D   if (ns != null)
  //_D     this.node.setAttributeNS(ns, a, v);
  //_D   else
  //_D     this.node.setAttribute(a, v);
  //_D 
  //_D   return this;
  //_D },

  // set svg element attribute
  attr: function(v) {
    var a = arguments;
    
    this.attrs[a[0]] = a[1];
    
    if (typeof v == 'object')
      for (var k in v)
        this.attr(k, v[k]);
        
    else if (a.length == 2)
      this.node.setAttribute(a[0], a[1]);
      
    else if (a.length == 3)
      this.node.setAttributeNS(a[2], a[0], a[1]);

    return this;
  },

  // get bounding box
  bbox: function() {
    return this.node.getBBox();
  },

  // private: find svg parent
  _parent: function(pt) {
    var e = this;

    while (e != null && !(e instanceof pt))
      e = e.parent;

    return e;
  }
  
});
