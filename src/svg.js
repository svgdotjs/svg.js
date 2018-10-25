import {makeInstance} from './helpers.js'
import * as Classes from './classes.js'
import * as tools from './tools.js'

// The main wrapping element
export default function SVG (element) {
  return makeInstance(element)
}

Object.assign(SVG, Classes)
Object.assign(SVG, tools)
