
// Must Change ....
SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
}

var time = window.performance || window.Date

SVG.Timeline = SVG.invent({

  // Construct a new timeline on the given element
  create: function (element) {

    // Store a reference to the element to call its parent methods
    this._element = element

    // Store the timing variables
    this._startTime = 0
    this._lastPaused = null
    this._timeAbsoluteOffset = 0
    this._duration = 0
    this._ease = SVG.defaults.timeline.ease
    this._speed = 1.0

    // Play control variables control how the animation proceeds
    this._controller = null
    this._reverse = false
    this._loops = null
    this._waits = null
    this._swing = null

    // Keep track of the running animations and their starting parameters
    this._baseTransform = null
    this._nextFrame = null
    this._paused = false
    this._runner = null
    this._runners = []
    this._time = 0
  },

  extend: {

    animate (duration, delay, nowOrAbsolute) {

      // Clear the controller and the looping parameters
      this._controller = duration instanceof Function ? duration : null
      this._backwards = false
      this._swing = false
      this._loops = 0

      // If we have an object we are declaring imperative animations
      if (typeof duration === 'object') {
        duration = duration.duration
        delay = duration.delay
        nowOrAbsolute = duration.absolute || duration.now
      }

      // The start time for the next animation can either be given explicitly,
      // derived from the current timeline time or it can be relative to the
      // last start time to chain animations direclty
      var absoluteStartTime = typeof nowOrAbsolute === 'number' ? nowOrAbsolute
        : nowOrAbsolute ? this._time
        : this._startTime + this._duration

      // We start the next animation after the delay required
      this._startTime = absoluteStartTime + (delay || 0)
      this._duration = duration instanceof Function ? null
        : (duration || SVG.defaults.timeline.duration)

      // Make a new runner to queue all of the animations onto
      this._runner = new Runner(this).time(this._time - this._startTime)
      this._runners.push(this._runner)

      // Step the animation
      this._step()

      // Allow for chaining
      return this
    },

    duration (time) {
      return this.animate(time, 0, false)
    },

    delay (by, now) {
      return this.animate(0, by, now)
    },

    ease (fn) {
      var ease = SVG.easing[fn || SVG.defaults.timeline.ease] || fn
      this._controller = function (from, to, pos) {
        // FIXME: This is needed for at lest ObjectBag but could slow down stuff
        if(typeof from !== 'number') {
          return pos < 1 ? from : to
        }
        return from + (to - from) * ease(pos)
      }
      return this
    },

    tag (name) {
      this._runner.tag(name)
    },

    play (tags) {

      // If we were paused, shift the time by the time that we were paused
      if (this._paused) {
        this._timeAbsoluteOffset -= (time.now() - this._lastPaused)
      }

      // Now make sure we are not paused and continue the animation
      this._paused = false
      this._continue()
      return this
    },

    pause (tags) {
      this._lastPaused = time.now()
      this._nextFrame = null
      this._paused = true
      return this
    },

    stop (tags) {
      // Cancel the next animation frame for this object
      this._nextFrame = null

    },

    finish (tags) {

    },

    speed (newSpeed) {
      this._speed = newSpeed
    },

    seek (dt) {
      this._timeAbsoluteOffset += dt
    },

    persist (dtOrForever) {
      // 0 by default
    },

    reverse () {

    },

    queue (initialise, during) {
      this._runner.add(initialise, during)
      return this
    },

    // Queue a function to run after some time
    after (time, fn) {

      // If the user passes no time, just queue it
      if (fn == null) {
        return this.queue(time)
      }

      // Otherwise make a runner to run this one time later
      var runner = new Runner(this, 0).time(-time).add(fn)
      this._runners.push(runner)
      return this
    },

    during (fn) {
      return this.queue(null, fn)
    },

    // Map an absolute time to a timeline time
    timelineTime (time) {
      return time + this._timeAbsoluteOffset
    },

    _step (time) {

      // If we are paused, just exit
      if (this._paused) return

      // Get the time delta from the last time and update the time
      // TODO: Deal with window.blur window.focus to pause animations
      // HACK: We keep the time below 16ms to avoid driving declarative crazy
      var dt = this._speed * ((time - this._lastTime) || 16)
      dt = dt < 100 ? dt : 16 // If we missed alot of time, ignore
      this._lastTime = time
      this._time += dt

      // Run all of the runners directly
      var runnersLeft = false
      for (var i = 0; i < this._runners.length ; i++) {

        // Get and run the current runner and figure out if its done running
        var runner = this._runners[i]
        var finished = runner.step(dt)

        // If this runner is still going, signal that we need another animation
        // frame, otherwise, remove the completed runner
        if (!finished) {
          runnersLeft = true
        }

        // TODO: Check if a runner is still healthy, and if it is, run it.
        // Once a runner is complete it expires. If it has been expired for
        // more than the persist amount of time, splice it out; by default
        // this expiry date is zero
        // this._runners.splice(i--, 1)
      }

      // Get the next animation frame to keep the simulation going
      if (runnersLeft)
        this._nextFrame = SVG.Animator.frame(this._step.bind(this))
      else this._nextFrame = null
      return this
    },

    // Checks if we are running and continues the animation
    _continue () {
      if (this._paused) return
      if (!this._nextFrame)
          this._step()
      return this
    },
  },

  // Only elements are animatable
  parent: SVG.Element,

  // These methods will be added to all SVG.Element objects
  construct: {
    animate: function(o, delay, now) {

      // Get the current timeline or construct a new one
      this.timeline = (this.timeline || new SVG.Timeline(this))
        .animate(o, delay, now)
      this.timeline._loops = null
      return this.timeline
    },

    loop: function(o) {

      /*
      {
        swing: wether or not the animation should repeat when its done
        times: the number of times to loop the animation
        wait: [array] a buffer of times to wait between successive animations
        delay: defaults.timeline to wait
      }
       */
       this.timeline = (this.timeline || new SVG.Timeline(this))

       // REFACTOR this into an init function
       this.timeline._waits = [].concat(o.wait || o.delay || 0)
       this.timeline._loops = o.times || Infinity
       this.timeline._swing = o.swing || false
       return this.timeline
    }
  }
})


// Extend the attribute methods separately to avoid cluttering the main
// Timeline class above
SVG.extend(SVG.Timeline, {


  attr: function (a, v) {
    return this.styleAttr('attr', a, v)
  },

  // Add animatable styles
  css: function (s, v) {
    return this.styleAttr('css', s, v)
  },

  styleAttr (type, name, val) {
    // apply attributes individually
    if (typeof name === 'object') {
      for (var key in val) {
        this.styleAttr(type, key, val[key])
      }
    }

    var morpher = new Morphable(this._controller).to(val)

    this.queue(
      function () {
        morpher = morpher.from(element[type](name))
      },
      function () {
        this.element[type](name, morpher.at(pos))
      }
    )

    return this
  },

  zoom: function (level, point) {
   var  morpher = new Morphable(this._controller).to(new SVG.Number(level))
   var el = this.target()

   this.queue(function() {
     morpher = morpher.from(element.zoom())
   }, function (pos) {
     el.zoom(morpher.at(pos), point)
   })

   return this
 },

  /**
   ** absolute transformations
   **/

  // M v -----|-----(D M v = I v)------|----->  T v
  //
  // 1. define the final state (T) and decompose it (once) t = [tx, ty, the, lam, sy, sx]
  // 2. on every frame: pull the current state of all previous transforms (M - m can change)
  //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
  // 3. Find the interpolated matrix I(pos) = m + pos * (t - m)
  //   - Note I(0) = M
  //   - Note I(1) = T
  // 4. Now you get the delta matrix as a result: D = I * inv(M)

  transform: function (transforms, relative, affine) {
    affine = transforms.affine || affine || !!transform.a
    relative = transforms.relative || relative || false

    var morpher

    /**
      The default of relative is false
      affine defaults to true if transformations are used and to false when a matrix is given

      We end up with 4 possibilities:
      false, false: absolute direct matrix morph with SVG.Matrix
      true, false: relative direct matrix morph with SVG.Marix or relative whatever was passed transformation with ObjectBag

      false, true: absolute affine transformation with SVG.TransformBag
      true, true: relative whatever was passed transformation with ObjectBag
    **/


    // if we have a relative transformation and its not a matrix
    // we morph all parameters directly with the ObjectBag
    // the following cases are covered here:
    // - true, false with ObjectBag
    // - true, true with ObjectBag
    if(relative && transforms.a == null) {
      morpher = SVG.Morphable.ObjectBag(formatTransforms({}))
        .to(formatTransforms(transforms))
        .controller(this.controller)

      return this.queue(function() {}, function (pos) {
        this.pushRightTransform(new Matrix(morpher.at(pos)))
      })
    }


    // what is left is affine morphing for SVG.Matrix and absolute transformations with TransformBag
    // also non affine direct and relative morhing with SVG.Matrix
    // the following cases are covered here:
    // - false, true with SVG.Matrix
    // - false, true with SVG.TransformBag
    // - true, false with SVG.Matrix
    // - false, false with SVG.Matrix

    // 1.  define the final state (T) and decompose it (once) t = [tx, ty, the, lam, sy, sx]
    var morpher = (transforms.a && !affine)
      ? new SVG.Matrix().to(transforms)
      : new SVG.Morphable.TransformBag().to(transforms)

    morpher.controller(this.controller)

    // create identity Matrix for relative not affine Matrix transformation
    morpher.from()

    this.queue(function() {}, function (pos) {

      // 2. on every frame: pull the current state of all previous transforms (M - m can change)
      var curr = this.currentTransform()
      if(!relative) morpher.from(curr)

      // 3. Find the interpolated matrix I(pos) = m + pos * (t - m)
      //   - Note I(0) = M
      //   - Note I(1) = T
      var matrix = morpher.at(pos)

      if(!relative) {
        // 4. Now you get the delta matrix as a result: D = I * inv(M)
        var delta = matrix.multiply(curr.inverse())
        this.pushLeftTransform(delta)
      } else {
        this.pushRightTransform(matrix)
      }
    })

    return this
  },

  // Animatable x-axis
  x: function (x, relative) {
    var morpher = new SVG.Morphable(this._controller)
      .to(new SVG.Number(x))

    /*
    if (this.target() instanceof SVG.G) {
      this.transform({x: x}, relative)
      return this
    }
    */

    this.queue(function () {
      var from = this._element.x()
      morpher.from(from)
      if(relative) morpher.to(from + x)
    }, function (pos) {
      this._element.x(morpher.at(pos))
    })

    return this
  },

  // Animatable y-axis
  y: function (y, relative) {
    var morpher = new SVG.Morphable(this._controller)
      .to(new SVG.Number(y))

    /*
    if (this.target() instanceof SVG.G) {
      this.transform({y: y}, relative)
      return this
    }
    */

    this.queue(function () {
      var from = this._element.y()
      morpher.from(from)
      if(relative) morpher.to(from + y)
    }, function (pos) {
      this._element.y(morpher.at(pos))
    })

    return this
  },

  _queueObject: function (method, to) {
    var morpher = new SVG.Morphable(this._controller).to(to)

    this.queue(function () {
      morpher.from(this._element[method]())
    }, function (pos) {
      this._element[method](morpher.at(pos))
    })

    return this
  },

  _queueNumber: function (method, value) {
    return this._queueObject(method, new SVG.Number(value))
  },

  // Animatable center x-axis
  cx: function (x) {
    return this._queueNumber('cx', x)
  },

  // Animatable center y-axis
  cy: function (y) {
    return this._queueNumber('cy', x)
  },

  // Add animatable move
  move: function (x, y) {
    return this.x(x).y(y)
  },

  // Add animatable center
  center: function (x, y) {
    return this.cx(x).cy(y)
  },

  // Add animatable size
  size: function (width, height) {
    // animate bbox based size for all other elements
    var box

    if (!width || !height) {
      box = this._element().bbox()
    }

    if (!width) {
      width = box.width / box.height * height
    }

    if (!height) {
      height = box.height / box.width * width
    }

    return this
      .width(width)
      .height(height)
  },

  // Add animatable width
  width: function (width) {
    return this._queueNumber('width', width)
  },

  // Add animatable height
  height: function (height) {
    return this._queueNumber('height', height)
  },

  // Add animatable plot
  plot: function (a, b, c, d) {
    // Lines can be plotted with 4 arguments
    if (arguments.length === 4) {
      return this.plot([a, b, c, d])
    }

    return this._queueObject('plot', new this._element.morphArray(a))

    /*var morpher = this._element.morphArray().to(a)

    this.queue(function () {
      morpher.from(this._element.array())
    }, function (pos) {
      this._element.plot(morpher.at(pos))
    })

    return this*/
  },

  // Add leading method
  leading: function (value) {
    return this._element.leading
      ? this._queueNumber('leading', value)
      : this
  },

  // Add animatable viewbox
  viewbox: function (x, y, width, height) {
    if (this._element instanceof SVG.Container) {
      this._queueObject('viewbox', new SVG.Box(x, y, width, height))

      /*var morpher = new SVG.Box().to(x, y, width, height)

      this.queue(function () {
        morpher.from(this._element.viewbox())
      }, function (pos) {
        this._element.viewbox(morpher.at(pos))
      })

      return this*/
    }

    return this
  },
  update: function (o) {
    if (this._element instanceof SVG.Stop) {
      if (typeof o !== 'object') {
        return this.update({
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        })
      }

      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color != null) this.attr('stop-color', o.color)
      if (o.offset != null) this.attr('offset', o.offset)
    }

    return this
  }
})
