/* globals describe, expect, it, beforeEach, spyOn, jasmine, container */

import {
  SVG,
  G,
  Rect,
  Svg,
  Dom,
  List,
  Fragment,
  Circle,
  Tspan,
  create
} from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'
import { svg, html } from '../../../src/modules/core/namespaces.js'
const { any, createSpy, objectContaining } = jasmine

describe('Dom.js', function () {
  describe('()', () => {
    it('creates a new object of type Dom', () => {
      const rect = new Rect()
      expect(new Dom(rect.node)).toEqual(any(Dom))
    })

    it('sets passed attributes on the element', () => {
      const rect = new Rect()
      expect(new Dom(rect.node, { id: 'foo' }).id()).toBe('foo')
    })

    it('references the passed node on the instance', () => {
      const rect = new Rect()
      expect(new Dom(rect.node).node).toBe(rect.node)
    })

    it('sets the type according to the nodename', () => {
      const rect = new Rect()
      expect(new Dom(rect.node).type).toBe(rect.node.nodeName)
    })
  })

  describe('add()', () => {
    it('adds an element as child to the end with no second argument given', () => {
      const g = new G()
      g.add(new Rect())
      const rect = new Rect()
      g.add(rect)
      expect(g.children().length).toBe(2)
      expect(g.get(1)).toBe(rect)
    })

    it('adds an element at the specified position with second argument given', () => {
      const g = new G()
      g.add(new Rect())
      g.add(new Rect())
      const rect = new Rect()
      g.add(rect, 1)
      expect(g.children().length).toBe(3)
      expect(g.get(1)).toBe(rect)
    })

    it('does nothing if element is already the element at that position', () => {
      const g = new G()
      g.rect(100, 100)
      const rect = g.rect(100, 100)
      g.add(rect, 1)
      expect(g.get(1)).toBe(rect)
    })

    it('handles svg strings', () => {
      const g = new G()
      g.add('<rect />')
      expect(g.children().length).toBe(1)
      expect(g.get(0)).toEqual(any(Rect))
    })

    it('handles query selectors', () => {
      const canvas = SVG().addTo(container)
      const rect = canvas.rect(100, 100).addClass('test')
      const g = canvas.group()
      g.add('.test')
      expect(g.children().length).toBe(1)
      expect(g.get(0)).toBe(rect)
    })

    it('handles a node', () => {
      const g = new G()
      const node = create('rect')
      g.add(node)
      expect(g.children().length).toBe(1)
      expect(g.get(0)).toEqual(any(Rect))
    })
  })

  describe('addTo()', () => {
    it('returns the current element', () => {
      const g = new G()
      const rect = new Rect()
      expect(rect.addTo(g)).toBe(rect)
    })

    it('puts an element into another element', () => {
      const g = new G()
      const rect = new Rect()
      const spy = spyOn(g, 'put')
      rect.addTo(g, 0)
      expect(spy).toHaveBeenCalledWith(rect, 0)
    })

    it('works with svg strings', () => {
      const rect = new Rect()
      rect.addTo('<g />')
      expect(rect.parent()).toEqual(any(G))
    })

    it('works with query selector', () => {
      const canvas = SVG().addTo(container)
      const rect = canvas.rect(100, 100)
      const g = canvas.group().addClass('test')
      rect.addTo('.test')
      expect(g.children().length).toBe(1)
      expect(g.get(0)).toBe(rect)
    })
  })

  describe('children()', () => {
    it('returns a List of all children', () => {
      const g = new G()
      const rect = g.rect(100, 100)
      const circle = g.circle(100, 100)
      const children = g.children()
      expect(children).toEqual([rect, circle])
      expect(children).toEqual(any(List))
    })
  })

  describe('clear()', () => {
    it('returns the current element', () => {
      const g = new G()
      g.rect(100, 100)
      g.circle(100, 100)
      expect(g.clear()).toBe(g)
    })

    it('removes all children from an element', () => {
      const g = new G()
      g.rect(100, 100)
      g.circle(100, 100)
      g.clear()
      expect(g.children()).toEqual([])
    })
  })

  describe('clone()', () => {
    it('clones the current element and returns it', () => {
      const rect = new Rect()
      const clone = rect.clone()
      expect(rect).not.toBe(clone)
      expect(clone).toEqual(any(Rect))
      expect(clone.type).toBe(rect.type)
    })

    it('also clones the children by default', () => {
      const group = new G()
      const rect = group.rect(100, 100)
      const clone = group.clone()
      expect(clone.get(0)).not.toBe(rect)
      expect(clone.get(0)).toEqual(any(Rect))
    })

    it('does not clone the children when passing false', () => {
      const group = new G()
      group.rect(100, 100)
      const clone = group.clone(false)
      expect(clone.children()).toEqual([])
    })

    it('assigns a new id to the element and to child elements by default', () => {
      const group = new G().id('group')
      const rect = group.rect(100, 100).id('rect')
      const clone = group.clone()
      expect(clone.get(0).id()).not.toBe(rect.id())
      expect(clone.id()).not.toBe(group.id())
    })

    it('does not assign a new id to the element and to child elements', () => {
      const group = new G().id('group')
      const rect = group.rect(100, 100).id('rect')
      const clone = group.clone(true, false)
      expect(clone.get(0).id()).toBe(rect.id())
      expect(clone.id()).toBe(group.id())
    })

    it('returns an instance of the same class the method was called on', () => {
      const rect = new Dom(create('rect'))
      expect(rect.constructor).toBe(Dom)
      expect(rect.clone().constructor).toBe(Dom)
    })
  })

  describe('each()', () => {
    it('iterates over all children and executes the passed function on then', () => {
      const group = new G()
      const group2 = group.group()
      const circle = group.circle(100, 100)
      const spy = createSpy('each')
      group.each(spy)

      expect(spy.calls.all()).toEqual([
        objectContaining({ object: group2, args: [0, [group2, circle]] }),
        objectContaining({ object: circle, args: [1, [group2, circle]] })
      ])
    })

    it('iterates over all children recursively and executes the passed function on then when deep is true', () => {
      const group = new G()
      const group2 = group.group()
      const rect = group2.rect(100, 100)
      const circle = group.circle(100, 100)
      const spy = createSpy('each')
      group.each(spy, true)

      expect(spy.calls.all()).toEqual([
        objectContaining({ object: group2, args: [0, [group2, circle]] }),
        objectContaining({ object: rect, args: [0, [rect]] }),
        objectContaining({ object: circle, args: [1, [group2, circle]] })
      ])
    })
  })

  describe('element()', () => {
    it('creates an element of given type and appends it to the current element', () => {
      const g = new G()
      const el = g.element('title')
      expect(el).toEqual(any(Dom))
      expect(el.type).toBe('title')
    })

    it('sets the specified attributes passed as second argument', () => {
      const g = new G()
      const el = g.element('title', { id: 'foo' })
      expect(el.id()).toBe('foo')
    })
  })

  describe('first()', () => {
    it('returns the first child', () => {
      const g = new G()
      const rect = g.rect(100, 100)
      g.circle(100, 100)
      expect(g.first()).toBe(rect)
    })

    it('returns null if no first child exists', () => {
      expect(new G().first()).toBe(null)
    })
  })

  describe('get()', () => {
    it('returns the child at the given position', () => {
      const g = new G()
      const rect = g.rect(100, 100)
      const circle = g.circle(100, 100)
      expect(g.get(0)).toBe(rect)
      expect(g.get(1)).toBe(circle)
    })
  })

  describe('getEventHolder()', () => {
    it('returns the node because it holds all events on the object', () => {
      const dom = new Dom({})
      expect(dom.getEventHolder()).toBe(dom.node)
    })
  })

  describe('getEventTarget()', () => {
    it('returns the node because it is the target of the event', () => {
      const dom = new Dom({})
      expect(dom.getEventTarget()).toBe(dom.node)
    })
  })

  describe('has()', () => {
    it('returns true if the element has the passed element as child', () => {
      const g = new G()
      const rect = g.rect(100, 100)
      expect(g.has(rect)).toBe(true)
    })

    it("returns false if the element hasn't the passed element as child", () => {
      const g = new G()
      const rect = new Rect()
      expect(g.has(rect)).toBe(false)
    })
  })

  describe('html()', () => {
    it('calls xml with the html namespace', () => {
      const group = new G()
      const spy = spyOn(group, 'xml')
      group.html('<foo>')
      expect(spy).toHaveBeenCalledWith('<foo>', undefined, html)
    })
  })

  describe('id()', () => {
    it('returns current element when called as setter', () => {
      const g = new G()
      expect(g.id('asd')).toBe(g)
    })

    it('sets the id with argument given', () => {
      expect(new G().id('foo').node.id).toBe('foo')
    })

    it('gets the id when no argument given', () => {
      const g = new G({ id: 'foo' })
      expect(g.id()).toBe('foo')
    })

    it('generates an id on getting if none is set', () => {
      const g = new G()
      expect(g.node.id).toBe('')
      g.id()
      expect(g.node.id).not.toBe('')
    })
  })

  describe('index()', () => {
    it('gets the position of the passed child', () => {
      const g = new G()
      g.rect(100, 100)
      const rect = g.rect(100, 100)
      expect(g.index(rect)).toBe(1)
    })

    it('returns -1 if element is no child', () => {
      const g = new G()
      const rect = new Rect()
      expect(g.index(rect)).toBe(-1)
    })
  })

  describe('last()', () => {
    it('gets the last child of the element', () => {
      const g = new G()
      g.rect(100, 100)
      const rect = g.rect(100, 100)
      expect(g.last()).toBe(rect)
    })

    it('returns null if no last child exists', () => {
      expect(new G().last()).toBe(null)
    })
  })

  describe('parent()', () => {
    var canvas, rect, group1, group2

    beforeEach(function () {
      canvas = SVG().addTo(container)
      group1 = canvas.group().addClass('test')
      group2 = group1.group()
      rect = group2.rect(100, 100)
    })

    it('returns the svg parent with no argument given', () => {
      expect(rect.parent()).toBe(group2)
    })

    it('returns the closest parent with the correct type', () => {
      expect(rect.parent(Svg)).toBe(canvas)
    })

    it('returns the closest parent matching the selector', () => {
      expect(rect.parent('.test')).toBe(group1)
    })

    it('returns null if it cannot find a parent matching the argument', () => {
      expect(rect.parent('.not-there')).toBe(null)
    })

    it('returns null if it cannot find a parent matching the argument in a #document-fragment', () => {
      const fragment = getWindow().document.createDocumentFragment()
      const svg = new Svg().addTo(fragment)
      const rect = svg.rect(100, 100)
      expect(rect.parent('.not-there')).toBe(null)
    })

    it('returns Dom if parent is #document-fragment', () => {
      const fragment = getWindow().document.createDocumentFragment()
      const svg = new Svg().addTo(fragment)
      expect(svg.parent()).toEqual(any(Dom))
    })

    it('returns html parents, too', () => {
      expect(canvas.parent().node).toBe(container)
    })
  })

  describe('put()', () => {
    it('calls add() but returns the added element instead', () => {
      const g = new G()
      const rect = new Rect()
      const spy = spyOn(g, 'add').and.callThrough()
      expect(g.put(rect, 0)).toBe(rect)
      expect(spy).toHaveBeenCalledWith(rect, 0)
    })

    it('creates object from svg string', () => {
      const g = new G()
      const rect = '<rect />'
      const spy = spyOn(g, 'add').and.callThrough()
      const ret = g.put(rect, 0)
      expect(ret).toEqual(any(Rect))
      expect(spy).toHaveBeenCalledWith(ret, 0)
    })

    it('works with a query selector', () => {
      const canvas = SVG().addTo(container)
      const rect = canvas.rect().addClass('test')
      const g = canvas.group()
      const spy = spyOn(g, 'add').and.callThrough()
      const ret = g.put('.test', 0)
      expect(ret).toEqual(rect)
      expect(spy).toHaveBeenCalledWith(rect, 0)
    })
  })

  describe('putIn()', () => {
    it('calls add on the given parent', () => {
      const g = new G()
      const rect = new Rect()
      const spy = spyOn(g, 'add')
      rect.putIn(g, 0)
      expect(spy).toHaveBeenCalledWith(rect, 0)
    })

    it('returns the passed element', () => {
      const g = new G()
      const rect = new Rect()
      expect(rect.putIn(g, 0)).toBe(g)
    })

    it('returns an instance when svg string given', () => {
      const g = '<g />'
      const rect = new Rect()
      const ret = rect.putIn(g)
      expect(ret).toEqual(any(G))
      expect(ret.children()).toEqual([rect])
    })

    it('works with a query selector', () => {
      const canvas = SVG().addTo(container)
      const g = canvas.group().addClass('test')
      const rect = canvas.rect(100, 100)
      const ret = rect.putIn('.test')
      expect(ret).toBe(g)
      expect(g.children()).toEqual([rect])
    })
  })

  describe('remove()', () => {
    it('returns the removed element', () => {
      const canvas = SVG().addTo(container)
      const rect = canvas.rect(100, 100)
      expect(rect.remove()).toBe(rect)
    })

    it('removes the element from the parent', () => {
      const canvas = SVG().addTo(container)
      const rect = canvas.rect(100, 100)
      expect(canvas.children()).toEqual([rect])
      rect.remove()
      expect(canvas.children()).toEqual([])
    })

    it('is a noop when element is not attached to the dom', () => {
      const rect = new Rect()
      expect(rect.remove()).toBe(rect)
    })

    it('also works when direct child of document-fragment', () => {
      const fragment = new Fragment()
      const rect = fragment.rect(100, 100)
      expect(fragment.children()).toEqual([rect])
      expect(rect.remove()).toBe(rect)
      expect(fragment.children()).toEqual([])
    })
  })

  describe('removeElement()', () => {
    it('returns itself', () => {
      const g = new G()
      const rect = g.rect(100, 100)
      expect(g.removeElement(rect)).toBe(g)
    })

    it('removes the given child', () => {
      const g = new G()
      const rect = g.rect(100, 100)
      expect(g.removeElement(rect).children()).toEqual([])
    })

    it('throws if the given element is not a child', () => {
      const g = new G()
      const rect = new Rect()
      try {
        g.removeElement(rect)
      } catch (e) {
        expect(e).toEqual(objectContaining({ code: 8 }))
      }
    })
  })

  describe('replace()', () => {
    it('returns the new element', () => {
      const g = new G()
      const rect = g.rect(100, 100)
      const circle = new Circle()
      expect(rect.replace(circle)).toBe(circle)
    })

    it('replaces the child at the correct position', () => {
      const g = new G()
      const rect1 = g.rect(100, 100)
      const rect2 = g.rect(100, 100)
      const rect3 = g.rect(100, 100)
      const circle = new Circle()
      rect2.replace(circle)
      expect(g.children()).toEqual([rect1, circle, rect3])
    })

    it('also works without a parent', () => {
      const rect = new Rect()
      const circle = new Circle()
      expect(rect.replace(circle)).toBe(circle)
    })
  })

  describe('round()', () => {
    it('rounds all attributes whose values are numbers to two decimals by default', () => {
      const rect = new Rect({ id: 'foo', x: 10.678, y: 3, width: 123.456 })
      expect(rect.round().attr()).toEqual({
        id: 'foo',
        x: 10.68,
        y: 3,
        width: 123.46
      })
    })

    it('rounds all attributes whose values are numbers to the passed precision', () => {
      const rect = new Rect({ id: 'foo', x: 10.678, y: 3, width: 123.456 })
      expect(rect.round(1).attr()).toEqual({
        id: 'foo',
        x: 10.7,
        y: 3,
        width: 123.5
      })
    })

    it('rounds the given attributes whose values are numbers to the passed precision', () => {
      const rect = new Rect({ id: 'foo', x: 10.678, y: 3, width: 123.456 })
      expect(rect.round(1, ['id', 'x']).attr()).toEqual({
        id: 'foo',
        x: 10.7,
        y: 3,
        width: 123.456
      })
    })
  })

  describe('svg()', () => {
    it('calls xml with the svg namespace', () => {
      const group = new G()
      const spy = spyOn(group, 'xml')
      group.svg('<foo>')
      expect(spy).toHaveBeenCalledWith('<foo>', undefined, svg)
    })
  })

  describe('toString()', () => {
    it('calls id() and returns its result', () => {
      const rect = new Rect({ id: 'foo' })
      const spy = spyOn(rect, 'id').and.callThrough()
      expect(rect.toString()).toBe('foo')
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('words', () => {
    it('sets the nodes textContent to the given value', () => {
      const tspan = new Tspan().words('Hello World')
      expect(tspan.text()).toBe('Hello World')
    })
  })

  describe('wrap()', function () {
    var canvas
    var rect

    beforeEach(function () {
      canvas = SVG()
      rect = canvas.rect(100, 100)
    })

    it('returns the current element', function () {
      expect(rect.wrap(new G())).toBe(rect)
    })

    it('wraps the passed element around the current element', function () {
      var g = new G()
      expect(rect.wrap(g).parent()).toBe(g)
      expect(g.parent()).toBe(canvas)
    })

    it('wraps also when element is not in the dom', () => {
      var g = new G()
      var rect = new Rect()
      expect(rect.wrap(g).parent()).toBe(g)
      expect(g.parent()).toBe(null)
    })

    it('inserts at the correct position', () => {
      canvas.rect(100, 100)
      rect = canvas.rect(100, 100)
      var position = rect.position()
      var g = new G()
      expect(rect.wrap(g).parent().position()).toBe(position)
    })

    it('allows to pass an svg string as element', () => {
      rect.wrap('<g />')
      expect(rect.parent()).toEqual(any(G))
      expect(rect.parent().parent()).toBe(canvas)
    })

    it('allows to pass an svg string as element', () => {
      rect.wrap('<g />')
      expect(rect.parent()).toEqual(any(G))
      expect(rect.parent().parent()).toBe(canvas)
    })

    it('allows to pass an svg string as element when element not in the dom', () => {
      var rect = new Rect()
      rect.wrap(SVG('<g />'))
      expect(rect.parent()).toEqual(any(G))
      expect(rect.parent().parent()).toBe(null)
    })

    it('allows to pass an svg node as element', () => {
      const node = create('g')
      rect.wrap(node)
      expect(rect.parent()).toEqual(any(G))
      expect(rect.parent().node).toBe(node)
      expect(rect.parent().parent()).toBe(canvas)
    })
  })

  // describe('writeDataToDom()', () => {
  //   // not really testable
  // })

  describe('xml()', () => {
    describe('as setter', () => {
      it('returns itself', () => {
        const g = new G()
        expect(g.xml('<rect />', undefined, svg)).toBe(g)
      })

      it('imports a single element', () => {
        const g = new G().xml('<rect />', undefined, svg)
        expect(g.children()).toEqual([any(Rect)])
        expect(g.children()[0].node.namespaceURI).toBe(svg)
      })

      it('imports multiple elements', () => {
        const g = new G().xml('<rect /><circle />', undefined, svg)
        expect(g.children()).toEqual([any(Rect), any(Circle)])
      })

      it('replaces the current element with the imported elements with outerHtml = true', () => {
        const canvas = new Svg()
        const g = canvas.group()
        g.xml('<rect /><circle />', true, svg)
        expect(canvas.children()).toEqual([any(Rect), any(Circle)])
      })

      it('returns the parent when outerHtml = true', () => {
        const canvas = new Svg()
        const g = canvas.group()
        expect(g.xml('<rect /><circle />', true, svg)).toBe(canvas)
        expect(canvas.children()).toEqual([any(Rect), any(Circle)])
      })

      it('works without a parent', () => {
        const canvas = new Svg()
        expect(canvas.xml('<rect /><circle />', undefined, svg)).toBe(canvas)
      })
    })

    describe('as getter', () => {
      let canvas, group, rect

      beforeEach(() => {
        canvas = new Svg().removeNamespace()
        group = canvas.group()
        rect = group.rect(123.456, 234.567)
      })

      it('returns the svg string of the element by default', () => {
        expect(rect.xml(), svg).toBe(
          '<rect width="123.456" height="234.567"></rect>'
        )
        expect(canvas.xml(), svg).toBe(
          '<svg><g><rect width="123.456" height="234.567"></rect></g></svg>'
        )
      })

      it('returns the innerHtml when outerHtml = false', () => {
        expect(rect.xml(false, svg)).toBe('')
        expect(canvas.xml(false, svg)).toBe(
          '<g><rect width="123.456" height="234.567"></rect></g>'
        )
      })

      it('runs a function on every exported node', () => {
        expect(rect.xml((el) => el.round(1))).toBe(
          '<rect width="123.5" height="234.6"></rect>'
        )
      })

      it('runs a function on every exported node and replaces node with returned node if return value is not falsy', () => {
        expect(rect.xml(() => new Circle(), svg)).toBe('<circle></circle>')
        expect(canvas.xml(() => new G(), svg)).toBe('<g></g>') // outer <svg> was replaced by an empty g
        expect(
          canvas.xml((el) => {
            if (el instanceof Rect) return new Circle()
            if (el instanceof Svg) el.removeNamespace()
          }, svg)
        ).toBe('<svg><g><circle></circle></g></svg>')
      })

      it('runs a function on every exported node and removes node if return value is false', () => {
        expect(group.xml(() => false, svg)).toBe('')
        expect(canvas.xml(() => false, svg)).toBe('')
        expect(
          canvas.xml((el) => {
            if (el instanceof Svg) {
              el.removeNamespace()
            } else {
              return false
            }
          }, svg)
        ).toBe('<svg></svg>')
      })

      it('runs a function on every inner node and exports it when outerHtml = false', () => {
        expect(canvas.xml(() => false, false, svg)).toBe('')
        expect(canvas.xml(() => undefined, false, svg)).toBe(
          '<g><rect width="123.456" height="234.567"></rect></g>'
        )
      })
    })
  })
})
