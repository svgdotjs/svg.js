/* globals describe, expect, it, spyOn, jasmine, container */

import { Ellipse, SVG, G } from '../../../src/main.js'

const { any, objectContaining } = jasmine

describe('Ellipse.js', () => {
  describe('()', () => {
    it('creates a new object of type Ellipse', () => {
      expect(new Ellipse()).toEqual(any(Ellipse))
    })

    it('sets passed attributes on the element', () => {
      expect(new Ellipse({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('size()', () => {
    it('calls rx and ry with passed parameters and returns itself', () => {
      const ellipse = new Ellipse()
      const spyrx = spyOn(ellipse, 'rx').and.callThrough()
      const spyry = spyOn(ellipse, 'ry').and.callThrough()
      expect(ellipse.size(4, 2)).toBe(ellipse)
      expect(spyrx).toHaveBeenCalledWith(objectContaining({ value: 2 }))
      expect(spyry).toHaveBeenCalledWith(objectContaining({ value: 1 }))
    })

    it('changes ry proportionally if null', () => {
      const canvas = SVG().addTo(container)
      const ellipse = canvas.ellipse(100, 100)
      const spyrx = spyOn(ellipse, 'rx').and.callThrough()
      const spyry = spyOn(ellipse, 'ry').and.callThrough()
      expect(ellipse.size(200, null)).toBe(ellipse)
      expect(spyrx).toHaveBeenCalledWith(objectContaining({ value: 100 }))
      expect(spyry).toHaveBeenCalledWith(objectContaining({ value: 100 }))
    })

    it('changes rx proportionally if null', () => {
      const canvas = SVG().addTo(container)
      const ellipse = canvas.ellipse(100, 100)
      const spyrx = spyOn(ellipse, 'rx').and.callThrough()
      const spyry = spyOn(ellipse, 'ry').and.callThrough()
      expect(ellipse.size(null, 200)).toBe(ellipse)
      expect(spyrx).toHaveBeenCalledWith(objectContaining({ value: 100 }))
      expect(spyry).toHaveBeenCalledWith(objectContaining({ value: 100 }))
    })
  })

  describe('Container', () => {
    describe('ellipse()', () => {
      it('creates a ellipse with given size', () => {
        const group = new G()
        const ellipse = group.ellipse(50, 50)
        expect(ellipse.attr('rx')).toBe(25)
        expect(ellipse.attr('ry')).toBe(25)
        expect(ellipse).toEqual(any(Ellipse))
      })

      it('defaults to same radius with one argument', () => {
        const group = new G()
        const ellipse = group.ellipse(50)
        expect(ellipse.attr('rx')).toBe(25)
        expect(ellipse.attr('ry')).toBe(25)
        expect(ellipse).toEqual(any(Ellipse))
      })

      it('defaults to zero radius with no argument', () => {
        const group = new G()
        const ellipse = group.ellipse()
        expect(ellipse.attr('rx')).toBe(0)
        expect(ellipse.attr('ry')).toBe(0)
        expect(ellipse).toEqual(any(Ellipse))
      })
    })
  })
})
