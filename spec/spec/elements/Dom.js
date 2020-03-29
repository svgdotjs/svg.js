/* globals describe, expect, it, beforeEach, jasmine */

import { SVG, G, Rect } from '../../../src/main.js'
const { any } = jasmine

describe('Dom.js', function () {
  describe('wrap()', function () {
    var canvas
    var rect

    beforeEach(function () {
      canvas = new SVG()
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
