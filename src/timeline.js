
// Must Change ....
SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
}

SVG.Timeline = SVG.invent({

  // Construct a new timeline on the given element
  create: function (element) {

    // Store a reference to the element to call its parent methods
    this._element = element || null

    // Store the timing variables
    this._startTime = 0
    this._speed = 1.0

    // Play control variables control how the animation proceeds
    this._reverse = false
    this._persist = 0

    // Keep track of the running animations and their starting parameters
    this._baseTransform = null
    this._nextFrame = null
    this._paused = false
    this._runners = []
    this._time = 0
    this._lastTime = 0
  },

  extend: {

    element (element) {
      if(element == null) return this._element
      this._element = element
    },

    /**
     *
     */

    // remove the runner from this timeline
    unschedule (runner) {
      var index = this._runners.indexOf(runner)
      if(index > -1) {
        this._runners.splice(index, 1)
      }
      return this
    },

    schedule (runner, delay, when) {

      runner.unschedule()

      // The start time for the next animation can either be given explicitly,
      // derived from the current timeline time or it can be relative to the
      // last start time to chain animations direclty
      var absoluteStartTime
      delay = delay || 0

      // Work out when to start the animation
      if ( when == null || when === 'last' || when === 'after' ) {
        // Take the last time and increment
        absoluteStartTime = this._startTime + delay

      } else if (when === 'absolute' || when === 'start' ) {
        absoluteStartTime = delay

      } else if (when === 'now') {
        absoluteStartTime = this._time + delay

      } else if ( when === 'relative' ) {

        // TODO: If the runner already exists, shift it by the delay, otherwise
        // this is relative to the start time ie: 0

      } else {
        // TODO: Throw error
      }

      runner.time(-absoluteStartTime)
      this._startTime = absoluteStartTime + runner._duration
      this._runners.push(runner)
      this._continue()
      return this
    },

    play () {

      // Now make sure we are not paused and continue the animation
      this._paused = false
      this._continue()
      return this
    },

    // FIXME: this does not work. Setting the nextFrame to null alone is not working
    // We need to remove our frames from the animator somehow
    cancel () {
      // SVG.Animator.cancel(this._nextFrame)
      this._nextFrame = null
      return this
    },

    pause () {
      // Cancel the next animation frame and pause
      this._paused = true
      return this.cancel()
    },

    stop () {
      // Cancel the next animation frame and go to start
      this.seek(-this._time)
      return this.cancel()
    },

    finish () {
      this.seek(Infinity)
      return this.cancel()
    },

    speed (speed) {
      if(speed == null) return this._speed
      this._speed = speed
      return this
    },

    // FIXME: rewrite this to use the speed method
    reverse (yes) {
      this._speed = Math.abs(this._speed) * yes ? -1 : 1
      return this
    },

    seek (dt) {
      // what to do here?
      // we cannot just set a new time
      // also calling step does not result in anything
      // because step is getting called with the current real time which
      // will reset it to the old flow

      // only way is to change lastTime to the current time + what we want
      this._lastTime -= dt
      return this
    },

    time (t) {
      if(t == null) return this._time
      this._time = t
      return this
    },

    persist (dtOrForever) {
      if(tdOrForever == null) return this._persist

      this._persist = dtOrForever
      return this
    },

    _step (time) {
      // FIXME: User should be able to step manually
      // move this check to the very bottom
      // or mixup the continue, step logic
      // If we are paused, just exit
      if (this._paused) return

      // Get the time delta from the last time and update the time
      // TODO: Deal with window.blur window.focus to pause animations
      // HACK: We keep the time below 50ms to avoid driving animations crazy
      // FIXME: We cannot seek to -time because speed fucks this up
      var dt = this._speed * ((time - this._lastTime) || 16)

      // we cannot do that. Doesnt work when user wants to manually step (or seek)
      dt = dt < 50 ? dt : 16 // If we missed alot of time, ignore
      this._lastTime = time

      // FIXME: this is not used
      this._time += dt

      // Run all of the runners directly
      var runnersLeft = false
      for (var i = 0, len = this._runners.length; i < len; i++) {
        // Get and run the current runner and ignore it if its inactive
        var runner = this._runners[i]
        if(!runner.active()) continue

        // If this runner is still going, signal that we need another animation
        // frame, otherwise, remove the completed runner
        var finished = runner.step(dt).done
        if (!finished) {
          runnersLeft = true
        } else if(this._persist !== true){
          // runner is finished. And runner might get removed

          // TODO: Figure out end time of runner
          var endTime = Infinity

          if(endTime + this._persist < this._time) {
            // delete runner and correct index
            this._runners.splice(i--, 1) && --len
          }

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
      if (this._paused) return this
      if (!this._nextFrame)
          this._step(this._lastTime) // FIXME: we have to past an absolute time here
      return this
    },
  },

  // These methods will be added to all SVG.Element objects
  parent: SVG.Element,
  construct: {
    timeline: function () {
      this._timeline = (this._timeline || new SVG.Timeline(this))
      return this._timeline
    },
  }
})
