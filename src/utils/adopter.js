import { capitalize } from './utils.js'
import { ns } from '../modules/core/namespaces.js'
import Base from '../types/Base.js'

const elements = {}
export const root = Symbol('root')

// Method for element creation
export function makeNode (name) {
  // create element
  return document.createElementNS(ns, name)
}

export function makeInstance (element) {
  if (element instanceof Base) return element

  if (typeof element === 'object') {
    return adopt(element)
  }

  if (element == null) {
    return new elements[root]()
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return adopt(document.querySelector(element))
  }

  var node = makeNode('svg')
  node.innerHTML = element

  // We can use firstChild here because we know,
  // that the first char is < and thus an element
  element = adopt(node.firstChild)

  return element
}

export function nodeOrNew (name, node) {
  return node || makeNode(name)
}

// Adopt existing svg elements
export function adopt (node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance instanceof Base) return node.instance

  if (!(node instanceof window.SVGElement)) {
    return new elements.HtmlNode(node)
  }

  // initialize variables
  var element

  // adopt with element-specific settings
  if (node.nodeName === 'svg') {
    element = new elements[root](node)
  } else if (node.nodeName === 'linearGradient' || node.nodeName === 'radialGradient') {
    element = new elements.Gradient(node)
  } else if (elements[capitalize(node.nodeName)]) {
    element = new elements[capitalize(node.nodeName)](node)
  } else {
    element = new elements.Bare(node)
  }

  return element
}

export function register (element, name = element.name, asRoot = false) {
  elements[name] = element
  if (asRoot) elements[root] = element
  return element
}

export function getClass (name) {
  return elements[name]
}

// Element id sequence
let did = 1000

// Get next named element id
export function eid (name) {
  return 'Svgjs' + capitalize(name) + (did++)
}

// Deep new id assignment
export function assignNewId (node) {
  // do the same for SVG child nodes as well
  for (var i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i])
  }

  if (node.id) {
    return adopt(node).id(eid(node.nodeName))
  }

  return adopt(node)
}

// Method for extending objects
export function extend (modules, methods) {
  var key, i

  modules = Array.isArray(modules) ? modules : [modules]

  for (i = modules.length - 1; i >= 0; i--) {
    for (key in methods) {
      modules[i].prototype[key] = methods[key]
    }
  }
}
