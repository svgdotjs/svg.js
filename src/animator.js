/* global requestAnimationFrame */

SVG.Animator = {
  nextDraw: null,
  frames: new SVG.Queue(),
  timeouts: new SVG.Queue(),
  timer: window.performance || window.Date,

  frame: function (fn) {

    // Store the node
    var node = SVG.Animator.frames.push({ run: fn })

    // Request an animation frame if we don't have one
    if (SVG.Animator.nextDraw === null) {
      SVG.Animator.nextDraw = requestAnimationFrame(SVG.Animator._draw)
    }

    // Return the node so we can remove it easily
    return node
  },

  timeout: function (fn, delay) {
    delay = delay || 0

    // Work out when the event should fire
    var time = SVG.Animator.timer.now() + delay

    // Add the timeout to the end of the queue
    var node = SVG.Animator.timeouts.push({ run: fn, time: time })

    // Request another animation frame if we need one
    if (SVG.Animator.nextDraw === null) {
      SVG.Animator.nextDraw = requestAnimationFrame(SVG.Animator._draw)
    }

    return node
  },

  cancelFrame: function (node) {
    SVG.Animator.frames.remove(node)
  },

  clearTimeout: function (node) {
    SVG.Animator.timeouts.remove(node)
  },

  _draw: function (now) {

    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
    var nextTimeout = null
    var lastTimeout = SVG.Animator.timeouts.last()
    while (nextTimeout = SVG.Animator.timeouts.shift()) {

      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.run()
      } else {
        SVG.Animator.timeouts.push(nextTimeout)
      }

      // If we hit the last item, we should stop shifting out more items
      if (nextTimeout === lastTimeout) break
    }

    // Run all of the animation frames
    var nextFrame = null
    var lastFrame = SVG.Animator.frames.last()
    while ((nextFrame !== lastFrame) && (nextFrame = SVG.Animator.frames.shift())) {
      nextFrame.run()
    }
    
    // If we have remaining timeouts or frames, draw until we don't anymore
    SVG.Animator.nextDraw = SVG.Animator.timeouts.first() || SVG.Animator.frames.first()
        ? requestAnimationFrame(SVG.Animator._draw)
        : null
  }
}
