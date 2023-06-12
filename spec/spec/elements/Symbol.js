/* globals describe, expect, it, jasmine */

import { Symbol, G } from '../../../src/main.js'

const { any } = jasmine

describe('Symbol.js', () => {
  describe('()', () => {
    it('creates a new object of type Symbol', () => {
      expect(new Symbol()).toEqual(any(Symbol))
    })

    it('sets passed attributes on the element', () => {
      expect(new Symbol({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('Container', () => {
    describe('symbol()', () => {
      it('creates a symbol in the container', () => {
        const g = new G()
        const symbol = g.symbol()
        expect(symbol).toEqual(any(Symbol))
        expect(g.children()).toEqual([symbol])
      })
    })
  })
})
