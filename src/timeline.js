
// Must Change ....
SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
}


function Runner (timeline) {

  // We store a reference to the function to run and the timeline to use
  this.transforms = []
  this.functions = []
  this.done = false

  // We copy the current values from the timeline because they can change
  this._timeline = timeline
  this._startTime = timeline._startTime
  this._duration = timeline._duration
  this._active = false

  // TODO: Think about looping and how to use the runner
}

// The runner gets the time from the timeline
Runner.prototype = {

  add: function (initFn, runFn, alwaysInitialise) {
    this.functions.push({
      initialised: false,
      alwaysInitialise: alwaysInitialise || false,
      initialiser: initFn,
      runner: runFn,
    })
  },

  step: function (time) {

    // If it is time to do something, act now.
    var end = this._startTime + this._duration
    var running = (this._startTime < time && time < end) || !this._duration

    // If its time run the animation, we do so
    var allDone = time > end
    if (running && !this._timeline._paused) {

      // Get the current position for the current animation
      // TODO: Deal with looping
      var position = (time - this._startTime) / this._duration

      // We run all of the functions
      for (var i = 0, len = this.functions.length; i < len ; ++i) {

        // Get the current queued item
        var current = this.functions[i]

        // Work out if we need to initialise, and do so if we do
        var initialise = current.alwaysInitialise || !current.initialised
        if (initialise) {
          current.initialiser(position)
        }

        // Run the function required
        // TODO: Figure out what declarative needs that it doesn't have
        var stillRunning = current.runner(position)
        if (stillRunning) {
          allDone = false
        }
      }
    }

    // Tell the caller whether this animation is finished
    return allDone
  },
}


var time = window.performance || window.Date


SVG.Timeline = SVG.invent({

  // Construct a new timeline on the given element
  create: function (element) {

    // Store a reference to the element to call its parent methods
    this._element = element

    // Store the timing variables
    this._startTime = time.now()
    this._duration = SVG.defaults.timeline.duration
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

    animate (duration, delay, now) {

      // Clear the controller and the looping parameters
      this._controller = duration instanceof Function ? duration : null
      this._backwards = false
      this._swing = false
      this._loops = 0

      // If we have an object we are declaring imperative animations
      if (typeof duration === 'object') {
        delay = duration.delay
        now = duration.now
        duration = duration.duration
      }

      // We start the next animation after the old one is complete
      this._startTime = ( now ? time.now() : this._startTime ) + (delay || 0)
      this._duration = duration instanceof Function ? null
        : (duration || SVG.defaults.timeline.duration)

      // Make a new runner to queue all of the animations onto
      this._runner = new Runner(this)
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
      this._ease = SVG.easing[fn || SVG.defaults.timeline.ease] || fn
      return this
    },

    play () {

console.log("hello");

      this._paused = false
      this._continue()
      return this
    },

    pause () {
      this._paused = true
      return this
    },

    stop () {
      this.pause()

      // Cancel the next animation frame for this object

    },

    finish (all=true) {

    },

    speed (newSpeed) {
      this._speed = newSpeed
    },

    seek (dt) {

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

    _step (time) {


console.log("going", this._paused);
      // If we are paused, just exit
      if (this._paused) return

      // Get the time delta from the last time
      // TODO: Deal with window.blur window.focus to pause animations
      // HACK: We keep the time below 16ms to avoid driving declarative crazy
      var dt = this._speed * ((time - this._time) || 16)
      dt = dt < 100 ? dt : 16 // If we missed alot of time, ignore
      this._time += dt

      // Run all of the runners directly
      var runnersLeft = false
      for (var i = 0; i < this._runners.length ; i++) {

        // Get and run the current runner and figure out if its done running
        var runner = this._runners[i]
        var finished = runner.step(this._time)

        // If this runner is still going, signal that we need another animation
        // frame, otherwise, remove the completed runner
        if (!finished) {
          runnersLeft = true
        } else {
          this._runners.splice(i--, 1)
        }
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

// // Extend the attribute methods separately to avoid cluttering the main
// // Timeline class above
// SVG.extend(SVG.Timeline, {
//
//
//   attr: function (a, v) {
//     return this.styleAttr('attr', a, v)
//   },
//
//   // Add animatable styles
//   css: function (s, v) {
//     return this.styleAttr('css', s, v)
//   },
//
//   styleAttr (type, name, val) {
//     // apply attributes individually
//     if (typeof name === 'object') {
//       for (var key in val) {
//         this.styleAttr(type, key, val[key])
//       }
//     }
//
//     var morpher = new Morphable(this.controller).to(val)
//
//     this.queue(
//       function () {
//         morpher = morpher.from(element[type](name))
//       },
//       function () {
//         this.element[type](name, morpher.at(pos))
//       }
//     )
//
//     return this
//   },
//
//   zoom(level, point) {
//     let morpher = SVG.Number(level).controller(this.controller)
//     this.queue(
//       () => {morpher = morpher.from(element.zoom())},
//       (pos) => {element.zoom(morpher.at(pos), point)}
//     )
//     return this
//   }
// })
