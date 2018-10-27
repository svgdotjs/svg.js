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
import * as arrange from './arrange.js'
import {select} from './selector.js'
import * as css from './css.js'
import * as transform from './transform.js'
const extend = tools.extend

import * as EventTarget from './EventTarget.js'
import * as Element from './Element.js'
import * as Parent from './Parent.js'

extend([
  Classes.Doc,
  Classes.Symbol,
  Classes.Image,
  Classes.Pattern,
  Classes.Marker
], {viewbox: Classes.Box.constructors.viewbox})

extend([Classes.Line, Classes.Polyline, Classes.Polygon, Classes.Path], {
  ...Classes.Marker.constructors.marker
})

extend(Classes.Text, Classes.TextPath.constructors.Text)
extend(Classes.Path, Classes.TextPath.constructors.Path)

extend(Classes.Defs, {
  ...Classes.Gradient.constructors.Defs,
  ...Classes.Marker.constructors.Defs,
  ...Classes.Pattern.constructors.Defs,
})

for (let i in containers) {
  extend(containers[i], {
    ...Classes.A.constructors.Container,
    ...Classes.ClipPath.constructors.Container,
    ...Classes.G.constructors.Container,
    ...Classes.Gradient.constructors.Container,
    ...Classes.Line.constructors.Container,
    ...Classes.Marker.constructors.Container,
    ...Classes.Mask.constructors.Container,
    ...Classes.Path.constructors.Container,
    ...Classes.Pattern.constructors.Container,
    ...Classes.Polygon.constructors.Container,
    ...Classes.Polyline.constructors.Container,
    ...Classes.Rect.constructors.Container,
    select,
    ...Classes.Symbol.constructors.Container,
    ...Classes.Text.constructors.Container,
    ...Classes.TextPath.constructors.Container,
    ...Classes.Use.constructors.Container,
  })
}

for (let i in elements) {
  extend(elements[i], {
    ...EventTarget,
    ...Element,
    ...Parent,
    ...arrange,
    ...Classes.A.constructors.Element,
    ...Classes.Box.constructors.Element,
    ...Classes.Circle.constructors.Element,
    ...Classes.ClipPath.constructors.Element,
    ...css,
    ...Classes.Image.constructors.Element,
    ...Classes.Mask.constructors.Element,
    ...Classes.Matrix.constructors.Element,
    ...Classes.Point.constructors.Element,
    ...Classes.Runner.constructors.Element,
    ...Classes.Timeline.constructors.Element,
    ...transform,
  })
}



// The main wrapping element
export default function SVG (element) {
  return makeInstance(element)
}

Object.assign(SVG, Classes)
Object.assign(SVG, tools)
Object.assign(SVG, adopter)
