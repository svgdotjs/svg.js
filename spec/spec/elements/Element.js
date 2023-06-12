/* globals describe, expect, it, beforeEach, spyOn, jasmine, container */

import { Element, create, Rect, G, SVG } from '../../../src/main.js'
const { any, objectContaining } = jasmine

describe('Element.js', function () {
  let element

  beforeEach(() => {
    element = new Element(create('rect'))
  })

  describe('()', () => {
    it('creates a new object of type Element', () => {
      expect(element).toEqual(any(Element))
    })

    it('sets passed attributes on the element', () => {
      expect(new Element(create('rect'), { id: 'foo' }).id()).toBe('foo')
    })

    it('references the instance on the passed node', () => {
      expect(element.node.instance).toBe(element)
    })

    it('sets the dom property to an empty object', () => {
      expect(element.dom).toEqual({})
    })

    it('hydrates the dom property with data found in the dom', () => {
      element.dom = { foo: 'bar' }
      element.writeDataToDom()
      expect(new Element(element.node).dom).toEqual({ foo: 'bar' })
    })

    it('falls back to empty object when attribute is null', () => {
      element.node.setAttribute('svgjs:data', 'null')
      expect(new Element(element.node).dom).toEqual({})
    })
  })

  describe('center()', () => {
    it('calls cx and cy with passed parameters and returns itself', () => {
      const spyCx = spyOn(element, 'cx').and.callThrough()
      const spyCy = spyOn(element, 'cy').and.callThrough()
      expect(element.center(1, 2)).toBe(element)
      expect(spyCx).toHaveBeenCalledWith(1)
      expect(spyCy).toHaveBeenCalledWith(2)
    })
  })

  describe('cx()', () => {
    it('gets the elements center along the x axis', () => {
      element.attr({ x: 10, width: 100 })
      expect(element.cx()).toBe(60)
    })

    it('centers the element along the x axis and returns itself', () => {
      element.attr({ x: 10, width: 100 })
      expect(element.cx(100)).toBe(element)
      expect(element.attr('x')).toBe(50)
    })
  })

  describe('cy()', () => {
    it('gets the elements center along the y axis', () => {
      element.attr({ y: 10, height: 100 })
      expect(element.cy()).toBe(60)
    })

    it('centers the element along the y axis and returns itself', () => {
      element.attr({ y: 10, height: 100 })
      expect(element.cy(100)).toBe(element)
      expect(element.attr('y')).toBe(50)
    })
  })

  describe('defs()', () => {
    it('returns null if detached', () => {
      expect(new Rect().defs()).toBe(null)
      expect(new G().put(new Rect()).defs()).toBe(null)
    })

    it('calls defs on root node', () => {
      const canvas = SVG()
      const rect = canvas.rect(100, 100)
      const spy = spyOn(canvas, 'defs').and.callThrough()
      expect(rect.defs()).toBe(canvas.defs())
      expect(spy.calls.count()).toBe(2)
    })
  })

  describe('dmove()', () => {
    it('calls dx and dy with passed parameters and returns itself', () => {
      const spyDx = spyOn(element, 'dx').and.callThrough()
      const spyDy = spyOn(element, 'dy').and.callThrough()
      expect(element.dmove(1, 2)).toBe(element)
      expect(spyDx).toHaveBeenCalledWith(1)
      expect(spyDy).toHaveBeenCalledWith(2)
    })
  })

  describe('dx()', () => {
    it('moves by zero by default', () => {
      element.attr({ x: 10, width: 100 })
      expect(element.dx().x()).toBe(10)
    })

    it('moves the element along the x axis relatively and returns itself', () => {
      element.attr({ x: 10, width: 100 })
      expect(element.dx(100)).toBe(element)
      expect(element.attr('x')).toBe(110)
    })
  })

  describe('dy()', () => {
    it('moves by zero by default', () => {
      element.attr({ y: 10, height: 100 })
      expect(element.dy().y()).toBe(10)
    })

    it('moves the element along the x axis relatively and returns itself', () => {
      element.attr({ y: 10, height: 100 })
      expect(element.dy(100)).toBe(element)
      expect(element.attr('y')).toBe(110)
    })
  })

  describe('root()', () => {
    it('returns the root of this element', () => {
      const canvas = SVG()
      const rect = canvas.rect()
      expect(rect.root()).toBe(canvas)
    })

    it('returns null if element is detached', () => {
      expect(new G().put(new Rect()).root()).toBe(null)
    })
  })

  describe('getEventHolder()', () => {
    it('returns itself', () => {
      expect(element.getEventHolder()).toBe(element)
    })
  })

  describe('height()', () => {
    it('calls attr with height', () => {
      const spy = spyOn(element, 'attr')
      element.height(123)
      expect(spy).toHaveBeenCalledWith('height', 123)
    })
  })

  describe('move()', () => {
    it('calls x and y with passed parameters and returns itself', () => {
      const spyx = spyOn(element, 'x').and.callThrough()
      const spyy = spyOn(element, 'y').and.callThrough()
      expect(element.move(1, 2)).toBe(element)
      expect(spyx).toHaveBeenCalledWith(1)
      expect(spyy).toHaveBeenCalledWith(2)
    })
  })

  describe('parents()', () => {
    it('returns array of parents until the passed element or root svg', () => {
      const canvas = SVG().addTo(container)
      const groupA = canvas.group().addClass('test')
      const group1 = canvas.group().addClass('test')
      const group2 = group1.group()
      const group3 = group2.group()
      const rect = group3.rect(100, 100)

      expect(rect.parents('.test')).toEqual([group3, group2, group1])
      expect(rect.parents(group2)).toEqual([group3, group2])
      expect(rect.parents(group1).length).toBe(3)
      expect(rect.parents()).toEqual([group3, group2, group1, canvas])
    })

    it('returns array of parents until the closest matching parent', () => {
      const canvas = SVG().addTo(container)
      const groupA = canvas.group().addClass('test')
      const group1 = canvas.group().addClass('test')
      const group2 = group1.group().addClass('test').addClass('foo')
      const group3 = group2.group().addClass('foo')
      const rect = group3.rect(100, 100)

      expect(rect.parents('.test')).toEqual([group3, group2])
      expect(rect.parents('.foo')).toEqual([group3])
      expect(rect.parents('.test:not(.foo)')).toEqual([group3, group2, group1])
    })

    it('returns null if the passed element is not an ancestor', () => {
      const canvas = SVG().addTo(container)
      const groupA = canvas.group().addClass('test')
      const group1 = canvas.group()
      const group2 = group1.group()
      const group3 = group2.group()
      const rect = group3.rect(100, 100)

      expect(rect.parents('.does-not-exist')).toEqual(null)
      expect(rect.parents('.test')).toEqual(null)
      expect(rect.parents(groupA)).toEqual(null)
    })
  })

  describe('reference()', () => {
    it('gets a referenced element from a given attribute', () => {
      const canvas = SVG().addTo(container)
      const rect = canvas.defs().rect(100, 100)
      const use = canvas.use(rect)
      const mark = canvas.marker(10, 10)
      const path = canvas.path('M0 0 50 50').marker('end', mark)

      expect(use.reference('href')).toBe(rect)
      expect(path.reference('marker-end')).toBe(mark)
      expect(rect.reference('width')).toBe(null)
    })
  })

  describe('setData()', () => {
    it('sets the given data to the dom property and returns itself', () => {
      expect(element.setData({ foo: 'bar' })).toBe(element)
      expect(element.dom).toEqual({ foo: 'bar' })
    })
  })

  describe('size()', () => {
    it('calls width and height with passed parameters and returns itself', () => {
      const spyWidth = spyOn(element, 'width').and.callThrough()
      const spyHeight = spyOn(element, 'height').and.callThrough()
      expect(element.size(1, 2)).toBe(element)
      expect(spyWidth).toHaveBeenCalledWith(objectContaining({ value: 1 }))
      expect(spyHeight).toHaveBeenCalledWith(objectContaining({ value: 2 }))
    })

    it('changes height proportionally if null', () => {
      const canvas = SVG().addTo(container)
      const element = canvas.rect(100, 100)
      const spyWidth = spyOn(element, 'width').and.callThrough()
      const spyHeight = spyOn(element, 'height').and.callThrough()
      expect(element.size(200, null)).toBe(element)
      expect(spyWidth).toHaveBeenCalledWith(objectContaining({ value: 200 }))
      expect(spyHeight).toHaveBeenCalledWith(objectContaining({ value: 200 }))
    })

    it('changes width proportionally if null', () => {
      const canvas = SVG().addTo(container)
      const element = canvas.rect(100, 100)
      const spyWidth = spyOn(element, 'width').and.callThrough()
      const spyHeight = spyOn(element, 'height').and.callThrough()
      expect(element.size(null, 200)).toBe(element)
      expect(spyWidth).toHaveBeenCalledWith(objectContaining({ value: 200 }))
      expect(spyHeight).toHaveBeenCalledWith(objectContaining({ value: 200 }))
    })
  })

  describe('width()', () => {
    it('calls attr with width', () => {
      const spy = spyOn(element, 'attr')
      element.width(123)
      expect(spy).toHaveBeenCalledWith('width', 123)
    })
  })

  describe('writeDataToDom()', () => {
    it('removes previously set data', () => {
      element.node.setAttribute('svgjs:data', JSON.stringify({ foo: 'bar' }))
      element.writeDataToDom()
      expect(element.node.getAttribute('svgjs:data')).toBe(null)
    })

    it('writes data from the dom property into the dom', () => {
      element.dom = { foo: 'bar' }
      element.writeDataToDom()
      expect(element.node.getAttribute('svgjs:data')).toBe(
        JSON.stringify({ foo: 'bar' })
      )
    })

    it('recursively calls writeDataToDom on all children', () => {
      const g = new G()
      const rect = g.rect(100, 100)
      const spy = spyOn(rect, 'writeDataToDom')
      g.writeDataToDom()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('x()', () => {
    it('calls attr with x', () => {
      const spy = spyOn(element, 'attr')
      element.x(123)
      expect(spy).toHaveBeenCalledWith('x', 123)
    })
  })

  describe('y()', () => {
    it('calls attr with y', () => {
      const spy = spyOn(element, 'attr')
      element.y(123)
      expect(spy).toHaveBeenCalledWith('y', 123)
    })
  })
})
