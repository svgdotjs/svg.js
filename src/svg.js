/* global createElement, capitalize */
/* eslint-disable new-cap */

// The main wrapping element
var SVG = this.SVG = function (element) {
  if (SVG.supported) {
    element = createElement(element)
    return element
  }
}

// Svg must be supported if we reached this stage
SVG.supported = true

// Default namespaces
SVG.ns = 'http://www.w3.org/2000/svg'
SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
SVG.xlink = 'http://www.w3.org/1999/xlink'
SVG.svgjs = 'http://svgjs.com/svgjs'

// Element id sequence
SVG.did = 1000

// Get next named element id
SVG.eid = function (name) {
  return 'Svgjs' + capitalize(name) + (SVG.did++)
}

// Method for element creation
SVG.create = function (name) {
  // create element
  return document.createElementNS(this.ns, name)
}

// Method for extending objects
SVG.extend = function (modules, methods) {
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

var wrapFn = function(method, initializer) {
  return function(o) {
    if(!(initializer.prototype instanceof SVG.Element))
      return method.apply(this, [].slice.call(arguments))

    if(o instanceof initializer) {
      return o.clone(this)
    }

    if(typeof o == 'object') {
      return this.put(new initializer()).attr(o)
    }

    return method.apply(this, [].slice.call(arguments))
  }
}

// Invent new element
SVG.invent = function (config) {
  // Create element initializer
  var initializer = typeof config.create === 'function' ? config.create
    : function (node) {
      this.constructor(node || SVG.create(config.create))
    }

  // Inherit prototype
  if (config.inherit) {
    initializer.prototype = new config.inherit()
  }

  // Extend with methods
  if (config.extend) {
    SVG.extend(initializer, config.extend)
  }

  for(var i in config.construct) {
    config.construct[i] = wrapFn(config.construct[i], initializer)
  }

  // Attach construct method to parent
  if (config.construct) { SVG.extend(config.parent || SVG.Container, config.construct) }

  return initializer
}

// Adopt existing svg elements
SVG.adopt = function (node) {
  // check for presence of node
  if (!node) return null

  // make sure a node isn't already adopted
  if (node.instance instanceof SVG.Element) return node.instance

  if (!(node instanceof window.SVGElement)) {
    return new SVG.HtmlNode(node)
  }

  // initialize variables
  var element

  // adopt with element-specific settings
  if (node.nodeName === 'svg') {
    element = new SVG.Doc(node)
  } else if (node.nodeName === 'linearGradient' || node.nodeName === 'radialGradient') {
    element = new SVG.Gradient(node)
  } else if (SVG[capitalize(node.nodeName)]) {
    element = new SVG[capitalize(node.nodeName)](node)
  } else {
    element = new SVG.Parent(node)
  }

  return element
}
