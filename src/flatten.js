import {Doc, G, Parent, Defs} from './classes.js'

export function flatten (parent) {
  // flatten is only possible for svgs and groups
  if (!(this instanceof G || this instanceof Doc)) {
    return this
  }

  parent = parent ||
    (this instanceof Doc && this.isRoot()
      ? this
      : this.parent(Parent))

  this.each(function () {
    if (this instanceof Defs) return this
    if (this instanceof Parent) return this.flatten(parent)
    return this.toParent(parent)
  })

  // we need this so that Doc does not get removed
  this.node.firstElementChild || this.remove()

  return this
}

export function ungroup (parent) {
  // ungroup is only possible for nested svgs and groups
  if (!(this instanceof G || (this instanceof Doc && !this.isRoot()))) {
    return this
  }

  parent = parent || this.parent(Parent)

  this.each(function () {
    return this.toParent(parent)
  })

  // we need this so that Doc does not get removed
  this.remove()

  return this
}
