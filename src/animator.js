/* global requestAnimationFrame */

SVG.Animator = {
  nextDraw: null,
  frames: new SVG.Queue(),
  timeouts: new SVG.Queue(),
  frameCount: 0,
  timeoutCount: 0,
  timer: window.performance || window.Date,

  frame: function (fn) {
    SVG.Animator.frames.push({
      id: SVG.Animator.frameCount,
      run: fn
    })

    if (SVG.Animator.nextDraw === null) {
      SVG.Animator.nextDraw = requestAnimationFrame(SVG.Animator._draw)
    }

    return ++SVG.Animator.frameCount
  },

  timeout: function (fn, delay) {
    delay = delay || 0

    // Work out when the event should fire
    var time = SVG.Animator.timer.now() + delay

    // Add the timeout to the end of the queue
    var thisId = SVG.Animator.timeoutCount++
    SVG.Animator.timeouts.push({
      id: thisId,
      run: fn,
      time: time
    })

    // Request another animation frame if we need one
    if (SVG.Animator.nextDraw === null) {
      SVG.Animator.nextDraw = requestAnimationFrame(SVG.Animator._draw)
    }

    return thisId
  },

  cancelTimeout: function (id) {
    // Find the index of the timeout to cancel and remove it
    var index = SVG.Animator.timeouts.remove(
      function (t) {
        return t.id === id
      }
    )
    return index
  },

  _draw: function (now) {

    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
    var tracking = true
    var nextTimeout = null
    var lastTimeout = SVG.Animator.timeouts.last()
    while ((nextTimeout = SVG.Animator.timeouts.shift())) {

      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.run()
      } else {
        SVG.Animator.timeouts.push(nextTimeout)
      }

        // If we hit the last item, we should stop shifting out more items
      if (nextTimeout === lastTimeout) break
    }

    // Run all of the frames available up until this point
    var lastFrame = SVG.Animator.frames.last()
    var lastFrameId = SVG.Animator.frameCount
    while (SVG.Animator.frames.first() && SVG.Animator.frames.first().id < lastFrameId) {
      var nextFrame = SVG.Animator.frames.shift()
      nextFrame.run(now)
    }

    // If we have remaining timeouts or frames, draw until we don't anymore
    SVG.Animator.nextDraw = SVG.Animator.timeouts.length > 0 || SVG.Animator.frames.length > 0
        ? requestAnimationFrame(SVG.Animator._draw)
        : null
  }
}
