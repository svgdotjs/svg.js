
// ### Used by nearly every other module

//
SVG.Element = function Element(node) {
  /* keep reference to the element node */
  if (this.node = node)
    this.type = node.nodeName;
  
  /* initialize attribute store with defaults */
  this.attrs = {
    'fill-opacity':   1,
    'stroke-opacity': 1,
    'stroke-width':   0,
    x:        0,
    y:        0,
    cx:       0,
    cy:       0,
    width:    0,
    height:   0,
    r:        0,
    rx:       0,
    ry:       0
  };
  
  /* initialize transformation store with defaults */
  this.trans = {
    x:        0,
    y:        0,
    scaleX:   1,
    scaleY:   1,
    rotation: 0,
    skewX:    0,
    skewY:    0
  };

};

//
SVG.extend(SVG.Element, {
  // Move element to given x and y values
  move: function(x, y) {
    return this.attr({
      x: x,
      y: y
    });
  },
  // Move element by its center
  center: function(x, y) {
    var box = this.bbox();
    
    return this.move(x - box.width / 2, y - box.height / 2);
  },
  // Set element size to given width and height
  size: function(width, height) { 
    return this.attr({
      width:  width,
      height: height
    });
  },
  // Clone element
  clone: function() {
    var clone;
    
    /* if this is a wrapped shape */
    if (this instanceof SVG.Wrap) {
      /* build new wrapped shape */
      clone = this.parent[this.child.node.nodeName]();
      clone.attrs = this.attrs;
      
      /* copy child attributes and transformations */
      clone.child.trans = this.child.trans;
      clone.child.attr(this.child.attrs).transform({});
      
      /* re-plot shape */
      if (clone.plot)
        clone.plot(this.child.attrs[this.child instanceof SVG.Path ? 'd' : 'points']);
      
    } else {
      var name = this.node.nodeName;
      
      /* invoke shape method with shape-specific arguments */
      clone = name == 'rect' ?
        this.parent[name](this.attrs.width, this.attrs.height) :
      name == 'ellipse' ?
        this.parent[name](this.attrs.rx * 2, this.attrs.ry * 2) :
      name == 'image' ?
        this.parent[name](this.src) :
      name == 'text' ?
        this.parent[name](this.content) :
      name == 'g' ?
        this.parent.group() :
        this.parent[name]();
      
      clone.attr(this.attrs);
    }
    
    /* copy transformations */
    clone.trans = this.trans;
    
    /* apply attributes and translations */
    return clone.transform({});
  },
  // Remove element
  remove: function() {
    return this.parent != null ? this.parent.remove(this) : void 0;
  },
  // Get parent document
  doc: function() {
    return this._parent(SVG.Doc);
  },
  // Get parent nested document
  nested: function() {
    return this._parent(SVG.Nested);
  },
  // Set svg element attribute
  attr: function(a, v, n) {
    if (arguments.length < 2) {
      /* apply every attribute individually if an object is passed */
      if (typeof a == 'object')
        for (v in a) this.attr(v, a[v]);
      
      /* act as a getter for style attributes */
      else if (this._isStyle(a))
        return a == 'text' ?
                 this.content :
               a == 'leading' ?
                 this[a] :
                 this.style[a];
      
      /* act as a getter if the first and only argument is not an object */
      else
        return this.attrs[a];
    
    } else {
      /* store value */
      this.attrs[a] = v;
      
      /* treat x differently on text elements */
      if (a == 'x' && this._isText())
        for (var i = this.lines.length - 1; i >= 0; i--)
          this.lines[i].attr(a, v);
      
      /* set the actual attribute */
      else
        n != null ?
          this.node.setAttributeNS(n, a, v) :
          this.node.setAttribute(a, v);
      
      /* if the passed argument belongs to the style as well, add it there */
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
  // Manage transformations
  transform: function(o) {
    /* act as a getter if the first argument is a string */
    if (typeof o === 'string')
      return this.trans[o];
      
    /* ... otherwise continue as a setter */
    var key, transform = [];
    
    /* merge values */
    for (key in o)
      if (o[key] != null)
        this.trans[key] = o[key];
    
    /* alias current transformations */
    o = this.trans;
    
    /* add rotation */
    if (o.rotation != 0) {
      var box = this.bbox();
      transform.push('rotate(' + o.rotation + ',' + (o.cx != null ? o.cx : box.cx) + ',' + (o.cy != null ? o.cy : box.cy) + ')');
    }
    
    /* add scale */
    transform.push('scale(' + o.scaleX + ',' + o.scaleY + ')');
    
    /* add skew on x axis */
    if (o.skewX != 0)
      transform.push('skewX(' + o.skewX + ')');
    
    /* add skew on y axis */
    if (o.skewY != 0)
      transform.push('skewY(' + o.skewY + ')')
    
    /* add translation */
    transform.push('translate(' + o.x + ',' + o.y + ')');
    
    /* add only te required transformations */
    return this.attr('transform', transform.join(' '));
  },
  // Get bounding box
  bbox: function() {
    /* actual, native bounding box */
    var box = this.node.getBBox();
    
    return {
      /* include translations on x an y */
      x:      box.x + this.trans.x,
      y:      box.y + this.trans.y,
      
      /* add the center */
      cx:     box.x + this.trans.x + box.width  / 2,
      cy:     box.y + this.trans.y + box.height / 2,
      
      /* plain width and height */
      width:  box.width,
      height: box.height
    };
  },
  // Checks whether the given point inside the bounding box of the element
  inside: function(x, y) {
    var box = this.bbox();
    
    return x > box.x &&
           y > box.y &&
           x < box.x + box.width &&
           y < box.y + box.height;
  },
  // Show element
  show: function() {
    this.node.style.display = '';
    
    return this;
  },
  // Hide element
  hide: function() {
    this.node.style.display = 'none';
    
    return this;
  },
  // Private: find svg parent by instance
  _parent: function(parent) {
    var element = this;
    
    while (element != null && !(element instanceof parent))
      element = element.parent;

    return element;
  },
  // Private: tester method for style detection
  _isStyle: function(attr) {
    return typeof attr == 'string' && this._isText() ? (/^font|text|leading/).test(attr) : false;
  },
  // Private: element type tester
  _isText: function() {
    return this instanceof SVG.Text;
  }
  
});
