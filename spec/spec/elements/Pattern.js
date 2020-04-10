/* globals describe, expect, it, spyOn, jasmine, container */

import { Pattern, SVG, Container } from '../../../src/main.js'

const { any, objectContaining, createSpy } = jasmine

describe('Pattern.js', () => {
  describe('()', () => {
    it('creates a new object of type Pattern', () => {
      const pattern = new Pattern()
      expect(pattern).toEqual(any(Pattern))
    })

    it('sets passed attributes on the element', () => {
      expect(new Pattern({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('attr()', () => {
    it('relays to parents attr method for any call except transformation', () => {
      const pattern = new Pattern()
      const spy = spyOn(Container.prototype, 'attr')
      pattern.attr(1, 2, 3)
      pattern.attr('transform', 2, 3)

      expect(spy).toHaveBeenCalledWith(1, 2, 3)
      expect(spy).toHaveBeenCalledWith('patternTransform', 2, 3)
    })
  })

  describe('bbox()', () => {
    it('returns an empty box', () => {
      expect(new Pattern().bbox().isNulled()).toBe(true)
    })
  })

  describe('targets()', () => {
    it('gets all targets of this pattern', () => {
      const canvas = SVG().addTo(container)
      const pattern = canvas.pattern('linear')
      const rect = canvas.rect(100, 100).fill(pattern)
      expect(pattern.targets()).toEqual([ rect ])
    })
  })

  describe('toString()', () => {
    it('calls url() and returns the result', () => {
      const pattern = new Pattern()
      expect(pattern.toString()).toBe(pattern.url())
    })
  })

  describe('update()', () => {
    it('clears the element', () => {
      const pattern = new Pattern()
      pattern.rect(100, 100)
      expect(pattern.update().children()).toEqual([])
    })

    it('executes a function in the context of the pattern', () => {
      const pattern = new Pattern()
      const spy = createSpy('pattern')
      pattern.update(spy)
      expect(spy.calls.all()).toEqual([
        objectContaining({ object: pattern, args: [ pattern ] })
      ])
    })
  })

  describe('url()', () => {
    it('returns url(#id)', () => {
      const pattern = new Pattern().id('foo')
      expect(pattern.url()).toBe('url("#foo")')
    })
  })
})
