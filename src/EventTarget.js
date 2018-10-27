import {on as _on, off as _off, dispatch as _dispatch} from './event.js'

export const name = 'EventTarget'

export function setup (node = {}) {
  this.events = node.events || {}
}

  // Bind given event to listener
export function on (event, listener, binding, options) {
  _on(this, event, listener, binding, options)
  return this
}

  // Unbind event from listener
export function off (event, listener) {
  _off(this, event, listener)
  return this
}

export function dispatch (event, data) {
  return _dispatch(this, event, data)
}

  // Fire given event
export function fire (event, data) {
  this.dispatch(event, data)
  return this
}
