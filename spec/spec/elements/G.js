/* globals describe, expect, it, jasmine, container */

import { G, SVG } from '../../../src/main.js'

const { any } = jasmine

describe('G.js', () => {
  describe('()', () => {
    it('creates a new object of type G', () => {
      expect(new G()).toEqual(any(G))
    })

    it('sets passed attributes on the element', () => {
      expect(new G({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('Container', () => {
    describe('group()', () => {
      it('creates a group in the container', () => {
        const canvas = SVG().addTo(container)
        const g = canvas.group()
        expect(g).toEqual(any(G))
        expect(g.parent()).toBe(canvas)
      })
    })
  })
})
