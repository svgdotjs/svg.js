/* globals describe, expect, it, jasmine, spyOn, container */

import { Box, create, Element, G, Rect, SVG } from '../../../../src/main.js'

const { any, objectContaining } = jasmine

describe('containerGeometry.js', () => {
  describe('dmove()', () => {
    it('moves the bbox of the group by a certain amount (1)', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()

      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.dmove(10, 10)

      const box = g.bbox()
      expect(box).toEqual(
        objectContaining({
          x: 20,
          y: 30,
          width: box.width,
          height: box.height
        })
      )
    })

    it('moves the bbox of the group by a certain amount (2)', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()

      g.rect(400, 200).move(123, 312).rotate(34).skew(12)
      g.rect(100, 50).move(11, 43).translate(123, 32).skew(-12)
      g.rect(400, 200).rotate(90)
      g.group().rotate(23).group().skew(32).rect(100, 40).skew(11).rotate(12)

      const oldBox = g.bbox()

      g.dmove(10, 10)

      const newBox = g.bbox()

      expect(newBox.x).toBeCloseTo(oldBox.x + 10, 4)
      expect(newBox.y).toBeCloseTo(oldBox.y + 10, 4)
      expect(newBox.w).toBeCloseTo(oldBox.w, 4)
      expect(newBox.h).toBeCloseTo(oldBox.h, 4)
    })

    it('it does not fail when hitting elements without bbox', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()

      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))
      g.add(new Element(create('title')))

      const fn = () => g.dmove(10, 10)
      expect(fn).not.toThrowError()

      const box = g.bbox()
      expect(box).toEqual(
        objectContaining({
          x: 20,
          y: 30,
          width: box.width,
          height: box.height
        })
      )
    })
  })

  describe('dx()', () => {
    it('calls dmove with dy=0 and returns itself', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      const spy = spyOn(g, 'dmove').and.callThrough()
      expect(g.dx(10)).toBe(g)
      expect(spy).toHaveBeenCalledWith(10, 0)
    })
  })

  describe('dy()', () => {
    it('calls dmove with dx=0 and returns itself', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      const spy = spyOn(g, 'dmove').and.callThrough()
      expect(g.dy(10)).toBe(g)
      expect(spy).toHaveBeenCalledWith(0, 10)
    })
  })

  describe('move()', () => {
    it('calls dmove() with the correct difference', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      g.rect(100, 200).move(111, 223)

      spyOn(g, 'dmove')

      g.move(100, 150)
      expect(g.dmove).toHaveBeenCalledWith(-11, -73)
    })

    it('defaults to x=0 and y=0', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      g.rect(100, 200).move(111, 223)

      spyOn(g, 'dmove')

      g.move()
      expect(g.dmove).toHaveBeenCalledWith(-111, -223)
    })
  })

  describe('x()', () => {
    it('gets the x value of the bbox', () => {
      const canvas = SVG().addTo(container)

      const g = new G()
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.addTo(canvas)

      expect(g.x()).toBe(g.bbox().x)
      expect(g.x()).toBe(10)
    })
    it('calls move with the parameter as x', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      g.rect(100, 200).move(111, 223)

      spyOn(g, 'move')

      g.x(100)
      expect(g.move).toHaveBeenCalledWith(100, g.bbox().y, any(Box))
    })
  })

  describe('y()', () => {
    it('gets the y value of the bbox', () => {
      const canvas = SVG().addTo(container)

      const g = new G()
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.addTo(canvas)

      expect(g.y()).toBe(g.bbox().y)
      expect(g.y()).toBe(20)
    })

    it('calls move with the parameter as y', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()
      g.rect(100, 200).move(111, 223)

      spyOn(g, 'move')

      g.y(100)
      expect(g.move).toHaveBeenCalledWith(g.bbox().x, 100, any(Box))
    })
  })

  describe('size()', () => {
    it('changes the dimensions of the bbox (1)', () => {
      const canvas = SVG().addTo(container)

      const g = new G()
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.addTo(canvas)

      const oldBox = g.bbox()

      expect(g.size(100, 100)).toBe(g)

      const newBox = g.bbox()

      expect(newBox.x).toBeCloseTo(oldBox.x, 4)
      expect(newBox.y).toBeCloseTo(oldBox.y, 4)
      expect(newBox.w).toBeCloseTo(100, 4)
      expect(newBox.h).toBeCloseTo(100, 4)

      const rbox1 = g.children()[0].rbox()
      const rbox2 = g.children()[1].rbox()

      expect(rbox1.width).toBeCloseTo(90.9, 1)
      expect(Math.floor(rbox2.width * 10) / 10).toBeCloseTo(63.6, 1) // Browsers have different opinion on this one (chrome: 63.6, ff: 63.7)

      expect(rbox1.x).toBeCloseTo(10, 1)
      expect(rbox2.x).toBeCloseTo(46.4, 1)
      expect(rbox1.height).toBeCloseTo(85.7, 1)
      expect(rbox2.height).toBeCloseTo(71.4, 1)
      expect(rbox1.y).toBeCloseTo(20, 1)
      expect(rbox2.y).toBeCloseTo(48.6, 1)
    })

    it('changes the dimensions of the bbox (2)', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group()

      g.rect(400, 200).move(123, 312).rotate(34).skew(12)
      g.rect(100, 50).move(11, 43).translate(123, 32).skew(-12)
      g.rect(400, 200).rotate(90)
      g.group().rotate(23).group().skew(32).rect(100, 40).skew(11).rotate(12)

      const oldBox = g.bbox()

      g.size(100, 100)

      const newBox = g.bbox()

      expect(newBox.x).toBeCloseTo(oldBox.x, 4)
      expect(newBox.y).toBeCloseTo(oldBox.y, 4)
      expect(newBox.w).toBeCloseTo(100, 4)
      expect(newBox.h).toBeCloseTo(100, 4)
    })
  })

  describe('width()', () => {
    it('gets the width value of the bbox', () => {
      const canvas = SVG().addTo(container)

      const g = new G()
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.addTo(canvas)

      expect(g.width()).toBe(g.bbox().width)
      expect(g.width()).toBe(110)
    })
    it('sets the width value of the bbox by moving all children', () => {
      const canvas = SVG().addTo(container)

      const g = new G()
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.addTo(canvas)

      expect(g.width(100)).toBe(g)
      expect(g.bbox().width).toBe(100)

      const rbox1 = g.children()[0].rbox()
      const rbox2 = g.children()[1].rbox()

      expect(rbox1.width).toBeCloseTo(90.9, 1)
      expect(Math.floor(rbox2.width * 10) / 10).toBeCloseTo(63.6, 1) // Browsers have different opinion on this one (chrome: 63.6, ff: 63.7)

      expect(rbox1.x).toBeCloseTo(10, 3)
      expect(rbox2.x).toBeCloseTo(46.4, 1)
    })
  })

  describe('height()', () => {
    it('gets the height value of the bbox', () => {
      const canvas = SVG().addTo(container)

      const g = new G()
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.addTo(canvas)

      expect(g.height()).toBe(g.bbox().height)
      expect(g.height()).toBe(140)
    })
    it('sets the height value of the bbox by moving all children', () => {
      const canvas = SVG().addTo(container)

      const g = new G()
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.addTo(canvas)

      expect(g.height(100)).toBe(g)
      expect(g.bbox().height).toBeCloseTo(100, 3)

      const rbox1 = g.children()[0].rbox()
      const rbox2 = g.children()[1].rbox()

      expect(rbox1.height).toBeCloseTo(85.7, 1)
      expect(rbox2.height).toBeCloseTo(71.4, 1)

      expect(rbox1.y).toBeCloseTo(20, 3)
      expect(rbox2.y).toBeCloseTo(48.6, 1)
    })
  })
})
