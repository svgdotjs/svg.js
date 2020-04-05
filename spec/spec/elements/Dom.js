/* globals describe, expect, it, beforeEach, spyOn, jasmine, container */

import { SVG, G, Rect, Svg, Dom, List } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'
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

    it('handles svg strings', () => {
      const g = new G()
      g.add('<rect>')
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
  })

  describe('addTo()', () => {
    it('returns the current element', () => {
      const g = new G()
      const rect = new Rect()
      expect(rect.addTo(g)).toBe(rect)
    })

    it('puts an element innto another element', () => {
      const g = new G()
      const rect = new Rect()
      const spy = spyOn(g, 'put')
      rect.addTo(g, 0)
      expect(spy).toHaveBeenCalledWith(rect, 0)
    })

    it('works with svg strings', () => {
      const rect = new Rect()
      rect.addTo('<g>')
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
      expect(children).toEqual([ rect, circle ])
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

    it('assigns a new id to the element and to child elements', () => {
      const group = new G().id('group')
      const rect = group.rect(100, 100).id('rect')
      const clone = group.clone()
      expect(clone.get(0).id()).not.toBe(rect.id())
      expect(clone.id()).not.toBe(group.id())
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
        objectContaining({ object: group2, args: [ 0, [ group2, circle ] ] }),
        objectContaining({ object: circle, args: [ 1, [ group2, circle ] ] })
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
        objectContaining({ object: group2, args: [ 0, [ group2, circle ] ] }),
        objectContaining({ object: rect, args: [ 0, [ rect ] ] }),
        objectContaining({ object: circle, args: [ 1, [ group2, circle ] ] })
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

    it('returns false if the element hasn\'t the passed element as child', () => {
      const g = new G()
      const rect = new Rect()
      expect(g.has(rect)).toBe(false)
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

    it('returns null if parent is #document', () => {
      // cant test that here
    })

    it('returns null if parent is #document-fragment', () => {
      const fragment = getWindow().document.createDocumentFragment()
      const svg = new Svg().addTo(fragment)
      expect(svg.parent()).toBe(null)
    })

    it('returns html parents, too', () => {
      expect(canvas.parent().node).toBe(container)
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
      rect.wrap('<g>')
      expect(rect.parent()).toEqual(any(G))
      expect(rect.parent().parent()).toBe(canvas)
    })

    it('allows to pass an svg string as element', () => {
      rect.wrap('<g>')
      expect(rect.parent()).toEqual(any(G))
      expect(rect.parent().parent()).toBe(canvas)
    })

    it('allows to pass an svg string as element when element not in the dom', () => {
      var rect = new Rect()
      rect.wrap(SVG('<g>'))
      expect(rect.parent()).toEqual(any(G))
      expect(rect.parent().parent()).toBe(null)
    })

    it('allows to pass an svg node as element', () => {
      var g = new G()
      const node = g.node
      delete node.instance
      rect.wrap(node)
      expect(rect.parent()).toEqual(any(G))
      expect(rect.parent().node).toBe(node)
      expect(rect.parent()).not.toBe(g)
      expect(rect.parent().parent()).toBe(canvas)
    })
  })
})
