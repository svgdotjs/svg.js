SVG.FX = function(element) {
  /* store target element */
  this.target = element
}

SVG.extend(SVG.FX, {
  // Add animation parameters and start animation
  animate: function(d, ease, delay) {
    var akeys, tkeys, skeys, key
      , element = this.target
      , fx = this
    
    /* dissect object if one is passed */
    if (typeof d == 'object') {
      delay = d.delay
      ease = d.ease
      d = d.duration
    }

    /* ensure default duration and easing */
    d = d == '=' ? d : d == null ? 1000 : new SVG.Number(d).valueOf()
    ease = ease || '<>'

    /* process values */
    fx.to = function(pos) {
      var i

      /* normalise pos */
      pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

      /* collect attribute keys */
      if (akeys == null) {
        akeys = []
        for (key in fx.attrs)
          akeys.push(key)

        /* make sure morphable elements are scaled, translated and morphed all together */
        if (element.morphArray && (fx._plot || akeys.indexOf('points') > -1)) {
          /* get destination */
          var box
            , p = new element.morphArray(fx._plot || fx.attrs.points || element.array)

          /* add size */
          if (fx._size) p.size(fx._size.width.to, fx._size.height.to)

          /* add movement */
          box = p.bbox()
          if (fx._x) p.move(fx._x.to, box.y)
          else if (fx._cx) p.move(fx._cx.to - box.width / 2, box.y)

          box = p.bbox()
          if (fx._y) p.move(box.x, fx._y.to)
          else if (fx._cy) p.move(box.x, fx._cy.to - box.height / 2)

          /* delete element oriented changes */
          delete fx._x
          delete fx._y
          delete fx._cx
          delete fx._cy
          delete fx._size

          fx._plot = element.array.morph(p)
        }
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
      
      /* run plot function */
      if (fx._plot) {
        element.plot(fx._plot.at(pos))

      } else {
        /* run all x-position properties */
        if (fx._x)
          element.x(at(fx._x, pos))
        else if (fx._cx)
          element.cx(at(fx._cx, pos))

        /* run all y-position properties */
        if (fx._y)
          element.y(at(fx._y, pos))
        else if (fx._cy)
          element.cy(at(fx._cy, pos))

        /* run all size properties */
        if (fx._size)
          element.size(at(fx._size.width, pos), at(fx._size.height, pos))
      }

      /* run all viewbox properties */
      if (fx._viewbox)
        element.viewbox(
          at(fx._viewbox.x, pos)
        , at(fx._viewbox.y, pos)
        , at(fx._viewbox.width, pos)
        , at(fx._viewbox.height, pos)
        )

      /* animate attributes */
      for (i = akeys.length - 1; i >= 0; i--)
        element.attr(akeys[i], at(fx.attrs[akeys[i]], pos))

      /* animate transformations */
      for (i = tkeys.length - 1; i >= 0; i--)
        element.transform(tkeys[i], at(fx.trans[tkeys[i]], pos))

      /* animate styles */
      for (i = skeys.length - 1; i >= 0; i--)
        element.style(skeys[i], at(fx.styles[skeys[i]], pos))

      /* callback for each keyframe */
      if (fx._during)
  			((fx._during.fn)?fx._during.fn: fx._during).call((fx._during.scope)?fx._during.scope:element, pos, function(from, to) {
			    return at({ from: from, to: to }, pos)
	  		})
    }
    
    if (typeof d === 'number') {
      /* delay animation */
      this.timeout = setTimeout(function() {
        var start = new Date().getTime()

        /* initialize situation object */
        fx.situation = {
          interval: 1000 / 60
        , start:    start
        , play:     true
        , finish:   start + d
        , duration: d
        }

        /* render function */
        fx.render = function(){
          
          if (fx.situation.play === true) {
            // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.
            var time = new Date().getTime()
              , pos = time > fx.situation.finish ? 1 : (time - fx.situation.start) / d
            
            /* process values */
            fx.to(pos)
            
            /* finish off animation */
            if (time > fx.situation.finish) {
              if (fx._plot)
                element.plot(new SVG.PointArray(fx._plot.destination).settle())

              if (fx._loop === true || (typeof fx._loop == 'number' && fx._loop > 1)) {
                if (typeof fx._loop == 'number')
                  --fx._loop
                fx.animate(d, ease, delay)
              } else {
					      fx._after ? ((fx._after.fn)?fx._after.fn: fx._after).apply((fx._after.scope)?fx._after.scope:element, [fx]) : fx.stop()
              }

            } else {
              requestAnimFrame(fx.render)
            }
          } else {
            requestAnimFrame(fx.render)
          }
          
        }

        /* start animation */
        fx.render()
        
      }, new SVG.Number(delay).valueOf())
    }
    
    return this
  }
  // Get bounding box of target element
, bbox: function() {
    return this.target.bbox()
  }
  // Add animatable attributes
, attr: function(a, v) {
    if (typeof a == 'object') {
      for (var key in a)
        this.attr(key, a[key])
    
    } else {
      var from = this.target.attr(a)

      this.attrs[a] = SVG.Color.isColor(from) ?
        new SVG.Color(from).morph(v) :
      SVG.regex.unit.test(from) ?
        new SVG.Number(from).morph(v) :
        { from: from, to: v }
    }
    
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
  // Add animatable plot
, plot: function(p) {
    this._plot = p

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
  // Add animateable gradient update
, update: function(o) {
    if (this.target instanceof SVG.Stop) {
      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
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
  // Make loopable
, loop: function(times) {
    this._loop = times || true

    return this
  }
  // Stop running animation
, stop: function() {
    /* stop current animation */
    clearTimeout(this.timeout)
    clearInterval(this.interval)
    
    /* reset storage for properties that need animation */
    this.attrs     = {}
    this.trans     = {}
    this.styles    = {}
    this.situation = {}

    delete this._x
    delete this._y
    delete this._cx
    delete this._cy
    delete this._size
    delete this._plot
    delete this._loop
    delete this._after
    delete this._during
    delete this._viewbox

    return this
  }
  // Pause running animation
, pause: function() {
    if (this.situation.play === true) {
      this.situation.play  = false
      this.situation.pause = new Date().getTime()
    }

    return this
  }
  // Play running animation
, play: function() {
    if (this.situation.play === false) {
      var pause = new Date().getTime() - this.situation.pause
      
      this.situation.finish += pause
      this.situation.start  += pause
      this.situation.play    = true
    }

    return this
  }
  
})

SVG.extend(SVG.Element, {
  // Get fx module or create a new one, then animate with given duration and ease
  animate: function(d, ease, delay) {
    return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)
  }
  // Stop current animation; this is an alias to the fx instance
, stop: function() {
    if (this.fx)
      this.fx.stop()
    
    return this
  }
  // Pause current animation
, pause: function() {
    if (this.fx)
      this.fx.pause()

    return this
  }
  // Play paused current animation
, play: function() {
    if (this.fx)
      this.fx.play()

    return this
  }
  
})

// Calculate position according to from and to
function at(o, pos) {
  /* number recalculation (don't bother converting to SVG.Number for performance reasons) */
  return typeof o.from == 'number' ?
    o.from + (o.to - o.from) * pos :
  
  /* instance recalculation */
  o instanceof SVG.Color || o instanceof SVG.Number ? o.at(pos) :
  
  /* for all other values wait until pos has reached 1 to return the final value */
  pos < 1 ? o.from : o.to
}

// Shim layer with setTimeout fallback by Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.msRequestAnimationFrame     ||
          function (c) { window.setTimeout(c, 1000 / 60) }
})()
