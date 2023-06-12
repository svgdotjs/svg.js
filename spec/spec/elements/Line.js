/* globals describe, expect, it, beforeEach, spyOn, jasmine, container */

import { Line, PointArray, SVG, G } from '../../../src/main.js'

const { any, objectContaining } = jasmine

describe('Line.js', () => {
  let line

  beforeEach(() => {
    line = new Line()
  })

  describe('()', () => {
    it('creates a new object of type Line', () => {
      expect(new Line()).toEqual(any(Line))
    })

    it('sets passed attributes on the element', () => {
      expect(new Line({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('array()', () => {
    it('returns a PointArray containing the points of the line', () => {
      const array = line.plot(1, 2, 3, 4).array()
      expect(array).toEqual(any(PointArray))
      expect(array).toEqual([
        [1, 2],
        [3, 4]
      ])
    })
  })

  describe('move()', () => {
    it('returns itself', () => {
      expect(line.move(0, 0)).toBe(line)
    })

    it('moves the line along x and y axis', () => {
      const canvas = SVG().addTo(container)
      const line = canvas.line(1, 2, 3, 4)
      line.move(50, 50)
      expect(line.bbox()).toEqual(
        objectContaining({
          x: 50,
          y: 50,
          width: 2,
          height: 2
        })
      )
    })
  })

  describe('plot()', () => {
    it('relays to array() as getter', () => {
      const spy = spyOn(line, 'array')
      line.plot()
      expect(spy).toHaveBeenCalled()
    })

    it('calls attr with line attributes when 4 parameters given', () => {
      const spy = spyOn(line, 'attr')
      line.plot(1, 2, 3, 4)
      expect(spy).toHaveBeenCalledWith({ x1: 1, y1: 2, x2: 3, y2: 4 })
    })

    it('calls attr with line attributes when string given', () => {
      const spy = spyOn(line, 'attr')
      line.plot('1, 2, 3, 4')
      expect(spy).toHaveBeenCalledWith({ x1: 1, y1: 2, x2: 3, y2: 4 })
    })

    it('calls attr with line attributes when array given', () => {
      const spy = spyOn(line, 'attr')
      line.plot([1, 2, 3, 4])
      expect(spy).toHaveBeenCalledWith({ x1: 1, y1: 2, x2: 3, y2: 4 })
    })

    it('calls attr with line attributes when multi array given', () => {
      const spy = spyOn(line, 'attr')
      line.plot([
        [1, 2],
        [3, 4]
      ])
      expect(spy).toHaveBeenCalledWith({ x1: 1, y1: 2, x2: 3, y2: 4 })
    })

    it('calls attr with line attributes when PointArray given', () => {
      const spy = spyOn(line, 'attr')
      line.plot(
        new PointArray([
          [1, 2],
          [3, 4]
        ])
      )
      expect(spy).toHaveBeenCalledWith({ x1: 1, y1: 2, x2: 3, y2: 4 })
    })
  })

  describe('size()', () => {
    it('returns itself', () => {
      expect(line.size(50, 50)).toBe(line)
    })

    it('sets the size of the line', () => {
      const canvas = SVG().addTo(container)
      const line = canvas.line(1, 2, 3, 4)
      line.size(50, 50)
      expect(line.bbox()).toEqual(
        objectContaining({
          width: 50,
          height: 50,
          x: 1,
          y: 2
        })
      )
    })

    it('changes height proportionally', () => {
      const canvas = SVG().addTo(container)
      const line = canvas.line(1, 2, 3, 4)
      line.size(50, null)
      expect(line.bbox()).toEqual(
        objectContaining({
          width: 50,
          height: 50,
          x: 1,
          y: 2
        })
      )
    })

    it('changes width proportionally', () => {
      const canvas = SVG().addTo(container)
      const line = canvas.line(1, 2, 3, 4)
      line.size(null, 50)
      expect(line.bbox()).toEqual(
        objectContaining({
          width: 50,
          height: 50,
          x: 1,
          y: 2
        })
      )
    })
  })

  describe('Container', () => {
    describe('line()', () => {
      it('creates a line with given points', () => {
        const group = new G()
        const line = group.line(1, 2, 3, 4)
        expect(line.array()).toEqual([
          [1, 2],
          [3, 4]
        ])
        expect(line).toEqual(any(Line))
      })

      it('defaults to zero line', () => {
        const group = new G()
        const line = group.line()
        expect(line.array()).toEqual([
          [0, 0],
          [0, 0]
        ])
        expect(line).toEqual(any(Line))
      })
    })
  })
})
