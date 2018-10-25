import {ns} from './namespaces.js'
import {Container, Element, HtmlNode, Doc, Gradient, Parent} from './classes.js'

// Element id sequence
let did = 1000

// Get next named element id
export function eid (name) {
  return 'Svgjs' + capitalize(name) + (did++)
}

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

  modules = Array.isArray(modules) ? modules : [modules]

  for (i = modules.length - 1; i >= 0; i--) {
    if (modules[i]) {
      for (key in methods) {
        modules[i].prototype[key] = methods[key]
      }
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

// Adopt existing svg elements
export function adopt (node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance instanceof Element) return node.instance

  if (!(node instanceof window.SVGElement)) {
    return new HtmlNode(node)
  }

  // initialize variables
  var element

  // adopt with element-specific settings
  if (node.nodeName === 'svg') {
    element = new Doc(node)
  } else if (node.nodeName === 'linearGradient' || node.nodeName === 'radialGradient') {
    element = new Gradient(node)
  } else if (SVG[capitalize(node.nodeName)]) {
    element = new SVG[capitalize(node.nodeName)](node)
  } else {
    element = new Parent(node)
  }

  return element
}
