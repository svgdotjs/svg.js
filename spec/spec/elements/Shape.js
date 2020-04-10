/* globals describe, expect, it, jasmine */

import { Shape, create } from '../../../src/main.js'

const { any } = jasmine

describe('Rect.js', () => {
  describe('()', () => {
    it('creates a new object of type Shape', () => {
      expect(new Shape(create('rect'))).toEqual(any(Shape))
    })

    it('sets passed attributes on the element', () => {
      expect(new Shape(create('rect'), { id: 'foo' }).id()).toBe('foo')
    })
  })
})
