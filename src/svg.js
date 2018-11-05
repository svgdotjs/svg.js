import * as Classes from './classes.js'
import * as adopter from './adopter.js'
import * as tools from './tools.js'
import './attr.js'
import './arrange.js'
import './data.js'
import './classHandling.js'
import find from './selector.js'
import './css.js'
import './transform.js'
import './memory.js'
import './sugar.js'
import { getMethodsFor } from './methods.js'
import { registerMorphableType, makeMorphable, TransformBag, ObjectBag, NonMorphable } from './Morphable.js'

import './EventTarget.js'
import './Element.js'

import * as utils from './utils.js'

import * as regex from './regex.js'

// satisfy tests, fix later
import * as ns from './namespaces.js'
import { easing } from './Controller.js'
import * as events from './event.js'
import parser from './parser.js'
import * as defaults from './defaults.js'
const extend = tools.extend

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

extend(Classes.EventTarget, getMethodsFor('EventTarget'))
extend(Classes.Dom, getMethodsFor('Dom'))
extend(Classes.Element, getMethodsFor('Element'))
extend(Classes.Shape, getMethodsFor('Shape'))
// extend(Classes.Element, getConstructor('Memory'))
extend(Classes.Container, getMethodsFor('Container'))

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
  return adopter.makeInstance(element)
}

Object.assign(SVG, Classes)
Object.assign(SVG, tools)
Object.assign(SVG, adopter)
SVG.utils = utils
SVG.regex = regex
SVG.get = SVG
SVG.find = find
Object.assign(SVG, ns)
SVG.easing = easing
Object.assign(SVG, events)
SVG.TransformBag = TransformBag
SVG.ObjectBag = ObjectBag
SVG.NonMorphable = NonMorphable
SVG.parser = parser
SVG.defaults = defaults
