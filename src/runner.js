
SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
}

SVG.Runner = SVG.invent({

  parent: SVG.Element,

  create: function (options) {

    // ensure a default value
    options = options == null
      ? SVG.defaults.timeline.duration
      : options

    // ensure that we get a controller
    options = typeof options === 'function'
      ? new SVG.Controller(options)
      : options

    // Declare all of the variables
    this._dispacher = document.createElement('div')
    this._element = null
    this._timeline = null
    this.done = false
    this._queue = []

    // Work out the stepper and the duration
    this._duration = typeof options === 'number' && options
    this._isDeclarative = options instanceof SVG.Controller
    this._stepper = this._isDeclarative ? options : new SVG.Ease()

    // We copy the current values from the timeline because they can change
    this._history = {}

    // Store the state of the runner
    this.enabled = true
    this._time = 0
    this._last = 0
    this.tags = {}

    // save the transformation we are starting with
    this._baseTransform = null
  },

  construct: {

    animate: function (duration, delay, when) {

      return new SVG.Runner(duration && duration.duration || duration)
        .element(this)
        .timeline(this.timeline())
        .init(duration, delay, when)

      // // Initialise the default parameters
      // var times = 0
      // var swing = false
      // var waits = []
      //
      // // If we have an object, unpack the values
      // if (typeof duration == 'object' && !(duration instanceof SVG.Stepper)) {
      //   delay = duration.delay || 0
      //   when = duration.when || 'now'
      //   duration = duration.duration || 1000
      //   swing = duration.swing || false
      //   times = duration.times || 0
      //   waits = duration.waits || []
      // }
      //
      // // FIXME: take care of looping here because loop is a constructor
      // // alternatively disallow loop as constructor
      // // Construct a new runner and setup its looping behaviour
      // var runner = new SVG.Runner(duration)
      //   //.loop(times, swing, waits)
      //   .element(this)
      //
      // // Attach this animation to a timeline
      // this.timeline().schedule(runner, delay, when)
      // return runner
    },

    loop: function (duration, times, swing) {

      return new SVG.Runner(duration.duration || duration)
        .element(this)
        .timeline(this.timeline())
        .initLoop(duration, times, swing)

      // // If we have an object, unpack the values
      // if (typeof duration == 'object') {
      //   duration.times = duration.times || Infinity
      // } else {
      //   duration = {
      //     duration: duration,
      //     times: times || Infinity,
      //     swing: swing
      //   }
      // }
      // return this.animate(duration)
    },

    delay: function (by, when) {
      return this.animate(0, by, when)
    },
  },

  extend: {

    /*
    Runner Definitions
    ==================
    These methods help us define the runtime behaviour of the Runner or they
    help us make new runners from the current runner
    */

    element: function (element) {
      if(element == null) return this._element
      this._element = element
      return this
    },

    timeline: function (timeline) {
      if(timeline == null) return this._timeline
      this._timeline = timeline
      return this
    },

    animate: function(duration, delay, when) {
      var runner = new SVG.Runner(duration.duration || duration)
      if(this._timeline) runner.element(this._timeline)
      if(this._element) runner.element(this._element)
      return runner.init(duration, delay, when)
    },

    unschedule: function () {
      var timeline = this.timeline()
      timeline && timeline.unschedule(this)
      return this
    },

    schedule: function (timeline, delay, when) {
      if(!timeline) {
        throw Error('Runner cannot be scheduled without timeline')
      }

      // FIXME: timeline is already set when used in normal ways
      // but for manual runners we need that here anyway
      // so just have doubled code?
      timeline.schedule(this, delay, when)
      this.timeline(timeline)
      return this
    },

    // schedule a runner
    init: function (duration, delay, when) {
      // Initialise the default parameters
      var times = 0
      var swing = false
      var waits = []

      // If we have an object, unpack the values
      if (typeof duration == 'object' && !(duration instanceof SVG.Stepper)) {
        delay = duration.delay || 0
        when = duration.when || 'now'
        duration = duration.duration || 1000
        swing = duration.swing || false
        times = duration.times || 0
        waits = duration.waits || []
      }

      // TODO: take care of looping here because there is no loop function we can use
      // e.g. this._times = times

      // Attach this animation to a timeline
      //this.timeline().schedule(this, delay, when)
      return this.schedule(this.timeline(), delay, when)
    },

    initLoop: function (duration, times, swing) {
      // If we have an object, unpack the values
      if (typeof duration == 'object') {
        duration.times = duration.times || Infinity
      } else {
        duration = {
          duration: duration,
          times: times || Infinity,
          swing: swing
        }
      }

      return this.init(duration)
    },

    loop: function (duration, times, swing) {
      var runner = new SVG.Runner(duration.duration || duration)
      if(this._timeline) runner.element(this._timeline)
      if(this._element) runner.element(this._element)
      return runner.initLoop(duration, times, swing)
    },

    delay: function () {
      if(this._element) {
        return this._element.delay.apply(this._element, arguments)
      }
      // TODO: throw an error
    },

    /*
    Basic Functionality
    ===================
    These methods allow us to attach basic functions to the runner directly
    */

    queue: function (initFn, runFn, alwaysInitialise) {
      this._queue.push({
        alwaysInitialise: alwaysInitialise || false,
        initialiser: initFn || SVG.void,
        runner: runFn || SVG.void,
        initialised: false,
        finished: false,
      })
      var timeline = this.timeline()
      timeline && this.timeline()._continue()
      return this
    },

    during: function () {
      return this.on('during', fn, this)
    },

    on (eventName, fn, binding) {
      SVG.on(this._dispacher, eventName, fn, binding)
      return this
    },

    // Queue a function to run after this runner
    after (fn) {
      return this.on('finish', fn, this)
    },

    fire: function (name, detail) {
      SVG.Element.prototype.dispatch.call({node: this._dispacher}, name, detail)
      return this
    },

    /*
    Runner animation methods
    ========================
    Controls how the animation plays
    */

    time: function (time) {
      if (time == null) return this._time

      let dt = time - this._time
      this.step(dt)
      return this
    },

    step: function (dt) {

      // If there is no duration, we are in declarative mode and dt has to be
      // positive always, so if its negative, we ignore it.
      if (this._isDeclarative && dt < 0) return false

      // Increment the time and read out the parameters
      var duration = this._duration || Infinity
      this._time += isFinite(dt) ? dt : 16
      var time = this._time

      // Work out if we are in range to run the function
      var timeInside = 0 <= time && time <= duration
      var position = time / duration
      var finished = time >= duration

      // If we are on the rising edge, initialise everything, otherwise,
      // initialise only what needs to be initialised on the rising edge
      // var justStarted = this._last <= 0 && time >= 0
      var justFinished = this._last <= duration && finished
      this._initialise()
      this._last = time

      // If we haven't started yet or we are over the time, just exit
      if(!timeInside && !justFinished) return finished

      // Run the runner and store the last time it was run
      var runnersFinished = this._run(
        this._isDeclarative ? dt
        : finished ? 1
        : position
      )
      finished = (this._isDeclarative && runnersFinished)
        || (!this._isDeclarative && finished)

      // Set whether this runner is complete or not
      this.done = finished

      // Fire finished event if finished
      this.done && this.fire('finish', {runner: this})
      return this
    },

    finish: function () {
      return this.step(Infinity)
    },

    // TODO
    // Sets the time to the end time and makes the time advance backwards
    reverse: function () {
      return this
    },

    // Changes the animation easing function
    ease: function (fn) {
      this._stepper = new SVG.Ease(fn)
      return this
    },

    active: function (enabled) {
      if(enabled == null) return this.enabled
      this.enabled = enabled
      return this
    },

    /*
    Runner Management
    =================
    Functions that are used to help index the runner
    */

    tag: function (name) {
      // Act as a getter to get all of the tags on this object
      if (name == null) return Object.keys(this.tags)

      // Add all of the tags to the object directly
      name = Array.isArray(name) ? name : [name]
      for(var i = name.length; i--;) {
        this.tags[name[i]] = true
      }
      return this
    },

    untag: function (name) {
      name = Array.isArray(name) ? name : [name]
      for(var i = name.length; i--;) {
        delete this.tags[name[i]]
      }

      return this
    },

    /*
    Private Methods
    ===============
    Methods that shouldn't be used externally
    */

    // Save a morpher to the morpher list so that we can retarget it later
    _remember: function (method, morpher) {
      this._history[method] = {
        morpher: morpher,
        caller: this._queue[this._queue.length - 1],
      }
    },

    // Try to set the target for a morpher if the morpher exists, otherwise
    // do nothing and return false
    _tryRetarget: function (method, target) {
      if(this._history[method]) {
        this._history[method].morpher.to(target)
        this._history[method].caller.finished = false
        this.timeline()._continue()
        return true
      }
      return false
    },

    // Run each initialise function in the runner if required
    _initialise: function () {
      for (var i = 0, len = this._queue.length; i < len ; ++i) {
        // Get the current initialiser
        var current = this._queue[i]

        // Determine whether we need to initialise
        var needsInit = current.alwaysInitialise || !current.initialised
        var running = !current.finished

        if (needsInit && running) {
          current.initialiser.call(this)
          current.initialised = true
        }
      }
    },

    // Run each run function for the position given
    _run: function (position) {

      // Run all of the _queue directly
      var allfinished = true
      for (var i = 0, len = this._queue.length; i < len ; ++i) {

        // Get the current function to run
        var current = this._queue[i]

        // Run the function if its not finished, we keep track of the finished
        // flag for the sake of declarative _queue
        current.finished = current.finished
          || (current.runner.call(this, position) === true)
        allfinished = allfinished && current.finished
      }

      // We report when all of the constructors are finished
      return allfinished
    },
  },
})

// Extend the attribute methods separately to avoid cluttering the main
// Timeline class above
SVG.extend(SVG.Runner, {

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

    var morpher = new Morphable(this._stepper).to(val)

    this.queue(function () {
      morpher = morpher.from(this.element()[type](name))
    }, function () {
      this.element()[type](name, morpher.at(pos))
      return morpher.done()
    }, this._isDeclarative)

    return this
  },

  zoom: function (level, point) {
   var morpher = new Morphable(this._stepper).to(new SVG.Number(level))

   this.queue(function() {
     morpher = morpher.from(this.zoom())
   }, function (pos) {
     this.element().zoom(morpher.at(pos), point)
     return morpher.done()
   }, this._isDeclarative)

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
        .stepper(this._stepper)

      return this.queue(function() {}, function (pos) {
        this.pushRightTransform(new Matrix(morpher.at(pos)))
        return morpher.done()
      }, this._isDeclarative)
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

    morpher.stepper(this._stepper)

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

      return morpher.done()
    }, this._isDeclarative)

    return this
  },

  // Animatable x-axis
  x: function (x, relative) {
    return this._queueNumber('x', x)
  },

  // Animatable y-axis
  y: function (y) {
    return this._queueNumber('y', y)
  },

  dx: function (x) {
    return this._queueNumberDelta('dx', x)
  },

  dy: function (y) {
    return this._queueNumberDelta('dy', y)
  },

  _queueNumberDelta: function (method, to) {
      to = new SVG.Number(to)

      // Try to change the target if we have this method already registerd
      if (this._tryRetargetDelta(method, to)) return this

      // Make a morpher and queue the animation
      var morpher = new SVG.Morphable(this._stepper).to(to)
      this.queue(function () {
        var from = this.element()[method]()
        morpher.from(from)
        morpher.to(from + x)
      }, function (pos) {
        this.element()[method](morpher.at(pos))
        return morpher.done()
      }, this._isDeclarative)

      // Register the morpher so that if it is changed again, we can retarget it
      this._remember(method, morpher)
      return this
  },

  _queueObject: function (method, to) {

    // Try to change the target if we have this method already registerd
    if (this._tryRetarget(method, to)) return this

    // Make a morpher and queue the animation
    var morpher = new SVG.Morphable(this._stepper).to(to)
    this.queue(function () {
      morpher.from(this.element()[method]())
    }, function (pos) {
      this.element()[method](morpher.at(pos))
      return morpher.done()
    }, this._isDeclarative)

    // Register the morpher so that if it is changed again, we can retarget it
    this._remember(method, morpher)
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
    return this._queueNumber('cy', y)
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
      box = this._element.bbox()
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

    return this._queueObject('plot', new this._element.MorphArray(a))

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
    return this._queueNumber('leading', value)
  },

  // Add animatable viewbox
  viewbox: function (x, y, width, height) {
    return this._queueObject('viewbox', new SVG.Box(x, y, width, height))
  },

  update: function (o) {
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


    return this
  }
})
