import { addMethodNames } from './methods.js'
import { capitalize } from './utils.js'
import { ns } from '../modules/core/namespaces.js'
import { globals } from '../utils/window.js'
import Base from '../types/Base.js'

const elements = {}
export const root = '___SYMBOL___ROOT___'

// Method for element creation
export function create (name) {
  // create element
  return globals.document.createElementNS(ns, name)
}

export function makeInstance (element) {
  if (element instanceof Base) return element

  if (typeof element === 'object') {
    return adopter(element)
  }

  if (element == null) {
    return new elements[root]()
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return adopter(globals.document.querySelector(element))
  }

  var node = create('svg')
  node.innerHTML = element

  // We can use firstChild here because we know,
  // that the first char is < and thus an element
  element = adopter(node.firstChild)

  return element
}

export function nodeOrNew (name, node) {
  return node instanceof globals.window.Node ? node : create(name)
}

// Adopt existing svg elements
export function adopt (node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance instanceof Base) return node.instance

  // initialize variables
  var className = capitalize(node.nodeName || 'Dom')

  // Make sure that gradients are adopted correctly
  if (className === 'LinearGradient' || className === 'RadialGradient') {
    className = 'Gradient'

  // Fallback to Dom if element is not known
  } else if (!elements[className]) {
    className = 'Dom'
  }

  return new elements[className](node)
}

let adopter = adopt

export function mockAdopt (mock = adopt) {
  adopter = mock
}

export function register (element, name = element.name, asRoot = false) {
  elements[name] = element
  if (asRoot) elements[root] = element

  addMethodNames(Object.getOwnPropertyNames(element.prototype))

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
export function extend (modules, methods, attrCheck) {
  var key, i

  modules = Array.isArray(modules) ? modules : [ modules ]

  for (i = modules.length - 1; i >= 0; i--) {
    for (key in methods) {
      let method = methods[key]
      if (attrCheck) {
        method = wrapWithAttrCheck(methods[key])
      }
      modules[i].prototype[key] = method
    }
  }
}

// export function extendWithAttrCheck (...args) {
//   extend(...args, true)
// }

export function wrapWithAttrCheck (fn) {
  return function (...args) {
    const o = args[args.length - 1]

    if (o && o.constructor === Object && !(o instanceof Array)) {
      return fn.apply(this, args.slice(0, -1)).attr(o)
    } else {
      return fn.apply(this, args)
    }
  }
}

export function invent (config) {
  // Create element initializer
  var initializer = typeof config.create === 'function'
    ? config.create
    : function (node) {
      this.constructor(node || create(config.create))
    }

  // Inherit prototype
  if (config.inherit) {
    /* eslint new-cap: off */
    initializer.prototype = new config.inherit()
    initializer.prototype.constructor = initializer
  }

  // Extend with methods
  if (config.extend) { extend(initializer, config.extend) }

  // Attach construct method to parent
  if (config.construct) { extend(config.parent || elements.Container, config.construct) }

  return initializer
}
