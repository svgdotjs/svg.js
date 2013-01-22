SVG.Wrap = function Wrap(element) {
  this.constructor.call(this, SVG.create('g'));
  
  /* insert and store child */
  this.node.insertBefore(element.node, null);
  this.child = element;
  this.type = element.node.nodeName;
};

// inherit from SVG.Shape
SVG.Wrap.prototype = new SVG.Shape();

SVG.extend(SVG.Wrap, {
  // Move wrapper around
  move: function(x, y) {
    return this.transform({
      x: x,
      y: y
    });
  },
  // Set the actual size in pixels
  size: function(width, height) {
    var scale = width / this._b.width;
    
    this.child.transform({
      scaleX: scale,
      scaleY: height != null ? height / this._b.height : scale
    });

    return this;
  },
  // Move by center
  center: function(x, y) {
    return this.move(
      x + (this._b.width  * this.child.trans.scaleX) / -2,
      y + (this._b.height * this.child.trans.scaleY) / -2
    );
  },
  // Create distributed attr
  attr: function(a, v, n) {
    /* call individual attributes if an object is given */
    if (typeof a == 'object') {
      for (v in a) this.attr(v, a[v]);
    
    /* act as a getter if only one argument is given */
    } else if (arguments.length < 2) {
      return a == 'transform' ? this.attrs[a] : this.child.attrs[a];
    
    /* apply locally for certain attributes */
    } else if (a == 'transform') {
      this.attrs[a] = v;
      
      n != null ?
        this.node.setAttributeNS(n, a, v) :
        this.node.setAttribute(a, v);
    
    /* apply attributes to child */
    } else {
      this.child.attr(a, v, n);
    }
    
    return this;
  },
  // Distribute plot method to child
  plot: function(data) {
    /* plot new shape */
    this.child.plot(data);
    
    /* get and store new bbox */
    this._b = this.child.bbox();
    
    /* reposition element withing wrapper */
    this.child.transform({
      x: -this._b.x,
      y: -this._b.y
    });
    
    return this;
  }
  
});