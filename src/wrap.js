
function Wrap(e) {
  this.constructor.call(this, SVG.create('g'));
  
  // insert and store child
  this.node.insertBefore(e.node, null);
  this.child = e;
};

// inherit from SVG.Shape
Wrap.prototype = new SVG.Shape();

// include the container object
SVG.extend(Wrap, {
  
  // move wrapper around
  move: function(x, y) {
    return this.center(
      x + (this._b.width  * this.child.trans.scaleX) / 2,
      y + (this._b.height * this.child.trans.scaleY) / 2
    );
  },
  
  // set the actual size in pixels
  size: function(w, h) {
    var s = w / this._b.width;
    
    this.child.transform({
      scaleX: s,
      scaleY: h != null ? h / this._b.height : s
    });

    return this;
  },
  
  // move by center
  center: function(x, y) {
    return this.transform({ x: x, y: y });
  },
  
  // create distributed attr
  attr: function(a, v, n) {
    // call individual attributes if an object is given
    if (typeof a == 'object') {
      for (v in a) this.attr(v, a[v]);
    
    // act as a getter if only one argument is given
    } else if (arguments.length < 2) {
      return a == 'transform' ? this.attrs[a] : this.child.attrs[a];
    
    // apply locally for certain attributes
    } else if (a == 'transform') {
      this.attrs[a] = v;
      
      n != null ?
        this.node.setAttributeNS(n, a, v) :
        this.node.setAttribute(a, v);
    
    // apply attributes to child
    } else {
      this.child.attr(a, v, n);
    }
    
    return this;
  },
  
  // distribute plot method to child
  plot: function(d) {
    // plot new shape
    this.child.plot(d);
    
    // get new bbox and store size
    this._b = this.child.bbox();
    
    // reposition element withing wrapper
    this.child.transform({
      x: -this._b.cx,
      y: -this._b.cy
    });
    
    return this;
  }
  
});