/* globals describe, expect, it, spyOn, jasmine, container */

import { Gradient, SVG, Container } from '../../../src/main.js'

const { any, objectContaining, createSpy } = jasmine

describe('Gradient.js', () => {
  describe('()', () => {
    it('creates a new object of type LinearGradient', () => {
      const gradient = new Gradient('linear')
      expect(gradient).toEqual(any(Gradient))
      expect(gradient.type).toBe('linearGradient')
    })

    it('creates a new object of type RadialGradient', () => {
      const gradient = new Gradient('radial')
      expect(gradient).toEqual(any(Gradient))
      expect(gradient.type).toBe('radialGradient')
    })

    it('sets passed attributes on the element', () => {
      expect(new Gradient('linear', { id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('attr()', () => {
    it('relays to parents attr method for any call except transformation', () => {
      const gradient = new Gradient('linear')
      const spy = spyOn(Container.prototype, 'attr')
      gradient.attr(1, 2, 3)
      gradient.attr('transform', 2, 3)

      expect(spy).toHaveBeenCalledWith(1, 2, 3)
      expect(spy).toHaveBeenCalledWith('gradientTransform', 2, 3)
    })
  })

  describe('bbox()', () => {
    it('returns an empty box', () => {
      expect(new Gradient('linear').bbox().isNulled()).toBe(true)
    })
  })

  describe('targets()', () => {
    it('gets all targets of this gradient', () => {
      const canvas = SVG().addTo(container)
      const gradient = canvas.gradient('linear')
      const rect = canvas.rect(100, 100).fill(gradient)
      expect(gradient.targets()).toEqual([rect])
    })
  })

  describe('toString()', () => {
    it('calls url() and returns the result', () => {
      const gradient = new Gradient('linear')
      expect(gradient.toString()).toBe(gradient.url())
    })
  })

  describe('update()', () => {
    it('clears the element', () => {
      const gradient = new Gradient('linear')
      gradient.stop(0.1, '#fff')
      expect(gradient.update().children()).toEqual([])
    })

    it('executes a function in the context of the gradient', () => {
      const gradient = new Gradient('linear')
      const spy = createSpy('gradient')
      gradient.update(spy)
      expect(spy.calls.all()).toEqual([
        objectContaining({ object: gradient, args: [gradient] })
      ])
    })
  })

  describe('url()', () => {
    it('returns url(#id)', () => {
      const gradient = new Gradient('linear').id('foo')
      expect(gradient.url()).toBe('url(#foo)')
    })
  })

  describe('Container', () => {
    it('relays the call to defs', () => {
      const canvas = new SVG()
      const defs = canvas.defs()
      const spy = spyOn(defs, 'gradient').and.callThrough()
      const spy2 = createSpy('gradient')

      canvas.gradient('linear', spy2)
      expect(spy).toHaveBeenCalledWith('linear', spy2)
      expect(spy2).toHaveBeenCalled()
    })
  })

  describe('Defs', () => {
    it('creates a pattern in the defs', () => {
      const canvas = new SVG()
      const defs = canvas.defs()
      const spy = createSpy('gradient')
      const gradient = defs.gradient('linear', spy)
      expect(gradient).toEqual(any(Gradient))
      expect(gradient.type).toBe('linearGradient')
      expect(defs.children()).toEqual([gradient])
      expect(spy).toHaveBeenCalled()
    })
  })
})
