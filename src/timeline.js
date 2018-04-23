
// Must Change ....
SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
}


function Runner (timeline) {

  // We store a reference to the function to run and the timeline to use
  this.timeline = timeline
  this.transforms = []
  this.functions = []
  this.done = false

  // We copy the current values from the timeline because they can change
  this._startTime = timeline._startTime
  this._duration = timeline._duration
  this._loop = timeline._loop
}

Runner.prototype = {

  add: function (initFn, runFn) {
    this.initialisers.push(initFn)
    this.functions.push(fn)
  },

  step: function (time) {

    // If it is time to do something, act now.
    var end = this._start + this._duration
    var running = this._start < time && time < end
    if (running && this._running) {
      var position = (time - this._startTime) / this._duration
      var toRun = this.functions
      for (var i = 0, len = toRun.length,  i < len ; ++i) {
        toRun[i](position)
      }
    }

    // If we are not paused or stopped, request another frame
    if (this._running) SVG.Animator.frame(closure, this._startTime)

    // Tell the caller whether this animation is finished
    closure.finished = !running
  },

  snap: function () {

  },

  pause: function () {

  },
}


let time = window.performance || window.Date


SVG.Timeline = SVG.invent({

  // Construct a new timeline on the given element
  create: function (element) {

    // Store a reference to the element to call its parent methods
    this._element = element

    // Store the timing variables
    this._startTime = time.now()
    this._duration = SVG.defaults.duration
    this._ease = SVG.defaults.ease

    // Play control variables control how the animation proceeds
    this._controller = o instanceof 'function' ? o : null
    this._backwards = false
    this._reverse = false
    this._loops = 0

    // Keep track of the running animations and their starting parameters
    this._baseTransform = null
    this._running = true
    this._runners = []
  },

  extend: {

    animate (duration, delay, now) {

      // Clear the controller and the looping parameters
      this._controller = null
      this._backwards = false
      this._swing = false
      this._loops = 0

      // If we have a controller, we will use the declarative animation mode
      if(duration instanceof 'function') {

        this._controller = duration

      // If we have an object we are declaring imperative animations
      } else if (typeof duration === 'object') {

        ease = duration.ease
        delay = duration.delay
        now = duration.now
        duration = duration.duration
      }

      // We start the next animation after the old one is complete
      this._startTime = now ? time.now() : (this._startTime + this._duration)
      this._duration = duration || SVG.defaults.duration

      // Make a new runner to take care of the

      return this
    },

    duration (time) {
      return this.animate(time, 0, false)
    },

    delay (by, now) {
      return this.animate(0, by, now)
    },

    ease (fn) {
      this._ease = SVG.easing[fn || SVG.defaults.ease] || fn
      return this
    },

    loop (times, swing) {
      this._loops = times
      this._swing = swing
    },

    play () {
      this._running = true
      this._continue()
    },

    pause () {
      this._running = false
    },

    stop () {
      this.pause()

      // Cancel all of the requested animation frames

    },

    finish (all=true) {

    },

    speed (newSpeed) {

    },

    seek (dt) {

    },

    persist (dt || forever) {
      // 0 by default
    },

    reverse () {

    },

    queue (initialise, during) {

      // Make a new runner
      var runner = new Runner(this)
      this._runners.push()

    },

    _step (dt) {

    },

    // Checks if we are running and continues the animation
    _continue () {
      if (this._paused) return

      // Go through each of the runners and step them
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
      return this.timeline
    }
  }
}

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

    var morpher = new Morph(this.controller).to(val)

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

  zoom(level, point) {
    let morpher = SVG.Number(level).controller(this.controller)
    this.queue(
      () => {morpher = morpher.from(element.zoom())},
      (pos) => {element.zoom(morpher.at(pos), point)}
    )
    return this
  }
})
