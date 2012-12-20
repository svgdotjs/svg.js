
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
  
  levelDefs: function() {
    var d = this.defs();
    
    this.remove(d).add(d, 0);
    
    return this;
  },
  
  group: function() {
    var e = new SVG.G();
    this.add(e);
    
    return e;
  },
  
  rect: function(v) {
    return this.place(new SVG.Rect(), v);
  },
  
  circle: function(v) {
    var g;
    
    if (v != null) {
      g = { x: v.x, y: v.y };
      
      if (v.r || v.radius)
        g.width = g.height = (v.r || v.radius) * 2;
      else
        g.width = g.height = v.width || v.height;
    }
    
    return this.place(new SVG.Circle(), g);
  },
  
  ellipse: function(v) {
    var g;
    
    if (v != null) {
      g = { x: v.x, y: v.y };
      
      if (v.width)  g.width  = v.width;
      if (v.height) g.height = v.height;
      if (v.rx)     g.width  = v.rx * 2;
      if (v.ry)     g.height = v.ry * 2;
    }
    
    return this.place(new SVG.Ellipse(), g);
  },
  
  path: function(v) {
    return this.place(new SVG.Path(), v);
  },
  
  image: function(v) {
    return this.place(new SVG.Image(), v);
  },
  
  text: function(v) {
    return this.place(new SVG.Text(), v);
  },
  
  place: function(e, v) {
    if (v != null) {
      if (v.x != null && v.y != null)
        e.move(v.x, v.y);
      
      if (v.width != null && v.height != null)
        e.size(v.width, v.height);
      
      v.data != null ?
        e.data(v.data) :
      v.src != null ?
        e.load(v.src) :
      v.text != null ?
        e.text(v.text) :
      void 0;
    }
    
    this.add(e);
    
    return e;
  }
  
};