
SVG.Container = {
  
  add: function(e, i) {
    if (!this.has(e)) {
      i = i == null ? this.children().length : i;
      this.children().splice(i, 0, e);
      this.node.insertBefore(e.node, this.node.childNodes[i]);
      e.parent = this;
    }
    
    return this;
  },
  
  has: function(e) {
    return this.children().indexOf(e) >= 0;
  },
  
  children: function() {
    return this._children || (this._children = []);
  },
  
  remove: function(e) {
    return this.removeAt(this.children().indexOf(e));
  },
  
  removeAt: function(i) {
    if (0 <= i && i < this.children().length) {
      var e = this.children()[i];
      this.children().splice(i, 1);
      this.node.removeChild(e.node);
      e.parent = null;
    }
    
    return this;
  },
  
  defs: function() {
    if (this._defs == null) {
      this._defs = new SVG.Defs();
      this.add(this._defs, 0);
    }
    
    return this._defs;
  },
  
  level: function() {
    var d = this.defs();
    
    this.remove(d).add(d, 0);
    
    return this;
  },
  
  group: function() {
    var e = new SVG.G();
    this.add(e);
    
    return e;
  },
  
  rect: function(w, h) {
    var e = new SVG.Rect().size(w, h);
    this.add(e);
    
    return e;
  },
  
  circle: function(r) {
    var e = new SVG.Circle().size(r);
    this.add(e);
    
    return e;
  },
  
  ellipse: function(w, h) {
    var e = new SVG.Ellipse().size(w, h);
    this.add(e);
    
    return e;
  },
  
  path: function(d) {
    var e = new SVG.Path().plot(d);
    this.add(e);
    
    return e;
  },
  
  image: function(s) {
    var e = new SVG.Image().load(s);
    this.add(e);
    
    return e;
  },
  
  text: function(t) {
    var e = new SVG.Text().text(t);
    this.add(e);
    
    return e;
  },
  
  gradient: function(t, b) {
    return this.defs().gradient(t, b);
  },
  
  // hack for safari preventing text to be rendered in one line,
  // basically it sets the position of the svg node to absolute
  // when the dom is loaded, and resets it to relative a few ms later.
  stage: function() {
    var r, e = this;
    
    r = function() {
      if (document.readyState === 'complete') {
        e.attr('style', 'position:absolute;left:0;top:0;');
        setTimeout(function() { e.attr('style', 'position:relative;'); }, 5);
      } else {
        setTimeout(r, 10);
      }
    };
    
    r();
    
    return this;
  }
  
};