import Animator from './Animator.js'
import {registerMethods} from './methods.js'

var time = window.performance || Date

var makeSchedule = function (runnerInfo) {
  var start = runnerInfo.start
  var duration = runnerInfo.runner.duration()
  var end = start + duration
  return {start: start, duration: duration, end: end, runner: runnerInfo.runner}
}

export default class Timeline {
  // Construct a new timeline on the given element
  constructor () {
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
  }

  getEventTarget () {
    return this._dispatcher
  }

  /**
   *
   */

  // schedules a runner on the timeline
  schedule (runner, delay, when) {
    if (runner == null) {
      return this._runners.map(makeSchedule).sort(function (a, b) {
        return (a.start - b.start) || (a.duration - b.duration)
      })
    }

    if (!this.active()) {
      this._step()
      if (when == null) {
        when = 'now'
      }
    }

    // The start time for the next animation can either be given explicitly,
    // derived from the current timeline time or it can be relative to the
    // last start time to chain animations direclty
    var absoluteStartTime = 0
    delay = delay || 0

    // Work out when to start the animation
    if (when == null || when === 'last' || when === 'after') {
      // Take the last time and increment
      absoluteStartTime = this._startTime
    } else if (when === 'absolute' || when === 'start') {
      absoluteStartTime = delay
      delay = 0
    } else if (when === 'now') {
      absoluteStartTime = this._time
    } else if (when === 'relative') {
      let runnerInfo = this._runners[runner.id]
      if (runnerInfo) {
        absoluteStartTime = runnerInfo.start + delay
        delay = 0
      }
    } else {
      throw new Error('Invalid value for the "when" parameter')
    }

    // Manage runner
    runner.unschedule()
    runner.timeline(this)
    runner.time(-delay)

    // Save startTime for next runner
    this._startTime = absoluteStartTime + runner.duration() + delay

    // Save runnerInfo
    this._runners[runner.id] = {
      persist: this.persist(),
      runner: runner,
      start: absoluteStartTime
    }

    // Save order and continue
    this._order.push(runner.id)
    this._continue()
    return this
  }

  // Remove the runner from this timeline
  unschedule (runner) {
    var index = this._order.indexOf(runner.id)
    if (index < 0) return this

    delete this._runners[runner.id]
    this._order.splice(index, 1)
    runner.timeline(null)
    return this
  }

  play () {
    // Now make sure we are not paused and continue the animation
    this._paused = false
    return this._continue()
  }

  pause () {
    // Cancel the next animation frame and pause
    this._nextFrame = null
    this._paused = true
    return this
  }

  stop () {
    // Cancel the next animation frame and go to start
    this.seek(-this._time)
    return this.pause()
  }

  finish () {
    this.seek(Infinity)
    return this.pause()
  }

  speed (speed) {
    if (speed == null) return this._speed
    this._speed = speed
    return this
  }

  reverse (yes) {
    var currentSpeed = this.speed()
    if (yes == null) return this.speed(-currentSpeed)

    var positive = Math.abs(currentSpeed)
    return this.speed(yes ? positive : -positive)
  }

  seek (dt) {
    this._time += dt
    return this._continue()
  }

  time (time) {
    if (time == null) return this._time
    this._time = time
    return this
  }

  persist (dtOrForever) {
    if (dtOrForever == null) return this._persist
    this._persist = dtOrForever
    return this
  }

  source (fn) {
    if (fn == null) return this._timeSource
    this._timeSource = fn
    return this
  }

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
      let dt = dtTime

      // Make sure that we give the actual difference
      // between runner start time and now
      let dtToStart = this._time - runnerInfo.start

      // Dont run runner if not started yet
      if (dtToStart < 0) {
        runnersLeft = true
        continue
      } else if (dtToStart < dt) {
        // Adjust dt to make sure that animation is on point
        dt = dtToStart
      }

      if (!runner.active()) continue

      // If this runner is still going, signal that we need another animation
      // frame, otherwise, remove the completed runner
      var finished = runner.step(dt).done
      if (!finished) {
        runnersLeft = true
        // continue
      } else if (runnerInfo.persist !== true) {
        // runner is finished. And runner might get removed

        // TODO: Figure out end time of runner
        var endTime = runner.duration() - runner.time() + this._time

        if (endTime + this._persist < this._time) {
          // Delete runner and correct index
          delete this._runners[this._order[i]]
          this._order.splice(i--, 1) && --len
          runner.timeline(null)
        }
      }
    }

    // Get the next animation frame to keep the simulation going
    if (runnersLeft) {
      this._nextFrame = Animator.frame(this._step.bind(this))
    } else {
      this._nextFrame = null
    }
    return this
  }

  // Checks if we are running and continues the animation
  _continue () {
    if (this._paused) return this
    if (!this._nextFrame) {
      this._nextFrame = Animator.frame(this._step.bind(this))
    }
    return this
  }

  active () {
    return !!this._nextFrame
  }
}

registerMethods({
  Element: {
    timeline: function () {
      this._timeline = (this._timeline || new Timeline())
      return this._timeline
    }
  }
})
