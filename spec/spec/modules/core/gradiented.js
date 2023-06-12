/* globals describe, expect, it */

import { Gradient } from '../../../../src/main.js'

describe('gradiented.js', () => {
  describe('from()', () => {
    it('sets fx and fy for radial gradients and returns itself', () => {
      const gradient = new Gradient('radial')
      expect(gradient.from(10, 20)).toBe(gradient)
      expect(gradient.attr('fx')).toBe(10)
      expect(gradient.attr('fy')).toBe(20)
    })

    it('sets x1 and y1 for linear gradients and returns itself', () => {
      const gradient = new Gradient('linear')
      expect(gradient.from(10, 20)).toBe(gradient)
      expect(gradient.attr('x1')).toBe(10)
      expect(gradient.attr('y1')).toBe(20)
    })
  })

  describe('to()', () => {
    it('sets cx and cy for radial gradients and returns itself', () => {
      const gradient = new Gradient('radial')
      expect(gradient.to(10, 20)).toBe(gradient)
      expect(gradient.attr('cx')).toBe(10)
      expect(gradient.attr('cy')).toBe(20)
    })

    it('sets x2 and y2 for linear gradients and returns itself', () => {
      const gradient = new Gradient('linear')
      expect(gradient.to(10, 20)).toBe(gradient)
      expect(gradient.attr('x2')).toBe(10)
      expect(gradient.attr('y2')).toBe(20)
    })
  })
})
