/* globals describe, expect, it, jasmine */

import { Rect, G } from '../../../src/main.js'

const { any } = jasmine

describe('Rect.js', () => {
  describe('()', () => {
    it('creates a new object of type Rect', () => {
      expect(new Rect()).toEqual(any(Rect))
    })

    it('sets passed attributes on the element', () => {
      expect(new Rect({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('Container', () => {
    describe('rect()', () => {
      it('creates a rect with given size', () => {
        const group = new G()
        const rect = group.rect(100, 100)
        expect(rect.attr(['width', 'height'])).toEqual({
          width: 100,
          height: 100
        })
        expect(rect).toEqual(any(Rect))
      })
    })
  })
})
