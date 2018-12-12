import { G, Rect, makeInstance } from '../../../src/main';

const { any, createSpy, objectContaining } = jasmine


describe('G.js', () => {

  describe('()', () => {
    it('creates a new object of type G', () => {
      expect(new G()).toEqual(any(G))
    })

    it('sets passed attributes on the element', () => {
      expect(new G({id:'foo'}).id()).toBe('foo')
    })
  })

  describe('x()', () => {
    it('gets the x value of the bbox', () => {
      const canvas = makeInstance().addTo('#canvas')

      const g = new G()
      g.add(new Rect({width:100, height:120, x:10, y:20}))
      g.add(new Rect({width:70, height:100, x:50, y:60}))

      g.addTo(canvas)

      expect(g.x()).toBe(g.bbox().x)
      expect(g.x()).toBe(10)
    })
    it('sets the x value of the bbox by moving all children', () => {
      const canvas = makeInstance().addTo('#canvas')

      const g = new G()
      g.add(new Rect({width:100, height:120, x:10, y:20}))
      g.add(new Rect({width:70, height:100, x:50, y:60}))

      g.addTo(canvas)

      expect(g.x(0)).toBe(g)
      expect(g.bbox().x).toBe(0)
      expect(g.children()[0].x()).toBe(0)
      expect(g.children()[1].x()).toBe(40)
    })
  })

  describe('y()', () => {
    it('gets the y value of the bbox', () => {
      const canvas = makeInstance().addTo('#canvas')

      const g = new G()
      g.add(new Rect({width:100, height:120, x:10, y:20}))
      g.add(new Rect({width:70, height:100, x:50, y:60}))

      g.addTo(canvas)

      expect(g.y()).toBe(g.bbox().y)
      expect(g.y()).toBe(20)
    })
    it('sets the y value of the bbox by moving all children', () => {
      const canvas = makeInstance().addTo('#canvas')

      const g = new G()
      g.add(new Rect({width:100, height:120, x:10, y:20}))
      g.add(new Rect({width:70, height:100, x:50, y:60}))

      g.addTo(canvas)

      expect(g.y(0)).toBe(g)
      expect(g.bbox().y).toBe(0)
      expect(g.children()[0].y()).toBe(0)
      expect(g.children()[1].y()).toBe(40)
    })
  })

  describe('width()', () => {
    it('gets the width value of the bbox', () => {
      const canvas = makeInstance().addTo('#canvas')

      const g = new G()
      g.add(new Rect({width:100, height:120, x:10, y:20}))
      g.add(new Rect({width:70, height:100, x:50, y:60}))

      g.addTo(canvas)

      expect(g.width()).toBe(g.bbox().width)
      expect(g.width()).toBe(110)
    })
    it('sets the width value of the bbox by moving all children', () => {
      const canvas = makeInstance().addTo('#canvas')

      const g = new G()
      g.add(new Rect({width:100, height:120, x:10, y:20}))
      g.add(new Rect({width:70, height:100, x:50, y:60}))

      g.addTo(canvas)

      expect(g.width(100)).toBe(g)
      expect(g.bbox().width).toBe(100)
      expect(g.children()[0].width()).toBeCloseTo(90.909, 3)
      expect(g.children()[1].width()).toBeCloseTo(63.636, 3)

      expect(g.children()[0].x()).toBeCloseTo(10, 3)
      expect(g.children()[1].x()).toBeCloseTo(46.364, 3)
    })
  })

  describe('height()', () => {
    it('gets the height value of the bbox', () => {
      const canvas = makeInstance().addTo('#canvas')

      const g = new G()
      g.add(new Rect({width:100, height:120, x:10, y:20}))
      g.add(new Rect({width:70, height:100, x:50, y:60}))

      g.addTo(canvas)

      expect(g.height()).toBe(g.bbox().height)
      expect(g.height()).toBe(140)
    })
    it('sets the height value of the bbox by moving all children', () => {
      const canvas = makeInstance().addTo('#canvas')

      const g = new G()
      g.add(new Rect({width:100, height:120, x:10, y:20}))
      g.add(new Rect({width:70, height:100, x:50, y:60}))

      g.addTo(canvas)

      expect(g.height(100)).toBe(g)
      expect(g.bbox().height).toBe(100)
      expect(g.children()[0].height()).toBeCloseTo(85.714, 3)
      expect(g.children()[1].height()).toBeCloseTo(71.429, 3)

      expect(g.children()[0].y()).toBeCloseTo(20, 3)
      expect(g.children()[1].y()).toBeCloseTo(48.571, 3)
    })
  })
})
