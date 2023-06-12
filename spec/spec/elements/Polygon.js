/* globals describe, expect, it, jasmine */

import { Polygon, G } from '../../../src/main.js'

const { any } = jasmine

describe('Polygon.js', () => {
  describe('()', () => {
    it('creates a new object of type Polygon', () => {
      expect(new Polygon()).toEqual(any(Polygon))
    })

    it('sets passed attributes on the element', () => {
      expect(new Polygon({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('Container', () => {
    describe('polygon()', () => {
      it('creates a polygon with given points', () => {
        const group = new G()
        const polygon = group.polygon([1, 2, 3, 4])
        expect(polygon.array()).toEqual([
          [1, 2],
          [3, 4]
        ])
        expect(polygon).toEqual(any(Polygon))
      })
    })

    it('creates a polygon with one point by default', () => {
      const group = new G()
      const polygon = group.polygon()
      expect(polygon.array()).toEqual([[0, 0]])
      expect(polygon).toEqual(any(Polygon))
    })
  })
})
