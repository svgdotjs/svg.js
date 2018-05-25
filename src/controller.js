
// c = {
//   finished: Whether or not we are finished
// }

/***
Base Class
==========
The base stepper class that will be
***/

function makeSetterGetter (k) {
  return function (v) {
    if (v == null) return this[v]
    this[k] = v
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

SVG.Spring = function spring(duration, overshoot) {

  // Apply the default parameters
  duration = duration || 500
  overshoot = overshoot || 15

  // Calculate the PID natural response
  var eps = 1e-10
  var os = overshoot / 100 + eps
  var zeta = -Math.log(os) / Math.sqrt(Math.PI ** 2 + Math.log(os) ** 2)
  var wn = 4 / (zeta * duration / 1000)

  // Calculate the Spring values
  var D = 2 * zeta * wn
  var K = wn * wn

  // Return the acceleration required
  return new SVG.Controller(
    function (current, target, dt, c) {

      if(dt == Infinity) return target

      // Get the parameters
      var error = target - current
      var lastError = c.error || 0
      var velocity = (error - c.error) / dt

      // Apply the control to get the new position and store it
      var control = -D * velocity - K * error
      var newPosition = current + control
      c.error = error
      return newPosition
  })
}

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

      return current + (this.P * p + this.I * i + this.D * d)
    },

    windup: makeSetterGetter('windup'),
    p: makeSetterGetter('P'),
    i: makeSetterGetter('I'),
    d: makeSetterGetter('D'),
  }
})
/*
SVG.PID = function (P, I, D, antiwindup) {
  P = P == null ? 0.1 : P
  I = I == null ? 0.01 : I
  D = D == null ? 0 : D
  antiwindup = antiwindup == null ? 1000 : antiwindup

  // Return the acceleration required
  return new SVG.Controller(
    function (current, target, dt, c) {

      if(dt == Infinity) return target
      if(dt == 0) return current

      var p = target - current
      var i = (c.integral || 0) + p * dt
      var d = (p - (c.error || 0)) / dt

      // antiwindup
      i = Math.max(-antiwindup, Math.min(i, antiwindup))

      c.error = p
      c.integral = i

      return current + (P * p + I * i + D * d)
  })
}*/
