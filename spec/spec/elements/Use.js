/* globals describe, expect, it, jasmine, container */

import { Use, Rect, SVG } from '../../../src/main.js'

const { any } = jasmine

describe('Use.js', () => {
  describe('()', () => {
    it('creates a new object of type Use', () => {
      expect(new Use()).toEqual(any(Use))
    })

    it('sets passed attributes on the element', () => {
      expect(new Use({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('use()', () => {
    it('links an element', () => {
      const rect = new Rect()
      const use = new Use().use(rect)
      expect(use.attr('href')).toBe('#' + rect.id())
    })

    it('links an element from a different file', () => {
      const use = new Use().use('id', 'file')
      expect(use.attr('href')).toBe('file#id')
    })
  })

  describe('Container', () => {
    describe('use()', () => {
      it('creates a use element linked to the given element', () => {
        const canvas = new SVG().addTo(container)
        const rect = canvas.rect(100, 100)
        const use = canvas.use(rect)
        expect(use.attr('href')).toBe('#' + rect.id())
        expect(use.reference('href')).toBe(rect)
      })
    })
  })
})
