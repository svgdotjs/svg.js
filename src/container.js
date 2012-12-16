
SVG.Container = {
  
  add: function(e) {
    return this.addAt(e);
  },
  
  addAt: function(e, i) {
    if (!this.contains(e)) {
      i = i == null ? this.children().length : i;
      this.children().splice(i, 0, e);
      this.svgElement.insertBefore(e.svgElement, this.svgElement.childNodes[i + 1]);
      e.parent = this;
    }
    
    return this;
  },
  
  contains: function(e) {
    return Array.prototype.indexOf.call(this.children(), e) >= 0;
  },
  
  children: function() {
    return this._children || [];
  },
  
  sendBack: function(e) {
    var i = this.children().indexOf(e);
    if (i !== -1)
      return this.remove(e).addAt(e, i - 1);
  },
  
  bringForward: function(e) {
    var i = this.children().indexOf(e);
    if (i !== -1)
      return this.remove(e).addAt(e, i + 1);
  },
  
  bringToFront: function(e) {
    if (this.contains(e))
      this.remove(e).add(e);
    
    return this;
  },
  
  sendToBottom: function(e) {
    if (this.contains(e))
      this.remove(e).addAt(e, 0);
    
    return this;
  },
  
  remove: function(e) {
    return this.removeAt(this.children().indexOf(e));
  },
  
  removeAt: function(i) {
    if (0 <= i && i < this.children().length) {
      var e = this.children()[i];
      this.children().splice(i, 1);
      this.svgElement.removeChild(e.svgElement);
      e.parent = null;
    }
    
    return this;
  },
  
  defs: function() {
    if (this._defs == null) {
      this._defs = new SVG.Defs();
      this.add(this._defs);
    }
    
    return this._defs;
  },
  
  group: function() {
    var e = new SVG.Group();
    this.add(e);
    
    return e;
  },
  
  svg: function(v) {
    return this.place(new SVG.Nested(), v);
  },
  
  rect: function(v) {
    return this.place(new SVG.Rect(), v);
  },
  
  circle: function(v) {
    return this.place(new SVG.Circle(), {
      x: v != null ? v.x : void 0,
      y: v != null ? v.y : void 0,
      width: (v != null ? (v.width || v.r || v.radius) : void 0),
      height: null
    });
  },
  
  ellipse: function(v) {
    return this.place(new SVG.Ellipse(), {
      x: v != null ? v.x : void 0,
      y: v != null ? v.y : void 0,
      width:  (v != null ? (v.width  || v.rx || v.radiusX) : void 0),
      height: (v != null ? (v.height || v.ry || v.radiusY) : void 0)
    });
  },
  
  path: function(v) {
    return this.place(new SVG.Path(), v);
  },
  
  image: function(v) {
    return this.place(new SVG.Image(), v);
  },
  
  place: function(e, v) {
    if (v != null) {
      if (v.x != null && v.y != null)
        e.move(v.x, v.y);
      
      if (v.width != null && v.height != null)
        e.size(v.width, v.height);
      
      if (v.data != null)
        e.data(v.data);
      
      if (v.src != null)
        e.load(v.src);
    }
    
    this.add(e);
    
    return e;
  }
  
};