import { dispatch, off, on } from '../modules/core/event.js'
import { register } from '../utils/adopter.js'
import Base from './Base.js'

export default class EventTarget extends Base {
  constructor ({ events = {} } = {}) {
    super()
    this.events = events
  }

  addEventListener () {}

  dispatch (event, data) {
    return dispatch(this, event, data)
  }

  dispatchEvent (event) {
    const bag = this.getEventHolder().events
    if (!bag) return true

    const events = bag[event.type]

    for (const i in events) {
      for (const j in events[i]) {
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

  // Unbind event from listener
  off (event, listener) {
    off(this, event, listener)
    return this
  }

  // Bind given event to listener
  on (event, listener, binding, options) {
    on(this, event, listener, binding, options)
    return this
  }

  removeEventListener () {}
}

register(EventTarget, 'EventTarget')
