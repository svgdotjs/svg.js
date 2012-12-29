
SVG.Container = {
  
  add: function(e, i) {
    if (!this.has(e)) {
      i = i == null ? this.children().length : i;
      this.children().splice(i, 0, e);
      this.node.insertBefore(e.node, this.node.childNodes[i] || null);
      e.parent = this;
    }
    
    return this;
  },
  
  put: function(e, i) {
    this.add(e, i);
    return e;
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
    
    return this.remove(d).add(d, 0);
  },
  
  group: function() {
    return this.put(new SVG.G());
  },
  
  rect: function(w, h) {
    return this.put(new SVG.Rect().size(w, h));
  },
  
  circle: function(d) {
    return this.ellipse(d);
  },
  
  ellipse: function(w, h) {
    return this.put(new SVG.Ellipse().size(w, h));
  },
  
  polyline: function(p) {
    return this.put(new SVG.Polyline().plot(p));
  },
  
  polygon: function(p) {
    return this.put(new SVG.Polygon().plot(p));
  },
  
  path: function(d) {
    return this.put(new SVG.Path().plot(d));
  },
  
  image: function(s, w, h) {
    w = w != null ? w : 100;
    return this.put(new SVG.Image().load(s).size(w, h != null ? h : w));
  },
  
  text: function(t) {
    return this.put(new SVG.Text().text(t));
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