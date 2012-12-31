
SVG.Gradient = function Gradient(t) {
  this.constructor.call(this, SVG.create(t + 'Gradient'));
  
  // set unique id
  this.id = 'svgjs_' + (SVG.did++);
  this.attr('id', this.id);
  
  // store type
  this.type = t;
};

// inherit from SVG.Element
SVG.Gradient.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Gradient, SVG.Container);

// add gradient-specific functions
SVG.extend(SVG.Gradient, {
  
  // from position
  from: function(x, y) {
    return this.type == 'radial' ?
             this.attr({ fx: x + '%', fy: y + '%' }) :
             this.attr({ x1: x + '%', y1: y + '%' });
  },
  
  // to position
  to: function(x, y) {
    return this.type == 'radial' ?
             this.attr({ cx: x + '%', cy: y + '%' }) :
             this.attr({ x2: x + '%', y2: y + '%' });
  },
  
  // radius for radial gradient
  radius: function(r) {
    return this.type == 'radial' ?
             this.attr({ r: r + '%' }) :
             this;
  },
  
  // add a color stop
  at: function(o) {
    return this.put(new SVG.Stop(o));
  },
  
  // update gradient
  update: function(b) {
    // remove all stops
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild);
    
    // invoke passed block
    b(this);
    
    return this;
  },
  
  // return the fill id
  fill: function() {
    return 'url(#' + this.id + ')';
  }
  
});

// add def-specific functions
SVG.extend(SVG.Defs, {
  
  // define clippath
  gradient: function(t, b) {
    var e = this.put(new SVG.Gradient(t));
    
    // invoke passed block
    b(e);
    
    return e;
  }
  
});


SVG.Stop = function Stop(o) {
  this.constructor.call(this, SVG.create('stop'));
  
  // immediatelly build stop
  this.update(o);
};

// inherit from SVG.Element
SVG.Stop.prototype = new SVG.Element();

// add mark-specific functions
SVG.extend(SVG.Stop, {
  
  // add color stops
  update: function(o) {
    var i,
        s = '',
        a = ['opacity', 'color'];
    
    // build style attribute
    for (i = a.length - 1; i >= 0; i--)
      if (o[a[i]] != null)
        s += 'stop-' + a[i] + ':' + o[a[i]] + ';';
    
    // set attributes
    return this.attr({
      offset: (o.offset != null ? o.offset : this.attrs.offset || 0) + '%',
      style:  s
    });
  }
  
});

