/* globals describe, expect, it, spyOn, container */

import { Rect, Matrix, SVG } from '../../../../src/main.js'

describe('transform.js', () => {
  describe('untransform()', () => {
    it('returns itself', () => {
      const rect = new Rect()
      expect(rect.untransform()).toBe(rect)
    })

    it('deletes the transform attribute', () => {
      const rect = new Rect()
      expect(rect.untransform().attr('transform')).toBe(undefined)
    })
  })

  describe('matrixify()', () => {
    it('reduces all transformations of the transform list into one matrix - 1', () => {
      const rect = new Rect().attr('transform', 'matrix(1, 0, 1, 1, 0, 1)')
      expect(rect.matrixify()).toEqual(new Matrix(1, 0, 1, 1, 0, 1))
    })

    it('reduces all transformations of the transform list into one matrix - 2', () => {
      const rect = new Rect().attr('transform', 'translate(10, 20) rotate(45)')
      expect(rect.matrixify()).toEqual(
        new Matrix().rotate(45).translate(10, 20)
      )
    })

    it('reduces all transformations of the transform list into one matrix - 3', () => {
      const rect = new Rect().attr(
        'transform',
        'translate(10, 20) rotate(45) skew(1,2) skewX(10) skewY(20)'
      )
      expect(rect.matrixify()).toEqual(
        new Matrix().skewY(20).skewX(10).skew(1, 2).rotate(45).translate(10, 20)
      )
    })
  })

  describe('toParent()', () => {
    it('returns itself', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      const rect = g.rect(100, 100)
      expect(rect.toParent(canvas)).toBe(rect)
    })

    it('does nothing if the parent is the the current element', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      const parent = g.parent()
      const position = g.position()
      g.toParent(g)
      expect(g.parent()).toBe(parent)
      expect(g.position()).toBe(position)
    })

    it('moves an element to a different container without changing its visual representation - 1', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group().matrix(1, 0, 1, 1, 0, 1)
      const rect = g.rect(100, 100)
      rect.toParent(canvas)
      expect(rect.matrix()).toEqual(new Matrix(1, 0, 1, 1, 0, 1))
      expect(rect.parent()).toBe(canvas)
    })

    it('moves an element to a different container without changing its visual representation - 2', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group().translate(10, 20)
      const rect = g.rect(100, 100)
      const g2 = canvas.group().rotate(10)
      rect.toParent(g2)
      const actual = rect.matrix()
      const expected = new Matrix().translate(10, 20).rotate(-10)

      // funny enough the dom seems to shorten the floats and precision gets lost
      ;[...'abcdef'].forEach((prop) =>
        expect(actual[prop]).toBeCloseTo(expected[prop], 5)
      )
    })

    it('inserts the element at the specified position', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      const rect = g.rect(100, 100)
      canvas.rect(100, 100)
      canvas.rect(100, 100)
      expect(rect.toParent(canvas, 2).position()).toBe(2)
    })
  })

  describe('toRoot()', () => {
    it('calls toParent() with root node', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group().matrix(1, 0, 1, 1, 0, 1)
      const rect = g.rect(100, 100)
      const spy = spyOn(rect, 'toParent')
      rect.toRoot(3)
      expect(spy).toHaveBeenCalledWith(canvas, 3)
    })
  })

  describe('transform()', () => {
    it('acts as full getter with no argument', () => {
      const rect = new Rect().attr('transform', 'translate(10, 20) rotate(45)')
      const actual = rect.transform()
      const expected = new Matrix().rotate(45).translate(10, 20).decompose()

      expect(actual).toEqual(expected)
    })

    it('returns a single transformation value when string was passed', () => {
      const rect = new Rect().attr('transform', 'translate(10, 20) rotate(45)')
      expect(rect.transform('rotate')).toBe(45)
      expect(rect.transform('translateX')).toBe(10)
      expect(rect.transform('translateY')).toBe(20)
    })

    it('sets the transformation with an object', () => {
      const rect = new Rect().transform({ rotate: 45, translate: [10, 20] })
      expect(rect.transform('rotate')).toBe(45)
      expect(rect.transform('translateX')).toBe(10)
      expect(rect.transform('translateY')).toBe(20)
    })

    it('performs a relative transformation with flag=true', () => {
      const rect = new Rect()
        .transform({ rotate: 45, translate: [10, 20] })
        .transform({ rotate: 10 }, true)
      expect(rect.transform('rotate')).toBeCloseTo(55, 5) // rounding errors
      expect(rect.transform('translateX')).toBe(10)
      expect(rect.transform('translateY')).toBe(20)
    })

    it('performs a relative transformation with flag=other matrix', () => {
      const rect = new Rect()
        .transform({ rotate: 45, translate: [10, 20] })
        .transform({ rotate: 10 }, new Matrix().rotate(30))
      expect(rect.transform('rotate')).toBeCloseTo(40, 5) // rounding errors
      expect(rect.transform('translateX')).toBe(0)
      expect(rect.transform('translateY')).toBe(0)
    })

    it('performs a relative transformation with flag=other element', () => {
      const referenceElement = new Rect().transform({ rotate: 30 })
      const rect = new Rect()
        .transform({ rotate: 45, translate: [10, 20] })
        .transform({ rotate: 10 }, referenceElement)
      expect(rect.transform('rotate')).toBeCloseTo(40, 5) // rounding errors
      expect(rect.transform('translateX')).toBe(0)
      expect(rect.transform('translateY')).toBe(0)
    })
  })
})
