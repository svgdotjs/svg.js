import {ns} from './namespaces.js'
import {capitalize} from './helpers.js'

export function nodeOrNew (name, node) {
  return node || makeNode(name)
}

// Method for element creation
export function makeNode (name) {
  // create element
  return document.createElementNS(ns, name)
}

// Method for extending objects
export function extend (modules, methods) {
  var key, i

  if (Array.isArray(methods)) {
    methods.forEach((method) => {
      extend(modules, method)
    })
    return
  }

  modules = Array.isArray(modules) ? modules : [modules]

  for (i = modules.length - 1; i >= 0; i--) {
    if (methods.name) {
      modules[i].extensions = (modules[i].extensions || []).concat(methods)
    }
    for (key in methods) {
      if (modules[i].prototype[key] || key == 'name' || key == 'setup') continue
      modules[i].prototype[key] = methods[key]
    }
  }
}

// FIXME: enhanced constructors here
export function addFactory (modules, methods) {
  extend(modules, methods)
}

// Invent new element
export function invent (config) {
  // Create element initializer
  var initializer = typeof config.create === 'function' ? config.create
    : function (node) {
      config.inherit.call(this, node || makeNode(config.create))
    }

  // Inherit prototype
  if (config.inherit) {
    initializer.prototype = new config.inherit()
    initializer.prototype.constructor = initializer
  }

  // Extend with methods
  if (config.extend) {
    extend(initializer, config.extend)
  }

  // Attach construct method to parent
  if (config.construct) { extend(config.parent || Container, config.construct) }

  return initializer
}
