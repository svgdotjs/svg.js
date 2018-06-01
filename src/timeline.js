
// Must Change ....
SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
}

var time = performance || Date

var makeSchedule = function (time) {
  return function (runner) {
    // FIXME: This returns a wrong value when the runner is finished
    // or it will break, because the runner clips his tim to duration
    var start = time - runner.time()
    var duration = runner.duration()
    var end = start + duration
    return {start: start, duration: duration, end: end, runner: runner}
  }
}

SVG.Timeline = SVG.invent({
  inherit: SVG.EventTarget,

  // Construct a new timeline on the given element
  create: function (element) {

    // Store a reference to the element to call its parent methods
    this._element = element || null
    this._timeSource = function () {
      return time.now()
    }

    this._dispatcher = document.createElement('div')

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
    this._runners = new Set()
    this._time = 0
    this._lastSourceTime = 0
    this._lastStepTime = 0
  },

  extend: {

    getEventTarget () {
      return this._dispatcher
    },

    // FIXME: there is no need anymore to save the element on the timeline
    element (element) {
      if(element == null) return this._element
      this._element = element
    },

    /**
     *
     */

    // schedules a runner on the timeline
    schedule (runner, delay, when) {

      // FIXME: Sets do not support map which makes this super ugly
      if(runner == null) {
        var ret = []
        var fn = makeSchedule(this._time)

        this._runners.forEach(function (runner) {
          ret.push(fn(runner))
        })

        ret.sort(function (a, b) {
          return (a.start - b.start) ||  (a.duration - b.duration)
        })

        return ret
      }

      // The start time for the next animation can either be given explicitly,
      // derived from the current timeline time or it can be relative to the
      // last start time to chain animations direclty
      var absoluteStartTime
      delay = delay || 0

      // Work out when to start the animation
      if (when == null || when === 'last' || when === 'after') {
        // Take the last time and increment
        absoluteStartTime = this._startTime + delay

      } else if (when === 'absolute' || when === 'start' ) {
        absoluteStartTime = delay

      } else if (when === 'now') {
        absoluteStartTime = this._time + delay

      } else if ( when === 'relative' ) {
        absoluteStartTime = delay

        if(this._runners.has(runner)) {
          absoluteStartTime += this._time - runner.time()
        }

      } else {
        // TODO: Throw error
      }

      runner.unschedule()
      runner.timeline(this)
      runner.time(-absoluteStartTime)

      this._startTime = absoluteStartTime + runner.duration()
      this._runners.add(runner)
      this._continue()
      return this
    },

    // remove the runner from this timeline
    unschedule (runner) {
      this._runners.delete(runner)
      runner.timeline(null)
      return this
    },

    play () {

      // Now make sure we are not paused and continue the animation
      this._paused = false
      return this._continue()
    },

    pause () {
      // Cancel the next animation frame and pause
      this._nextFrame = null
      this._paused = true
      return this
    },

    stop () {
      // Cancel the next animation frame and go to start
      this.seek(-this._time)
      return this.pause()
    },

    finish () {
      this.seek(Infinity)
      return this.pause()
    },

    speed (speed) {
      if(speed == null) return this._speed
      this._speed = speed
      return this
    },

    reverse (yes) {
      var currentSpeed = this.speed()
      if(yes == null) return this.speed(-currentSpeed)

      var positive = Math.abs(currentSpeed)
      return this.speed(yes ? positive : -positive)
    },

    seek (dt) {
      this._time += dt
      return this._continue()
    },

    time (time) {
      if(time == null) return this._time
      this._time = time
      return this
    },

    persist (dtOrForever) {
      if (tdOrForever == null) return this._persist
      this._persist = dtOrForever
      return this
    },

    source (fn) {
      if (fn == null) return this._timeSource
      this._timeSource = fn
      return this
    },

    _step () {

      // If the timeline is paused, just do nothing
      if (this._paused) return

      // Get the time delta from the last time and update the time
      // TODO: Deal with window.blur window.focus to pause animations
      var time = this._timeSource()
      var dtSource = time - this._lastSourceTime
      var dtTime = this._speed * dtSource + (this._time - this._lastStepTime)

      this._lastSourceTime = time

      // Update the time
      this._time += dtTime
      this._lastStepTime = this._time

console.log("hi", this._time);
      this.fire('time', this._time)

      // Run all of the runners directly
      var runnersLeft = false

      var eachFn = function (runner) {
        if(!runner.active) return

        // FIXME: runner is always called even when done
        // run the runner with delta time
        var finished = runner.step(dtTime).done

        // when finished set flag and return
        if (!finished) {
          runnersLeft = true
          return
        }

        // Remove the runner from the set
        // this._runner.

        // Runner is finished and might get removed
        if(this._persist !== true) {
          // Figure out end time of the runner
          var endTime = runner.duration() - runner.time() + this._time

          // Remove runner if too old
          if(endTime + this._persist < this._time) {
            runner.unschedule()
          }
        }
      }.bind(this)

      this._runners.forEach(eachFn)

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
        this._nextFrame = SVG.Animator.frame(this._step.bind(this))
      return this
    }
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
