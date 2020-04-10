/* globals describe, expect, it, beforeEach, spyOn, jasmine */

import { Circle, G } from '../../../src/main.js'

const { any, objectContaining } = jasmine

describe('Circle.js', () => {
  let circle

  beforeEach(() => {
    circle = new Circle()
  })

  describe('()', () => {
    it('creates a new object of type Circle', () => {
      expect(new Circle()).toEqual(any(Circle))
    })

    it('sets passed attributes on the element', () => {
      expect(new Circle({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('radius()', () => {
    it('calls attr with r', () => {
      const spy = spyOn(circle, 'attr').and.callThrough()
      circle.radius(123)
      expect(spy).toHaveBeenCalledWith('r', 123)
    })
  })

  describe('rx()', () => {
    it('calls attr with r', () => {
      const spy = spyOn(circle, 'attr')
      circle.rx(123)
      expect(spy).toHaveBeenCalledWith('r', 123)
    })
  })

  describe('ry()', () => {
    it('calls rx', () => {
      const spy = spyOn(circle, 'rx')
      circle.ry(123)
      expect(spy).toHaveBeenCalledWith(123)
    })
  })

  describe('size()', () => {
    it('calls radius with half of the size', () => {
      const spy = spyOn(circle, 'radius')
      circle.size(100)
      expect(spy).toHaveBeenCalledWith(objectContaining({ value: 50 }))
    })
  })

  describe('Container', () => {
    describe('circle()', () => {
      it('creates a circle with given size', () => {
        const group = new G()
        const circle = group.circle(50)
        expect(circle.attr('r')).toBe(25)
        expect(circle).toEqual(any(Circle))
      })

      it('defaults to zero size', () => {
        const group = new G()
        const circle = group.circle()
        expect(circle.attr('r')).toBe(0)
        expect(circle).toEqual(any(Circle))
      })
    })
  })
})
