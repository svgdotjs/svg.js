SVG.FX = function FX(element) {
  /* store target element */
  this.target = element;
};

//
SVG.extend(SVG.FX, {
  // Add animation parameters and start animation
  animate: function(duration, ease) {
    /* ensure default duration and easing */
    duration = duration == null ? 1000 : duration;
    ease = ease || '<>';
    
    var akeys, tkeys, tvalues,
        element   = this.target,
        fx        = this,
        start     = (new Date).getTime(),
        finish    = start + duration;
    
    /* start animation */
    this.interval = setInterval(function(){
      var index,
          time = (new Date).getTime(),
          pos = time > finish ? 1 : (time - start) / duration;
      
      /* collect attribute keys */
      if (akeys == null) {
        akeys = [];
        for (var key in fx.attrs)
          akeys.push(key);
      };
      
      /* collect transformation keys */
      if (tkeys == null) {
        tkeys = [];
        for (var key in fx.trans)
          tkeys.push(key);
        
        tvalues = {};
      };
      
      /* apply easing */
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
      
      /* run all position properties */
      if (fx._move)
        element.move(fx._at(fx._move.x, pos), fx._at(fx._move.y, pos));
      else if (fx._center)
        element.move(fx._at(fx._center.x, pos), fx._at(fx._center.y, pos));
      
      /* run all size properties */
      if (fx._size)
        element.size(fx._at(fx._size.width, pos), fx._at(fx._size.height, pos));
      
      /* animate attributes */
      for (index = akeys.length - 1; index >= 0; index--)
        element.attr(akeys[index], fx._at(fx.attrs[akeys[index]], pos));
      
      /* animate transformations */
      if (tkeys.length > 0) {
        for (index = tkeys.length - 1; index >= 0; index--)
          tvalues[tkeys[index]] = fx._at(fx.trans[tkeys[index]], pos);
        
        element.transform(tvalues);
      }
      
      /* finish off animation */
      if (time > finish) {
        clearInterval(fx.interval);
        fx._after ? fx._after.apply(element, [fx]) : fx.stop();
      }
        
    }, duration > 10 ? 10 : duration);
    
    return this;
  },
  // Add animatable attributes
  attr: function(a, v, n) {
    if (typeof a == 'object')
      for (var key in a)
        this.attr(key, a[key]);
    
    else
      this.attrs[a] = { from: this.target.attr(a), to: v };
    
    return this;  
  },
  // Add animatable transformations
  transform: function(o) {
    for (var key in o)
      this.trans[key] = { from: this.target.trans[key], to: o[key] };
    
    return this;
  },
  // Add animatable move
  move: function(x, y) {
    var box = this.target.bbox();
    
    this._move = {
      x: { from: box.x, to: x },
      y: { from: box.y, to: y }
    };
    
    return this;
  },
  // Add animatable size
  size: function(width, height) {
    var box = this.target.bbox();
    
    this._size = {
      width:  { from: box.width,  to: width  },
      height: { from: box.height, to: height }
    };
    
    return this;
  },
  // Add animatable center
  center: function(x, y) {
    var box = this.target.bbox();
    
    this._move = {
      x: { from: box.cx, to: x },
      y: { from: box.cy, to: y }
    };
    
    return this;
  },
  // Callback after animation
  after: function(after) {
    this._after = after;
    
    return this;
  },
  // Stop running animation
  stop: function() {
    /* stop current animation */
    clearInterval(this.interval);
    
    /* reset storage for properties that need animation */
    this.attrs  = {};
    this.trans  = {};
    this._move  = null;
    this._size  = null;
    this._after = null;
    
    return this;
  },
  // Private: at position according to from and to
  _at: function(o, pos) {
    /* if a number, recalculate pos */
    return typeof o.from == 'number' ?
      o.from + (o.to - o.from) * pos :
    
    /* if animating to a color */
    o.to.r || /^#/.test(o.to) ?
      this._color(o, pos) :
    
    /* for all other values wait until pos has reached 1 to return the final value */
    pos < 1 ? o.from : o.to;
  },
  // Private: tween color
  _color: function(o, pos) {
    var from, to;
    
    /* convert FROM hex to rgb */
    from = this._h2r(o.from || '#000');
    
    /* convert TO hex to rgb */
    to = this._h2r(o.to);
    
    /* tween color and return hex */
    return this._r2h({
      r: ~~(from.r + (to.r - from.r) * pos),
      g: ~~(from.g + (to.g - from.g) * pos),
      b: ~~(from.b + (to.b - from.b) * pos)
    });
  },
  // Private: convert hex to rgb object
  _h2r: function(hex) {
    /* parse full hex */
    var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this._fh(hex));
    
    /* if the hex is successfully parsed, return it in rgb, otherwise return black */
    return match ? {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16)
    } : { r: 0, g: 0, b: 0 };
  },
  // Private: convert rgb object to hex string
  _r2h: function(rgb) {
    return '#' + this._c2h(rgb.r) + this._c2h(rgb.g) + this._c2h(rgb.b);
  },
  // Private: convert component to hex
  _c2h: function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  },
  // Private: force potential 3-based hex to 6-based 
  _fh: function(hex) {
    return hex.length == 4 ?
      [ '#',
        hex.substring(1, 2), hex.substring(1, 2),
        hex.substring(2, 3), hex.substring(2, 3),
        hex.substring(3, 4), hex.substring(3, 4)
      ].join('') : hex;
  }
  
});
//
SVG.extend(SVG.Element, {
  // Get fx module or create a new one, then animate with given duration and ease
  animate: function(duration, ease) {
    return (this._fx || (this._fx = new SVG.FX(this))).stop().animate(duration, ease);
  },
  // Stop current animation; this is an alias to the fx instance
  stop: function() {
    this._fx.stop();
    
    return this;
  }
  
});
// Usage:

//     rect.animate(1500, '>').move(200, 300).after(function() {
//       this.fill({ color: '#f06' });
//     });

