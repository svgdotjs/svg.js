/* globals describe, expect, beforeEach, it, spyOn, jasmine, container */

import { Polygon, SVG, PointArray } from '../../../../src/main.js'

const { any, objectContaining } = jasmine

describe('Polygon.js', () => {
  let poly

  beforeEach(() => {
    poly = new Polygon()
  })

  describe('array()', () => {
    it('returns the underlying PointArray', () => {
      const array = poly.plot('1 2 3 4').array()
      expect(array).toEqual(any(PointArray))
      expect(array).toEqual([
        [1, 2],
        [3, 4]
      ])
    })
  })

  describe('clear()', () => {
    it('clears the array cache and returns itself', () => {
      const array = poly.plot('1 2 3 4').array()
      expect(poly.clear()).toBe(poly)
      expect(array).not.toBe(poly._array)
    })
  })

  describe('move()', () => {
    it('returns itself', () => {
      expect(poly.move(0, 0)).toBe(poly)
    })

    it('moves the poly along x and y axis', () => {
      const canvas = SVG().addTo(container)
      const poly = canvas.polygon('0 0 50 50')
      poly.move(50, 50)
      expect(poly.bbox()).toEqual(
        objectContaining({
          x: 50,
          y: 50,
          width: 50,
          height: 50
        })
      )
    })
  })

  describe('plot()', () => {
    it('relays to array() as getter', () => {
      const spy = spyOn(poly, 'array')
      poly.plot()
      expect(spy).toHaveBeenCalled()
    })

    it('works by passing a string', () => {
      const spy = spyOn(poly, 'attr')
      poly.plot('1 2 3 4')
      expect(spy).toHaveBeenCalledWith('points', '1 2 3 4')
    })

    it('works with flat array', () => {
      const spy = spyOn(poly, 'attr')
      poly.plot([1, 2, 3, 4])
      expect(spy).toHaveBeenCalledWith('points', [
        [1, 2],
        [3, 4]
      ])
    })

    it('works with multi array', () => {
      const spy = spyOn(poly, 'attr')
      poly.plot([
        [1, 2],
        [3, 4]
      ])
      expect(spy).toHaveBeenCalledWith('points', [
        [1, 2],
        [3, 4]
      ])
    })

    it('works with PointArray', () => {
      const spy = spyOn(poly, 'attr')
      poly.plot(
        new PointArray([
          [1, 2],
          [3, 4]
        ])
      )
      expect(spy).toHaveBeenCalledWith('points', [
        [1, 2],
        [3, 4]
      ])
    })
  })

  describe('size()', () => {
    it('returns itself', () => {
      expect(poly.size(50, 50)).toBe(poly)
    })

    it('sets the size of the poly', () => {
      const canvas = SVG().addTo(container)
      const poly = canvas.polygon('0 0 50 50')
      poly.size(100, 100)
      expect(poly.bbox()).toEqual(
        objectContaining({
          width: 100,
          height: 100,
          x: 0,
          y: 0
        })
      )
    })

    it('changes height proportionally', () => {
      const canvas = SVG().addTo(container)
      const poly = canvas.polygon('0 0 50 50')
      poly.size(100, null)
      expect(poly.bbox()).toEqual(
        objectContaining({
          width: 100,
          height: 100,
          x: 0,
          y: 0
        })
      )
    })

    it('changes width proportionally', () => {
      const canvas = SVG().addTo(container)
      const poly = canvas.polygon('0 0 50 50')
      poly.size(null, 100)
      expect(poly.bbox()).toEqual(
        objectContaining({
          width: 100,
          height: 100,
          x: 0,
          y: 0
        })
      )
    })
  })
})
