/* globals describe, expect, it, jasmine */

import { Defs } from '../../../src/main.js'

const { any } = jasmine

describe('Defs.js', () => {
  describe('()', () => {
    it('creates a new object of type Defs', () => {
      expect(new Defs()).toEqual(any(Defs))
    })

    it('sets passed attributes on the element', () => {
      expect(new Defs({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('flatten()', () => {
    it('does nothing and returns itself', () => {
      const defs = Object.freeze(new Defs())
      expect(defs.flatten()).toBe(defs)
    })
  })

  describe('ungroup()', () => {
    it('does nothing and returns itself', () => {
      const defs = Object.freeze(new Defs())
      expect(defs.ungroup()).toBe(defs)
    })
  })
})
