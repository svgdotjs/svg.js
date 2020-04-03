/* globals describe, expect, it, beforeEach, jasmine, container */

import { SVG, G, Rect, Svg } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'
const { any } = jasmine

describe('Dom.js', function () {
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
