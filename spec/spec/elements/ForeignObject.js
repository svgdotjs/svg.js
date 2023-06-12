/* globals describe, expect, it, jasmine */

import { makeInstance, ForeignObject } from '../../../src/main.js'

const { any } = jasmine

describe('ForeignObject.js', () => {
  describe('()', () => {
    it('creates a new object of type ForeignObject', () => {
      expect(new ForeignObject()).toEqual(any(ForeignObject))
    })

    it('sets passed attributes on the element', () => {
      expect(new ForeignObject({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('Container', () => {
    describe('foreignObject()', () => {
      it('creates a foreignObject in the container', () => {
        const canvas = makeInstance().addTo('#canvas')
        const foreignObject = canvas.foreignObject()
        expect(foreignObject).toEqual(any(ForeignObject))
        expect(foreignObject.parent()).toBe(canvas)
      })

      it('sets width and height correctly on construction', () => {
        const canvas = makeInstance().addTo('#canvas')
        const foreignObject = canvas.foreignObject(100, 200)
        expect(foreignObject.width()).toBe(100)
        expect(foreignObject.height()).toBe(200)
      })
    })
  })

  describe('Element methods', () => {
    it('is usable with Elements methods such as height() and width()', () => {
      const canvas = makeInstance().addTo('#canvas')
      const foreignObject = canvas.foreignObject()
      foreignObject.width(100).height(200).x(10).y(20)
      expect(foreignObject.width()).toBe(100)
      expect(foreignObject.height()).toBe(200)
      expect(foreignObject.x()).toBe(10)
      expect(foreignObject.y()).toBe(20)
    })
  })
})
