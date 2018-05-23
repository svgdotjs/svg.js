
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
    this._runners = []
    this._time = 0
  },

  extend: {

    /**
     * Runner Constructors
     */

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
      this._runner = new Runner(this._time - this._startTime, this.duration)
      this._runners.push(this._runner)

      // Step the animation
      this._step()

      // Allow for chaining
      return this
    },

    delay (by, now) {
      return this.animate(0, by, now)
    },

    /**
     * Runner Behaviours
     */

    loop (swing, times, wait) {

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

    reverse () {

    },

    /**
     *
     */

    tag (name) {
      this._runner.tag(name)
    },

    runner (tag) {
      if (tag) {
        return this._runners.find(function (runTag) {return runTag === tag})
      } else {
        return this._runner
      }
    }

    schedule () {
      // Work out when to start the animation
      if ( when == null || when === 'last' || when === 'relative' ) {
        // Take the last time and increment

      } else if (when === 'absolute' || when === 'start' ) {

      } else if (when === '' ) {

      } else {
        // TODO: Throw error
      }
    }

    play () {

      // Now make sure we are not paused and continue the animation
      this._paused = false
      this._continue()
      return this
    },

    pause () {

      //
      this._nextFrame = null
      this._paused = true
      return this
    },

    stop () {
      // Cancel the next animation frame for this object
      this._nextFrame = null
    },

    finish () {

    },

    speed (newSpeed) {
      this._speed = newSpeed
    },

    seek (dt) {
      this._time += dt
    },

    time (t) {
      this._time = t
    }

    persist (dtOrForever) {
      // 0 by default
    },

    queue (initFn, runFn) {

      // Make sure there is a function available
      initFn = (initFn || SVG.void).bind(this)
      runFn = (runFn || SVG.void).bind(this)

      // Add the functions to the active runner
      this._runner.add(initFn, runFn)
      return this
    },

    // Queue a function to run after some time
    after (time, fn) {

      // If the user passes no time, just queue it
      if (fn == null) {
        return this.queue(time)
      }

      // Otherwise make a runner to run this one time later
      var runner = new Runner(-time, 0).add(fn)
      this._runners.push(runner)
      return this
    },

    during (fn) {
      return this.queue(null, fn)
    },

    _step (time) {

      // If we are paused, just exit
      if (this._paused) return

      // Get the time delta from the last time and update the time
      // TODO: Deal with window.blur window.focus to pause animations
      // HACK: We keep the time below 50ms to avoid driving animations crazy
      var dt = this._speed * ((time - this._lastTime) || 16)
      dt = dt < 50 ? dt : 16 // If we missed alot of time, ignore
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

      // TODO: Collapse transformations in transformationBag into one
      // transformation directly
      //
      // Timeline has
      // timeline.transformationBag

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

    timeline: function () {
      this.timeline = (this.timeline || new SVG.Timeline(this))
      return this.timeline
    },

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
