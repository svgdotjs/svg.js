/* globals fullHex, compToHex */

/*

Color {
  constructor (a, b, c, space) {
    space: 'hsl'
    a: 30
    b: 20
    c: 10
  },

  toRgb () { return new Color in rgb space }
  toHsl () { return new Color in hsl space }
  toLab () { return new Color in lab space }

  toArray () { [space, a, b, c] }
  fromArray () { convert it back }
}

// Conversions aren't always exact because of monitor profiles etc...
new Color(h, s, l, 'hsl') !== new Color(r, g, b).hsl()
new Color(100, 100, 100, [space])
new Color('hsl(30, 20, 10)')

// Sugar
SVG.rgb(30, 20, 50).lab()
SVG.hsl()
SVG.lab('rgb(100, 100, 100)')
*/

import {isHex, isRgb, whitespace, rgb} from './regex.js'

export default class Color {
  constructor (color, g, b) {
    let match

    // initialize defaults
    this.r = 0
    this.g = 0
    this.b = 0

    if (!color) return

    // parse color
    if (typeof color === 'string') {
      if (isRgb.test(color)) {
        // get rgb values
        match = rgb.exec(color.replace(whitespace, ''))

        // parse numeric values
        this.r = parseInt(match[1])
        this.g = parseInt(match[2])
        this.b = parseInt(match[3])
      } else if (isHex.test(color)) {
        // get hex values
        match = hex.exec(fullHex(color))

        // parse numeric values
        this.r = parseInt(match[1], 16)
        this.g = parseInt(match[2], 16)
        this.b = parseInt(match[3], 16)
      }
    } else if (Array.isArray(color)) {
      this.r = color[0]
      this.g = color[1]
      this.b = color[2]
    } else if (typeof color === 'object') {
      this.r = color.r
      this.g = color.g
      this.b = color.b
    } else if (arguments.length === 3) {
      this.r = color
      this.g = g
      this.b = b
    }
  }

  // Default to hex conversion
  toString () {
    return this.toHex()
  }

  toArray () {
    return [this.r, this.g, this.b]
  }

  // Build hex value
  toHex () {
    return '#' +
      compToHex(Math.round(this.r)) +
      compToHex(Math.round(this.g)) +
      compToHex(Math.round(this.b))
  }

  // Build rgb value
  toRgb () {
    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
  }

  // Calculate true brightness
  brightness () {
    return (this.r / 255 * 0.30) +
      (this.g / 255 * 0.59) +
      (this.b / 255 * 0.11)
  }

  // Testers

  // Test if given value is a color string
  static test (color) {
    color += ''
    return isHex.test(color) || isRgb.test(color)
  }

  // Test if given value is a rgb object
  static isRgb (color) {
    return color && typeof color.r === 'number' &&
      typeof color.g === 'number' &&
      typeof color.b === 'number'
  }

  // Test if given value is a color
  static isColor (color) {
    return this.isRgb(color) || this.test(color)
  }
}
