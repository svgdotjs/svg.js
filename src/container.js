
// methods for container elements like SVG.Doc, SVG.Group, SVG.Defs, ...
SVG.Container = {
  
  // add given element at goven position
  add: function(e, i) {
    if (!this.has(e)) {
      i = i == null ? this.children().length : i;
      this.children().splice(i, 0, e);
      this.node.insertBefore(e.node, this.node.childNodes[i] || null);
      e.parent = this;
    }
    
    return this;
  },
  
  // basically does the same as add() but returns the added element rather than 'this'
  put: function(e, i) {
    this.add(e, i);
    return e;
  },
  
  // chacks if the given element is a child
  has: function(e) {
    return this.children().indexOf(e) >= 0;
  },
  
  // returns all child elements and initializes store array if non existant
  children: function() {
    return this._children || (this._children = []);
  },
  
  // iterates over all children
  each: function(b) {
    var i,
        c = this.children();
    
    // iteralte all shapes
    for (i = 0, l = c.length; i < l; i++)
      if (c[i] instanceof SVG.Shape)
        b.apply(c[i], [i, c]);
    
    return this;
  },
  
  // remove a given child element
  remove: function(e) {
    return this.removeAt(this.children().indexOf(e));
  },
  
  // remove child element at a given position
  removeAt: function(i) {
    if (0 <= i && i < this.children().length) {
      var e = this.children()[i];
      this.children().splice(i, 1);
      this.node.removeChild(e.node);
      e.parent = null;
    }
    
    return this;
  },
  
  // returns defs element and initializes store array if non existant
  defs: function() {
    return this._defs || (this._defs = this.put(new SVG.Defs(), 0));
  },
  
  // re-level defs to first positon in element stack
  level: function() {
    return this.remove(d).put(this.defs(), 0);
  },
  
  // create a group element
  group: function() {
    return this.put(new SVG.G());
  },
  
  // create a rect element
  rect: function(w, h) {
    return this.put(new SVG.Rect().size(w, h));
  },
  
  // create circle element, based on ellipse
  circle: function(d) {
    return this.ellipse(d);
  },
  
  // create and ellipse
  ellipse: function(w, h) {
    return this.put(new SVG.Ellipse().size(w, h));
  },
  
  // create a polyline element
  polyline: function(p) {
    return this.put(new Wrap(new SVG.Polyline())).plot(p);
  },
  
  // create a polygon element
  polygon: function(p) {
    return this.put(new Wrap(new SVG.Polygon())).plot(p);
  },
  
  // create a wrapped path element
  path: function(d) {
    return this.put(new Wrap(new SVG.Path())).plot(d);
  },
  
  // create image element, load image and set its size
  image: function(s, w, h) {
    w = w != null ? w : 100;
    return this.put(new SVG.Image().load(s).size(w, h != null ? h : w));
  },
  
  // create text element
  text: function(t) {
    return this.put(new SVG.Text().text(t));
  },
  
  // create nested svg document
  nested: function(s) {
    return this.put(new SVG.Nested());
  },
  
  // create element in defs
  gradient: function(t, b) {
    return this.defs().gradient(t, b);
  },
  
  // create masking element
  mask: function() {
    return this.defs().put(new SVG.Mask());
  },
  
  // get first child, skipping the defs node
  first: function() {
    return this.children()[1];
  },
  
  // let the last child
  last: function() {
    return this.children()[this.children().length - 1];
  },
  
  // clears all elements of this container
  clear: function() {
    this._children = [];
    
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild);
    
    return this;
  },
  
  // hack for safari preventing text to be rendered in one line,
  // basically it sets the position of the svg node to absolute
  // when the dom is loaded, and resets it to relative a few ms later.
  stage: function() {
    var r, e = this;
    
    r = function() {
      if (document.readyState === 'complete') {
        e.attr('style', 'position:absolute;');
        setTimeout(function() { e.attr('style', 'position:relative;'); }, 5);
      } else {
        setTimeout(r, 10);
      }
    };
    
    r();
    
    return this;
  }
  
};