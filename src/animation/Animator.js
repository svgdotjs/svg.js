import { globals } from '../utils/window.js'
import Queue from './Queue.js'

const Animator = {
  nextDraw: null,
  frames: new Queue(),
  timeouts: new Queue(),
  immediates: new Queue(),
  timer: () => globals.window.performance || globals.window.Date,

  frame(fn) {
    // Store the node
    const node = Animator.frames.push({ run: fn })

    // Request an animation frame if we don't have one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw)
    }

    // Return the node so we can remove it easily
    return node
  },

  timeout(fn, delay) {
    delay = delay || 0

    // Work out when the event should fire
    const time = Animator.timer().now() + delay

    // Add the timeout to the end of the queue
    const node = Animator.timeouts.push({ run: fn, time: time })

    // Request another animation frame if we need one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw)
    }

    return node
  },

  immediate(fn) {
    // Add the immediate fn to the end of the queue
    const node = Animator.immediates.push(fn)
    // Request another animation frame if we need one
    if (Animator.nextDraw === null) {
      Animator.nextDraw = globals.window.requestAnimationFrame(Animator._draw)
    }

    return node
  },

  cancelFrame(node) {
    node != null && Animator.frames.remove(node)
  },

  clearTimeout(node) {
    node != null && Animator.timeouts.remove(node)
  },

  cancelImmediate(node) {
    node != null && Animator.immediates.remove(node)
  },

  _draw(now) {
    let sentinel = null

    try {
      let node = null
      sentinel = Animator.timeouts._first ? Animator.timeouts.push({}) : null

      while ((node = Animator.timeouts.shiftNode())) {
        if (node === sentinel) break

        if (now >= node.value.time) {
          node.value.run()
        } else {
          Animator.timeouts.push(node)
        }
      }

      // Run all of the animation frames
      let nextFrame = null
      const lastFrame = Animator.frames.last()
      while (nextFrame !== lastFrame && (nextFrame = Animator.frames.shift())) {
        nextFrame.run(now)
      }

      let nextImmediate = null
      while ((nextImmediate = Animator.immediates.shift())) {
        nextImmediate()
      }
    } finally {
      if (sentinel) {
        Animator.timeouts.remove(sentinel)
      }

      // Callback errors intentionally propagate. Always restore the scheduler
      // first so queued work can continue on a later frame.
      const pending =
        Animator.timeouts.first() ||
        Animator.frames.first() ||
        Animator.immediates.first()

      Animator.nextDraw = pending
        ? globals.window.requestAnimationFrame(Animator._draw)
        : null
    }
  }
}

export default Animator
