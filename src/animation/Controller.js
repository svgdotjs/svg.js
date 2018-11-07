import { timeline } from '../modules/core/defaults.js'
import { extend } from '../utils/adopter.js'

/***
Base Class
==========
The base stepper class that will be
***/

function makeSetterGetter (k, f) {
  return function (v) {
    if (v == null) return this[v]
    this[k] = v
    if (f) f.call(this)
    return this
  }
}

export let easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 },
  bezier: function (t0, x0, t1, x1) {
    return function (t) {
      // TODO: FINISH
    }
  }
}

export class Stepper {
  done () { return false }
}

/***
Easing Functions
================
***/

export class Ease extends Stepper {
  constructor (fn) {
    super()
    this.ease = easing[fn || timeline.ease] || fn
  }

  step (from, to, pos) {
    if (typeof from !== 'number') {
      return pos < 1 ? from : to
    }
    return from + (to - from) * this.ease(pos)
  }
}

/***
Controller Types
================
***/

export class Controller extends Stepper {
  constructor (fn) {
    super()
    this.stepper = fn
  }

  step (current, target, dt, c) {
    return this.stepper(current, target, dt, c)
  }

  done (c) {
    return c.done
  }
}

function recalculate () {
  // Apply the default parameters
  var duration = (this._duration || 500) / 1000
  var overshoot = this._overshoot || 0

  // Calculate the PID natural response
  var eps = 1e-10
  var pi = Math.PI
  var os = Math.log(overshoot / 100 + eps)
  var zeta = -os / Math.sqrt(pi * pi + os * os)
  var wn = 3.9 / (zeta * duration)

  // Calculate the Spring values
  this.d = 2 * zeta * wn
  this.k = wn * wn
}

export class Spring extends Controller {
  constructor (duration, overshoot) {
    super()
    this.duration(duration || 500)
      .overshoot(overshoot || 0)
  }

  step (current, target, dt, c) {
    if (typeof current === 'string') return current
    c.done = dt === Infinity
    if (dt === Infinity) return target
    if (dt === 0) return current

    if (dt > 100) dt = 16

    dt /= 1000

    // Get the previous velocity
    var velocity = c.velocity || 0

    // Apply the control to get the new position and store it
    var acceleration = -this.d * velocity - this.k * (current - target)
    var newPosition = current +
      velocity * dt +
      acceleration * dt * dt / 2

    // Store the velocity
    c.velocity = velocity + acceleration * dt

    // Figure out if we have converged, and if so, pass the value
    c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002
    return c.done ? target : newPosition
  }
}

extend(Spring, {
  duration: makeSetterGetter('_duration', recalculate),
  overshoot: makeSetterGetter('_overshoot', recalculate)
})

export class PID extends Controller {
  constructor (p, i, d, windup) {
    super()

    p = p == null ? 0.1 : p
    i = i == null ? 0.01 : i
    d = d == null ? 0 : d
    windup = windup == null ? 1000 : windup
    this.p(p).i(i).d(d).windup(windup)
  }

  step (current, target, dt, c) {
    if (typeof current === 'string') return current
    c.done = dt === Infinity

    if (dt === Infinity) return target
    if (dt === 0) return current

    var p = target - current
    var i = (c.integral || 0) + p * dt
    var d = (p - (c.error || 0)) / dt
    var windup = this.windup

    // antiwindup
    if (windup !== false) {
      i = Math.max(-windup, Math.min(i, windup))
    }

    c.error = p
    c.integral = i

    c.done = Math.abs(p) < 0.001

    return c.done ? target : current + (this.P * p + this.I * i + this.D * d)
  }
}

extend(PID, {
  windup: makeSetterGetter('windup'),
  p: makeSetterGetter('P'),
  i: makeSetterGetter('I'),
  d: makeSetterGetter('D')
})
