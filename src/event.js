import {delimiter} from './regex.js'
import {registerMethods} from './methods.js'

let listenerId = 0

function getEventTarget (node) {
  return typeof node.getEventTarget === 'function'
    ? node.getEventTarget()
    : node
}

// Add event binder in the SVG namespace
export function on (node, events, listener, binding, options) {
  var l = listener.bind(binding || node)
  var n = getEventTarget(node)

  // events can be an array of events or a string of events
  events = Array.isArray(events) ? events : events.split(delimiter)

  // ensure instance object for nodes which are not adopted
  n.instance = n.instance || {events: {}}

  // pull event handlers from the element
  var bag = n.instance.events

  // add id to listener
  if (!listener._svgjsListenerId) {
    listener._svgjsListenerId = ++listenerId
  }

  events.forEach(function (event) {
    var ev = event.split('.')[0]
    var ns = event.split('.')[1] || '*'

    // ensure valid object
    bag[ev] = bag[ev] || {}
    bag[ev][ns] = bag[ev][ns] || {}

    // reference listener
    bag[ev][ns][listener._svgjsListenerId] = l

    // add listener
    n.addEventListener(ev, l, options || false)
  })
}

// Add event unbinder in the SVG namespace
export function off (node, events, listener, options) {
  var n = getEventTarget(node)

  // we cannot remove an event if its not an svg.js instance
  if (!n.instance) return

  // listener can be a function or a number
  if (typeof listener === 'function') {
    listener = listener._svgjsListenerId
    if (!listener) return
  }

  // pull event handlers from the element
  var bag = n.instance.events

  // events can be an array of events or a string or undefined
  events = Array.isArray(events) ? events : (events || '').split(delimiter)

  events.forEach(function (event) {
    var ev = event && event.split('.')[0]
    var ns = event && event.split('.')[1]
    var namespace, l

    if (listener) {
      // remove listener reference
      if (bag[ev] && bag[ev][ns || '*']) {
        // removeListener
        n.removeEventListener(ev, bag[ev][ns || '*'][listener], options || false)

        delete bag[ev][ns || '*'][listener]
      }
    } else if (ev && ns) {
      // remove all listeners for a namespaced event
      if (bag[ev] && bag[ev][ns]) {
        for (l in bag[ev][ns]) { off(n, [ev, ns].join('.'), l) }

        delete bag[ev][ns]
      }
    } else if (ns) {
      // remove all listeners for a specific namespace
      for (event in bag) {
        for (namespace in bag[event]) {
          if (ns === namespace) { off(n, [event, ns].join('.')) }
        }
      }
    } else if (ev) {
      // remove all listeners for the event
      if (bag[ev]) {
        for (namespace in bag[ev]) { off(n, [ev, namespace].join('.')) }

        delete bag[ev]
      }
    } else {
      // remove all listeners on a given node
      for (event in bag) { off(n, event) }

      n.instance.events = {}
    }
  })
}

export function dispatch (node, event, data) {
  var n = getEventTarget(node)

  // Dispatch event
  if (event instanceof window.Event) {
    n.dispatchEvent(event)
  } else {
    event = new window.CustomEvent(event, {detail: data, cancelable: true})
    n.dispatchEvent(event)
  }
  return event
}
