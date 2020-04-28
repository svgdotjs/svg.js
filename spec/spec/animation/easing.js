/* globals describe, expect, it */

import { easing } from '../../../src/main.js'

describe('easing', () => {
  var easedValues = {
    '-': 0.5,
    '<>': 0.5,
    '>': 0.7071,
    '<': 0.2929
  }

  ;[ '-', '<>', '<', '>' ].forEach((el) => {
    describe(el, () => {
      it('is 0 at 0', () => {
        expect(easing[el](0)).toBe(0)
      })
      it('is 1 at 1', () => {
        expect(Math.round(easing[el](1) * 1000) / 1000).toBe(1) // we need to round cause for some reason at some point 1==0.999999999
      })
      it('is eased at 0.5', () => {
        expect(easing[el](0.5)).toBeCloseTo(easedValues[el])
      })
    })
  })
})
