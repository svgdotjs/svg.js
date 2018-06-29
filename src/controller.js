
// c = {
//   finished: Whether or not we are finished
// }

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

SVG.Stepper = SVG.invent ({
  create: function () {},
})

/***
Easing Functions
================
***/

SVG.Ease = SVG.invent ({

  inherit: SVG.Stepper,

  create: function (fn) {
    SVG.Stepper.call(this, fn)

    this.ease = SVG.easing[fn || SVG.defaults.timeline.ease] || fn
  },

  extend: {

    step: function (from, to, pos) {
      if(typeof from !== 'number') {
        return pos < 1 ? from : to
      }
      return from + (to - from) * this.ease(pos)
    },

    done: function (dt, c) {
      return false
    },
  },
})

SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 },
  bezier: function (t0, x0, t1, x1) {
    return function (t) {
      // TODO: FINISH
    }
  },
}


/***
Controller Types
================
***/

SVG.Controller =  SVG.invent ({

  inherit: SVG.Stepper,

  create: function (fn) {
    SVG.Stepper.call(this, fn)
    this.stepper = fn
  },

  extend: {

    step: function (current, target, dt, c) {
      return this.stepper(current, target, dt, c)
    },

    done: function (c) {
      return c.done
    },
  },
})

function recalculate () {

  // Apply the default parameters
  var duration = (this._duration || 500) / 1000
  var overshoot = this._overshoot || 0

  // Calculate the PID natural response
  var eps = 1e-10
  var pi = Math.PI
  var os = Math.log(overshoot / 100 + eps)
  var zeta = - os / Math.sqrt(pi * pi + os * os)
  var wn = 3.9 / ( zeta * duration )

  // Calculate the Spring values
  this.d = 2 * zeta * wn
  this.k = wn * wn
}

SVG.Spring = SVG.invent ({
  inherit: SVG.Controller,

  create: function (duration, overshoot) {
    this.duration(duration || 500)
      .overshoot(overshoot || 0)
  },

  extend: {
    step: function (current, target, dt, c) {

      if (typeof current == 'string') return current
      c.done = dt == Infinity
      if(dt == Infinity) return target
      if(dt == 0) return current
      dt /= 1000

      // Get the previous velocity
      var velocity = c.velocity || 0

      // Apply the control to get the new position and store it
      var acceleration = - this.d * velocity - this.k * (current - target)
      var newPosition = current
        + velocity * dt
        + acceleration * dt * dt / 2

      // Store the velocity
      c.velocity = velocity + acceleration * dt

      // Figure out if we have converged, and if so, pass the value
      c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002
      return c.done ? target : newPosition
    },

    duration: makeSetterGetter('_duration', recalculate),
    overshoot: makeSetterGetter('_overshoot', recalculate),
  }
})

SVG.PID = SVG.invent ({
  inherit: SVG.Controller,

  create: function (p, i, d, windup) {
    if(!(this instanceof SVG.PID))
      return new SVG.PID(p, i, d, windup)
    SVG.Controller.call(this)

    p = p == null ? 0.1 : p
    i = i == null ? 0.01 : i
    d = d == null ? 0 : d
    windup = windup == null ? 1000 : windup
    this.p(p).i(i).d(d).windup(windup)
  },

  extend: {
    step: function (current, target, dt, c) {

      if (typeof current == 'string') return current
      c.done = dt == Infinity

      if(dt == Infinity) return target
      if(dt == 0) return current

      var p = target - current
      var i = (c.integral || 0) + p * dt
      var d = (p - (c.error || 0)) / dt
      var windup = this.windup

      // antiwindup
      if(windup !== false)
        i = Math.max(-windup, Math.min(i, windup))

      c.error = p
      c.integral = i

      c.done = Math.abs(p) < 0.001

      return c.done ? target : current + (this.P * p + this.I * i + this.D * d)
    },

    windup: makeSetterGetter('windup'),
    p: makeSetterGetter('P'),
    i: makeSetterGetter('I'),
    d: makeSetterGetter('D'),
  }
})
