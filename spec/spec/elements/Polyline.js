/* globals describe, expect, it, jasmine */

import { Polyline, G } from '../../../src/main.js'

const { any } = jasmine

describe('Polyline.js', () => {
  describe('()', () => {
    it('creates a new object of type Polyline', () => {
      expect(new Polyline()).toEqual(any(Polyline))
    })

    it('sets passed attributes on the element', () => {
      expect(new Polyline({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('Container', () => {
    describe('polyline()', () => {
      it('creates a polyline with given points', () => {
        const group = new G()
        const polyline = group.polyline([1, 2, 3, 4])
        expect(polyline.array()).toEqual([
          [1, 2],
          [3, 4]
        ])
        expect(polyline).toEqual(any(Polyline))
      })

      it('creates a polyline with one point by default', () => {
        const group = new G()
        const polyline = group.polyline()
        expect(polyline.array()).toEqual([[0, 0]])
        expect(polyline).toEqual(any(Polyline))
      })
    })
  })
})
