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
import './data.js'
import find from './selector.js'
import './css.js'
import './transform.js'
import './memory.js'
import './sugar.js'
import {getMethodsFor, getConstructor} from './methods.js'
import {registerMorphableType, makeMorphable} from './Morphable.js'
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
const eventTargetMethods = getMethodsFor('EventTarget')
for (let i in elements) {
  extend(elements[i], elementMethods)
  extend(elements[i], eventTargetMethods)
  extend(elements[i], getConstructor('EventTarget'))
  extend(elements[i], getConstructor('Element'))
  extend(elements[i], getConstructor('Memory'))
}

registerMorphableType([
  Classes.SVGNumber,
  Classes.Color,
  Classes.Box,
  Classes.Matrix,
  Classes.SVGArray,
  Classes.PointArray,
  Classes.PathArray
])

makeMorphable()

// The main wrapping element
export default function SVG (element) {
  return makeInstance(element)
}

Object.assign(SVG, Classes)
Object.assign(SVG, tools)
Object.assign(SVG, adopter)

import * as utils from './utils.js'
SVG.utils = utils

import * as regex from './regex.js'
SVG.regex = regex




// satisfy tests, fix later
import * as ns from './namespaces'
SVG.get = SVG
SVG.find = find
Object.assign(SVG, ns)
import Base from './Base.js'
SVG.Element = SVG.Parent = SVG.Shape = SVG.Container = Base
import {easing} from './Controller.js'
SVG.easing = easing
import * as events from './event.js'
Object.assign(SVG, events)
import {TransformBag, ObjectBag, NonMorphable} from './Morphable.js'
SVG.TransformBag = TransformBag
SVG.ObjectBag = ObjectBag
SVG.NonMorphable = NonMorphable
import parser from './parser.js'
SVG.parser = parser
