// import {extend} from './tools.js'
// import * as Element from './Element.js'
// import Defs from './Defs.js'
//
// extend(Defs, [EventTarget, Element, Parent])

import {makeInstance} from './adopter.js'
import * as Classes from './classes.js'
import * as adopter from './adopter.js'
import * as tools from './tools.js'
import * as containers from './containers.js'
import * as elements from './elements.js'
import './attr.js'
import './arrange.js'
import './selector.js'
import './css.js'
import './transform.js'
import './memory.js'
import './sugar.js'
import {getMethodsFor, getConstructor} from './methods.js'
const extend = tools.extend

import './EventTarget.js'
import './Element.js'
import './Parent.js'

extend([
  Classes.Doc,
  Classes.Symbol,
  Classes.Image,
  Classes.Pattern,
  Classes.Marker
], getMethodsFor('viewbox'))

extend([
  Classes.Line,
  Classes.Polyline,
  Classes.Polygon,
  Classes.Path
], getMethodsFor('marker'))

extend(Classes.Text, getMethodsFor('Text'))
extend(Classes.Path, getMethodsFor('Path'))

extend(Classes.Defs, getMethodsFor('Defs'))

extend([
  Classes.Text,
  Classes.Tspan
], getMethodsFor('Tspan'))

extend([
  Classes.Rect,
  Classes.Ellipse,
  Classes.Circle,
  Classes.Gradient
], getMethodsFor('radius'))

const containerMethods = getMethodsFor('Container')
// FIXME: We need a container array
for (let i in containers) {
  extend(containers[i], containerMethods)
}

const elementMethods = getMethodsFor('Element')
for (let i in elements) {
  extend(elements[i], elementMethods)
  extend(elements[i], getConstructor('EventTarget'))
  extend(elements[i], getConstructor('Element'))
  extend(elements[i], getConstructor('Memory'))
}

// The main wrapping element
export default function SVG (element) {
  return makeInstance(element)
}

Object.assign(SVG, Classes)
Object.assign(SVG, tools)
Object.assign(SVG, adopter)
