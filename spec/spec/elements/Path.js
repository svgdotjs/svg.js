/* globals describe, expect, beforeEach, it, spyOn, jasmine, container */

import { Path, SVG, PathArray } from '../../../src/main.js'

const { any, objectContaining } = jasmine

describe('Path.js', () => {
  let path

  beforeEach(() => {
    path = new Path()
  })

  describe('()', () => {
    it('creates a new object of type Path', () => {
      expect(new Path()).toEqual(any(Path))
    })

    it('sets passed attributes on the element', () => {
      expect(new Path({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('array()', () => {
    it('returns the underlying PathArray', () => {
      const array = path.plot('M1 2 3 4').array()
      expect(array).toEqual(any(PathArray))
      expect(array).toEqual([
        ['M', 1, 2],
        ['L', 3, 4]
      ])
    })
  })

  describe('clear()', () => {
    it('clears the array cache and returns itself', () => {
      const array = path.plot('M1 2 3 4').array()
      expect(path.clear()).toBe(path)
      expect(array).not.toBe(path._array)
    })
  })

  describe('height()', () => {
    it('gets the height of the path', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M0 0 50, 50')
      expect(path.height()).toBe(50)
    })

    it('sets the height of the path and returns itself', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M0 0 50, 50')
      expect(path.height(100)).toBe(path)
      expect(path.height()).toBe(100)
    })
  })

  describe('move()', () => {
    it('returns itself', () => {
      expect(path.move(0, 0)).toBe(path)
    })

    it('moves the path along x and y axis', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M0 0 50, 50')
      path.move(50, 50)
      expect(path.bbox()).toEqual(
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
      const spy = spyOn(path, 'array')
      path.plot()
      expect(spy).toHaveBeenCalled()
    })

    it('works by passing a string', () => {
      const spy = spyOn(path, 'attr')
      path.plot('M0 0 50 50')
      expect(spy).toHaveBeenCalledWith('d', 'M0 0 50 50')
    })

    it('works with flat array', () => {
      const spy = spyOn(path, 'attr')
      path.plot(['M', 0, 0, 'L', 50, 50])
      expect(spy).toHaveBeenCalledWith('d', [
        ['M', 0, 0],
        ['L', 50, 50]
      ])
    })

    it('works with multi array', () => {
      const spy = spyOn(path, 'attr')
      path.plot([
        ['M', 0, 0],
        ['L', 50, 50]
      ])
      expect(spy).toHaveBeenCalledWith('d', [
        ['M', 0, 0],
        ['L', 50, 50]
      ])
    })

    it('works with PathArray', () => {
      const spy = spyOn(path, 'attr')
      path.plot(
        new PathArray([
          ['M', 0, 0],
          ['L', 50, 50]
        ])
      )
      expect(spy).toHaveBeenCalledWith('d', [
        ['M', 0, 0],
        ['L', 50, 50]
      ])
    })
  })

  describe('size()', () => {
    it('returns itself', () => {
      expect(path.size(50, 50)).toBe(path)
    })

    it('sets the size of the path', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M0 0 50, 50')
      path.size(100, 100)
      expect(path.bbox()).toEqual(
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
      const path = canvas.path('M0 0 50, 50')
      path.size(100, null)
      expect(path.bbox()).toEqual(
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
      const path = canvas.path('M0 0 50, 50')
      path.size(null, 100)
      expect(path.bbox()).toEqual(
        objectContaining({
          width: 100,
          height: 100,
          x: 0,
          y: 0
        })
      )
    })
  })

  describe('width()', () => {
    it('gets the width of the path', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M0 0 50, 50')
      expect(path.width()).toBe(50)
    })

    it('sets the width of the path and returns itself', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M0 0 50, 50')
      expect(path.width(100)).toBe(path)
      expect(path.width()).toBe(100)
    })
  })

  describe('x()', () => {
    it('gets the x position of the path', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M10 10 50, 50')
      expect(path.x()).toBe(10)
    })

    it('sets the x position of the path and returns itself', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M0 0 50, 50')
      expect(path.x(100)).toBe(path)
      expect(path.x()).toBe(100)
    })
  })

  describe('y()', () => {
    it('gets the y position of the path', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M10 10 50, 50')
      expect(path.y()).toBe(10)
    })

    it('sets the y position of the path and returns itself', () => {
      const canvas = SVG().addTo(container)
      const path = canvas.path('M0 0 50, 50')
      expect(path.y(100)).toBe(path)
      expect(path.y()).toBe(100)
    })
  })
})
