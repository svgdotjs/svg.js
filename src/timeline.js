
// Must Change ....
SVG.easing = {
  '-': function (pos) { return pos },
  '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
}


function Runner (timeline) {

  // We store a reference to the function to run and the timeline to use
  this.functions = []
  this.timeline = timeline
  this.transforms = []
  this.done = false

  // We copy the current values from the timeline because they can change
  this._startTime = timeline._startTime
  this._duration = timeline._duration
  this._loop = timeline._loop
}

Runner.prototype = {

  add: function (initFn, runFn) {
    this.initialisers.push(initFn)
    this.functions.push(fn)
  },

  run: function (time) {

    var line = this.timeline

    // If it is time to do something, act now.
    var running = this._start < time && time < end
    if (running && this._running) {
      var position = (time - this._startTime) / this._duration
      var toRun = this.functions
      for (var i = 0, len = toRun.length,  i < len ; ++i) {
        toRun[i](position)
      }
    }

    // If we are not paused or stopped, request another frame
    if (this._running) SVG.Animator.frame(closure, this._startTime)

    // Tell the caller whether this animation is finished
    closure.finished = !running
  },

  stop: function () {

  },

  pause: function () {

  },
}


SVG.Timeline = SVG.invent({

  create: function (o, easy, delay, epoch) {

    this.baseTransform = []
    this.runners = []
    this.controller = null

    if(o instanceof 'function') {
      this.controller = o

    } else if (typeof o === 'object') {
      ease = o.ease
      delay = o.delay
      o = o.duration
    }

    this.ease = ease
    this.delay = delay
    this.duration = o
  },

  extend: {

    animate (duration, ease, delay, epoch)
    loop (times, reverse)
    duration (time)
    delay (by, epoch)
    ease (fn)

    play ()
    pause ()
    stop ()
    finish (all=true)
    speed (newSpeed)
    seek (dt)
    persist (dt || forever) // 0 by default
    reverse ()

    _step (dt) {

    },

    // Checks if we are running and continues the animation
    _continue () {
      ,   continue: function () {
              if (this.paused) return
              if (!this.nextFrame)
                  this.step()
              return this
          }

    }
  },


  construct: {
    animate: function(o, ease, delay, epoch) {
      return (this.timeline = this.timeline || new SVG.Timeline(o, ease, delay, epoch))
    }
  }

}

// Extend the attribute methods separately to avoid cluttering the main
// Timeline class above
SVG.extend(SVG.Timeline, {


  attr: function (a, v) {
    return this.styleAttr('attr', a, v)
  },

  // Add animatable styles
  css: function (s, v) {
    return this.styleAttr('css', s, v)
  },

  styleAttr (type, name, val) {
    // apply attributes individually
    if (typeof name === 'object') {
      for (var key in val) {
        this.styleAttr(type, key, val[key])
      }
    }

    var morpher = new Morph(this.controller).to(val)

    this.queue(
      function () {
        morpher = morpher.from(element[type]('name'))
      },
      function () {
        this.element[type](name, morpher.at(pos))
      }
    )

    return this
  },

  zoom(level, point) {
    let morpher = SVG.Number(level).controller(this.controller)
    this.queue(
      () => {morpher = morpher.from(element.zoom())},
      (pos) => {element.zoom(morpher.at(pos), point)}
    )
    return this
  }
})
