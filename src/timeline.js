
// Must Change ....
SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
}

var time = performance || Date

var makeSchedule = function (runnerInfo) {
  var start = runnerInfo.start
  var duration = runnerInfo.runner.duration()
  var end = start + duration
  return {start: start, duration: duration, end: end, runner: runnerInfo.runner}
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
    this._nextFrame = null
    this._paused = false
    this._runners = []
    this._order = []
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

      if(runner == null) {
        return this._runners.map(makeSchedule).sort(function (a, b) {
          return (a.start - b.start) ||  (a.duration - b.duration)
        })
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

      // manage runner
      runner.unschedule()
      runner.timeline(this)
      runner.time(-absoluteStartTime)

      // save startTime for next runner
      this._startTime = absoluteStartTime + runner.duration()

      // save runnerInfo
      this._runners[runner.id] = {
        persist: this.persist(),
        runner: runner,
        start: absoluteStartTime
      }
      // save order and continue
      this._order.push(runner.id)
      this._continue()
      return this
    },

    // remove the runner from this timeline
    unschedule (runner) {
      var index = this._order.indexOf(runner.id)
      if(index < 0) return this

      delete this._runners[runner.id]
      this._order.splice(index, 1)
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
      if (dtOrForever == null) return this._persist
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
      // this.fire('time', this._time)

      // Run all of the runners directly
      var runnersLeft = false
      for (var i = 0, len = this._order.length; i < len; i++) {
        // Get and run the current runner and ignore it if its inactive
        var runnerInfo = this._runners[this._order[i]]
        var runner = runnerInfo.runner

        if(!runner.active()) continue

        // If this runner is still going, signal that we need another animation
        // frame, otherwise, remove the completed runner
        var finished = runner.step(dtTime).done
        if (!finished) {
          runnersLeft = true
          // continue
        }


        // } else if(runnerInfo.persist !== true){
        //
        //   // runner is finished. And runner might get removed
        //
        //   // TODO: Figure out end time of runner
        //   var endTime = runner.duration() - runner.time() + this._time
        //
        //   if(endTime + this._persist < this._time) {
        //     // FIXME: which one is better?
        //     // runner.unschedule()
        //     // --i
        //     // --len
        //
        //     // delete runner and correct index
        //     this._runners.splice(i--, 1) && --len
        //     runner.timeline(null)
        //   }
        //
        // }
      }

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
