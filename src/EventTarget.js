import {on, off, dispatch} from './event.js'

export default class EventTarget {
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
