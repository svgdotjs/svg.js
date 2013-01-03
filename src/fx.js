
SVG.FX = function FX(e) {
  // store target element
  this.target = e;
};

// add FX methods
SVG.extend(SVG.FX, {
  
  // animation parameters and animate
  animate: function(duration, ease) {
    // ensure default duration adn easing
    duration = duration || 1000;
    ease = ease || '<>';
    
    var akeys, tkeys, tvalues,
        element   = this.target,
        fx        = this,
        start     = (new Date).getTime(),
        finish    = start + duration;
    
    // start animation
    this.interval = setInterval(function(){
      var i,
          time = (new Date).getTime(),
          pos = time > finish ? 1 : (time - start) / duration;
      
      // collect attribute keys
      if (akeys == null) {
        akeys = [];
        for (var k in fx.attrs)
          akeys.push(k);
      };
      
      // collect transformation keys
      if (tkeys == null) {
        tkeys = [];
        for (var k in fx.trans)
          tkeys.push(k);
        
        tvalues = {};
      };
      
      // apply easing
      pos = ease == '<>' ?
        (-Math.cos(pos * Math.PI) / 2) + 0.5 :
      ease == '>' ?
        Math.sin(pos * Math.PI / 2) :
      ease == '<' ?
        -Math.cos(pos * Math.PI / 2) + 1 :
      ease == '-' ?
        pos :
      typeof ease == 'function' ?
        ease(pos) :
        pos;
      
      // run all position properties
      if (fx._move)
        element.move(fx._at(fx._move.x, pos), fx._at(fx._move.y, pos));
      else if (fx._center)
        element.move(fx._at(fx._center.x, pos), fx._at(fx._center.y, pos));
      
      // run all size properties
      if (fx._size)
        element.size(fx._at(fx._size.width, pos), fx._at(fx._size.height, pos));
      
      // animate attributes
      for (i = akeys.length - 1; i >= 0; i--)
        element.attr(akeys[i], fx._at(fx.attrs[akeys[i]], pos));
      
      // animate transformations
      if (tkeys.length > 0) {
        for (i = tkeys.length - 1; i >= 0; i--)
          tvalues[tkeys[i]] = fx._at(fx.trans[tkeys[i]], pos);
        
        element.transform(tvalues);
      }
      
      // finish off animation
      if (time > finish) {
        clearInterval(fx.interval);
        fx._after ? fx._after.apply(element) : fx.stop();
      }
        
    }, 10);
    
    return this;
  },
  
  // animated attributes
  attr: function(a, v, n) {
    if (typeof a == 'object')
      for (var k in a)
        this.attr(k, a[k]);
    
    else
      this.attrs[a] = { from: this.target.attr(a), to: v };
  },
  
  // animated transformations
  transform: function(o) {
    for (var k in o)
      this.trans[k] = { from: this.target.trans[k], to: o[k] };
    
    return this;
  },
  
  // animated move
  move: function(x, y) {
    var b = this.target.bbox();
    
    this._move = {
      x: { from: b.x, to: x },
      y: { from: b.y, to: y }
    };
    
    return this;
  },
  
  // animated size
  size: function(w, h) {
    var b = this.target.bbox();
    
    this._size = {
      width:  { from: b.width,  to: w },
      height: { from: b.height, to: h }
    };
    
    return this;
  },
  
  // animated center
  center: function(x, y) {
    var b = this.target.bbox();
    
    this._move = {
      x: { from: b.cx, to: x },
      y: { from: b.cy, to: y }
    };
    
    return this;
  },
  
  // stop animation
  stop: function() {
    // stop current animation
    clearInterval(this.interval);
    
    // create / reset storage for properties that need animation
    this.attrs  = {};
    this.trans  = {};
    this._move  = null;
    this._size  = null;
    this._after = null;
    
    return this;
  },
  
  // private: at position according to from and to
  _at: function(o, p) {
    // if a number, calculate pos
    return typeof o.from == 'number' ?
      o.from + (o.to - o.from) * p :
    
    // if animating to a color
    o.to.r || /^#/.test(o.to) ?
      this._color(o, p) :
    
    // for all other values wait until pos has reached 1 to return the final value
    p < 1 ? o.from : o.to;
  },
  
  // private: tween color
  _color: function(o, p) {
    // convert hex to rgb and store it for further reference
    if (typeof o.from !== 'object')
      o.from = this._h2r(o.from || '#000');
    
    // convert hex to rgb and store it for further reference
    if (typeof o.to !== 'object')
      o.to = this._h2r(o.to);
    
    // tween color and return hex
    return this._r2h({
      r: ~~(o.from.r + (o.to.r - o.from.r) * p),
      g: ~~(o.from.g + (o.to.g - o.from.g) * p),
      b: ~~(o.from.b + (o.to.b - o.from.b) * p)
    });
  },
  
  // private: convert hex to rgb object
  _h2r: function(h) {
    // parse full hex
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this._fh(h));
    
    // if the hex is successfully parsed, return it in rgb, otherwise return black
    return m ? {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16)
    } : { r: 0, g: 0, b: 0 };
  },
  
  // private: convert rgb object to hex string
  _r2h: function(r) {
    return '#' + (r.r + 256 * r.g + 65536 * r.b).toString(16);
  },
  
  // private: force potential 3-based hex to 6-based 
  _fh: function(h) {
    return h.length == 4 ?
      [ '#',
        h.substring(1, 2), h.substring(1, 2),
        h.substring(2, 3), h.substring(2, 3),
        h.substring(3, 4), h.substring(3, 4)
      ].join('') : h;
  }
  
});


// delay: delay animation for a given amount of ms
// after: callback for when animation has finished
['delay', 'after'].forEach(function(m) {
  SVG.FX.prototype[m] = function(v) {
    this['_' + m] = v;
    
    return this;
  };
});


// make SVG.Element FX-aware
SVG.extend(SVG.Element, {
  
  // get fx module or create a new one, then animate with given ms and ease
  animate: function(d, e) {
    return (this._fx || (this._fx = new SVG.FX(this))).stop().animate(d, e);
  },
  
  // stop current animation
  stop: function() {
    this._fx.stop();
    
    return this;
  }
  
});

