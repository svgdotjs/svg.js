import { dispatch, off, on } from '../modules/core/event.js'
import { registerMethods } from '../utils/methods.js'
import Base from './Base.js'

export default class EventTarget extends Base {
  constructor ({ events = {} } = {}) {
    super()
    this.events = events
  }

  addEventListener () {}

  // Bind given event to listener
  on (event, listener, binding, options) {
    on(this, event, listener, binding, options)
    return this
  }

  // Unbind event from listener
  off (event, listener) {
    off(this, event, listener)
    return this
  }

  dispatch (event, data) {
    return dispatch(this, event, data)
  }

  dispatchEvent (event) {
    const bag = this.getEventHolder().events
    if (!bag) return true

    const events = bag[event.type]

    for (let i in events) {
      for (let j in events[i]) {
        events[i][j](event)
      }
    }

    return !event.defaultPrevented
  }

  // Fire given event
  fire (event, data) {
    this.dispatch(event, data)
    return this
  }

  getEventHolder () {
    return this
  }

  getEventTarget () {
    return this
  }

  removeEventListener () {}
}

// Add events to elements
const methods = [ 'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'touchstart',
  'touchmove',
  'touchleave',
  'touchend',
  'touchcancel' ].reduce(function (last, event) {
  // add event to Element
  const fn = function (f) {
    if (f === null) {
      off(this, event)
    } else {
      on(this, event, f)
    }
    return this
  }

  last[event] = fn
  return last
}, {})

registerMethods('Element', methods)
