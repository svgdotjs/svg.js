import { makeInstance } from '../../utils/adopter.js'
import { registerMethods } from '../../utils/methods.js'

// Get all siblings, including myself
export function siblings () {
  return this.parent().children()
}

// Get the curent position siblings
export function position () {
  return this.parent().index(this)
}

// Get the next element (will return null if there is none)
export function next () {
  return this.siblings()[this.position() + 1]
}

// Get the next element (will return null if there is none)
export function prev () {
  return this.siblings()[this.position() - 1]
}

// Send given element one step forward
export function forward () {
  var i = this.position() + 1
  var p = this.parent()

  // move node one step forward
  p.removeElement(this).add(this, i)

  // make sure defs node is always at the top
  if (typeof p.isRoot === 'function' && p.isRoot()) {
    p.node.appendChild(p.defs().node)
  }

  return this
}

// Send given element one step backward
export function backward () {
  var i = this.position()

  if (i > 0) {
    this.parent().removeElement(this).add(this, i - 1)
  }

  return this
}

// Send given element all the way to the front
export function front () {
  var p = this.parent()

  // Move node forward
  p.node.appendChild(this.node)

  // Make sure defs node is always at the top
  if (typeof p.isRoot === 'function' && p.isRoot()) {
    p.node.appendChild(p.defs().node)
  }

  return this
}

// Send given element all the way to the back
export function back () {
  if (this.position() > 0) {
    this.parent().removeElement(this).add(this, 0)
  }

  return this
}

// Inserts a given element before the targeted element
export function before (element) {
  element = makeInstance(element)
  element.remove()

  var i = this.position()

  this.parent().add(element, i)

  return this
}

// Inserts a given element after the targeted element
export function after (element) {
  element = makeInstance(element)
  element.remove()

  var i = this.position()

  this.parent().add(element, i + 1)

  return this
}

export function insertBefore (element) {
  element = makeInstance(element)
  element.before(this)
  return this
}

export function insertAfter (element) {
  element = makeInstance(element)
  element.after(this)
  return this
}

registerMethods('Dom', {
  siblings,
  position,
  next,
  prev,
  forward,
  backward,
  front,
  back,
  before,
  after,
  insertBefore,
  insertAfter
})
