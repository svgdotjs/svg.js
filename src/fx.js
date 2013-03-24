SVG.FX = function(element) {
  /* store target element */
  this.target = element
}

//
SVG.extend(SVG.FX, {
  // Add animation parameters and start animation
  animate: function(d, ease, delay) {
    var fx = this
    
    /* dissect object if one is passed */
    if (typeof d == 'object') {
      delay = d.delay
      ease = d.ease
      d = d.duration
    }
    
    /* delay animation */
    this.timeout = setTimeout(function() {
      
      /* ensure default duration and easing */
      d = d == null ? 1000 : d
      ease = ease || '<>'
      
      var akeys, tkeys, skeys
        , interval  = 1000 / 60
        , element   = fx.target
        , start     = new Date().getTime()
        , finish    = start + d

      /* start animation */
      fx.interval = setInterval(function(){
        // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.
        var i, key
          , time = new Date().getTime()
          , pos = time > finish ? 1 : (time - start) / d

        /* collect attribute keys */
        if (akeys == null) {
          akeys = []
          for (key in fx.attrs)
            akeys.push(key)
        }

        /* collect transformation keys */
        if (tkeys == null) {
          tkeys = []
          for (key in fx.trans)
            tkeys.push(key)
        }

        /* collect style keys */
        if (skeys == null) {
          skeys = []
          for (key in fx.styles)
            skeys.push(key)
        }

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
          pos

        /* run all x-position properties */
        if (fx._x)
          element.x(fx._at(fx._x, pos))
        else if (fx._cx)
          element.cx(fx._at(fx._cx, pos))

        /* run all y-position properties */
        if (fx._y)
          element.y(fx._at(fx._y, pos))
        else if (fx._cy)
          element.cy(fx._at(fx._cy, pos))

        /* run all size properties */
        if (fx._size)
          element.size(fx._at(fx._size.width, pos), fx._at(fx._size.height, pos))

        /* run all viewbox properties */
        if (fx._viewbox)
          element.viewbox(
            fx._at(fx._viewbox.x, pos)
          , fx._at(fx._viewbox.y, pos)
          , fx._at(fx._viewbox.width, pos)
          , fx._at(fx._viewbox.height, pos)
          )

        /* animate attributes */
        for (i = akeys.length - 1; i >= 0; i--)
          element.attr(akeys[i], fx._at(fx.attrs[akeys[i]], pos))

        /* animate transformations */
        for (i = tkeys.length - 1; i >= 0; i--)
          element.transform(tkeys[i], fx._at(fx.trans[tkeys[i]], pos))

        /* animate styles */
        for (i = skeys.length - 1; i >= 0; i--)
          element.style(skeys[i], fx._at(fx.styles[skeys[i]], pos))

        /* callback for each keyframe */
        if (fx._during)
          fx._during.call(element, pos, function(from, to) {
            return fx._at({ from: from, to: to }, pos)
          })

        /* finish off animation */
        if (time > finish) {
          clearInterval(fx.interval)
          fx._after ? fx._after.apply(element, [fx]) : fx.stop()
        }

      }, d > interval ? interval : d)
      
    }, delay || 0)
    
    return this
  }
  // Get bounding box of target element
, bbox: function() {
    return this.target.bbox()
  }
  // Add animatable attributes
, attr: function(a, v, n) {
    if (typeof a == 'object')
      for (var key in a)
        this.attr(key, a[key])
    
    else
      this.attrs[a] = { from: this.target.attr(a), to: v }
    
    return this
  }
  // Add animatable transformations
, transform: function(o, v) {
    if (arguments.length == 1) {
      /* parse matrix string */
      o = this.target._parseMatrix(o)
      
      /* dlete matrixstring from object */
      delete o.matrix
      
      /* store matrix values */
      for (v in o)
        this.trans[v] = { from: this.target.trans[v], to: o[v] }
      
    } else {
      /* apply transformations as object if key value arguments are given*/
      var transform = {}
      transform[o] = v
      
      this.transform(transform)
    }
    
    return this
  }
  // Add animatable styles
, style: function(s, v) {
    if (typeof s == 'object')
      for (var key in s)
        this.style(key, s[key])
    
    else
      this.styles[s] = { from: this.target.style(s), to: v }
    
    return this
  }
  // Animatable x-axis
, x: function(x) {
    this._x = { from: this.target.x(), to: x }
    
    return this
  }
  // Animatable y-axis
, y: function(y) {
    this._y = { from: this.target.y(), to: y }
    
    return this
  }
  // Animatable center x-axis
, cx: function(x) {
    this._cx = { from: this.target.cx(), to: x }
    
    return this
  }
  // Animatable center y-axis
, cy: function(y) {
    this._cy = { from: this.target.cy(), to: y }
    
    return this
  }
  // Add animatable move
, move: function(x, y) {
    return this.x(x).y(y)
  }
  // Add animatable center
, center: function(x, y) {
    return this.cx(x).cy(y)
  }
  // Add animatable size
, size: function(width, height) {
    if (this.target instanceof SVG.Text) {
      /* animate font size for Text elements */
      this.attr('font-size', width)
      
    } else {
      /* animate bbox based size for all other elements */
      var box = this.target.bbox()

      this._size = {
        width:  { from: box.width,  to: width  }
      , height: { from: box.height, to: height }
      }
    }
    
    return this
  }
  // Add animatable viewbox
, viewbox: function(x, y, width, height) {
    if (this.target instanceof SVG.Container) {
      var box = this.target.viewbox()
      
      this._viewbox = {
        x:      { from: box.x,      to: x      }
      , y:      { from: box.y,      to: y      }
      , width:  { from: box.width,  to: width  }
      , height: { from: box.height, to: height }
      }
    }
    
    return this
  }
  // Add callback for each keyframe
, during: function(during) {
    this._during = during
    
    return this
  }
  // Callback after animation
, after: function(after) {
    this._after = after
    
    return this
  }
  // Stop running animation
, stop: function() {
    /* stop current animation */
    clearTimeout(this.timeout)
    clearInterval(this.interval)
    
    /* reset storage for properties that need animation */
    this.attrs  = {}
    this.trans  = {}
    this.styles = {}
    delete this._x
    delete this._y
    delete this._cx
    delete this._cy
    delete this._size
    delete this._after
    delete this._during
    delete this._viewbox
    
    return this
  }
  // Private: calculate position according to from and to
, _at: function(o, pos) {
    /* number recalculation */
    return typeof o.from == 'number' ?
      o.from + (o.to - o.from) * pos :
    
    /* unit recalculation */
    SVG.regex.unit.test(o.to) ?
      this._unit(o, pos) :
    
    /* color recalculation */
    o.to && (o.to.r || SVG.Color.test(o.to)) ?
      this._color(o, pos) :
    
    /* for all other values wait until pos has reached 1 to return the final value */
    pos < 1 ? o.from : o.to
  }
  // Private: tween unit
, _unit: function(o, pos) {
    var match, from
    
    /* convert FROM unit */
    match = SVG.regex.unit.exec(o.from.toString())
    from = parseFloat(match ? match[1] : 0)
    
    /* convert TO unit */
    match = SVG.regex.unit.exec(o.to)
    
    return (from + (parseFloat(match[1]) - from) * pos) + match[2]
  }
  // Private: tween color
, _color: function(o, pos) {
    var from, to
    
    /* normalise pos */
    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
    
    /* convert FROM */
    from = new SVG.Color(o.from)
    
    /* convert TO hex to rgb */
    to = new SVG.Color(o.to)
    
    /* tween color and return hex */
    return new SVG.Color({
      r: ~~(from.r + (to.r - from.r) * pos)
    , g: ~~(from.g + (to.g - from.g) * pos)
    , b: ~~(from.b + (to.b - from.b) * pos)
    }).toHex()
  }
  
})
//
SVG.extend(SVG.Element, {
  // Get fx module or create a new one, then animate with given duration and ease
  animate: function(d, ease, delay) {
    return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)
  },
  // Stop current animation; this is an alias to the fx instance
  stop: function() {
    if (this.fx)
      this.fx.stop()
    
    return this
  }
  
})
// Usage:

//     rect.animate(1500, '>').move(200, 300).after(function() {
//       this.fill({ color: '#f06' })
//     })
