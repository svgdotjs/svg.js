
// c = {
//   finished: Whether or not we are finished
// }

/***
Base Class
==========
The base stepper class that will be
***/

SVG.Stepper = SVG.invent ({

  create: function (fn) {

  },

  extend: {

    step: function (current, target, dt, c) {

    },

    isComplete: function (dt, c) {

    },
  },
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

    isComplete: function (dt, c) {
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
  },

  extend: {

    step: function (current, target, dt, c) {

    },

    isComplete: function (dt, c) {

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
