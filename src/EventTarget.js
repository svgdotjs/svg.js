import Base from './Base.js'
import {on, off, dispatch} from './event.js'
import {extend} from './tools.js'

export default class EventTarget extends Base{
  constructor (node = {}) {
    super()
    this.events = node.events || {}
  }

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

  // Fire given event
  fire (event, data) {
    this.dispatch(event, data)
    return this
  }
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

extend(EventTarget, methods)


// registerMethods('EventTarget', {
//   on, off, dispatch, fire
// })
//
// registerConstructor('EventTarget', setup)
