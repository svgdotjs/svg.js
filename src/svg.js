import * as svgMembers from './main.js'
import * as regex from './modules/core/regex.js'
import { makeInstance } from './utils/adopter'

// The main wrapping element
export default function SVG (element) {
  return makeInstance(element)
}

Object.assign(SVG, svgMembers)

SVG.utils = SVG
SVG.regex = regex
SVG.get = SVG
