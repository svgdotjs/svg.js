/* globals describe, expect, it */

import {
  registerMethods,
  getMethodsFor,
  getMethodNames
} from '../../../src/utils/methods.js'

describe('methods.js', () => {
  describe('registerMethods() / getMethodsFor() / addMethodNames / getMethodNames()', () => {
    it('adds methods for a given type of classes with object given', () => {
      const foo = {
        func1: () => {}
      }
      registerMethods({ foo })

      expect(getMethodsFor('foo')).toEqual(foo)
    })

    it('adds methods for a given type of classes with 2 parameters given', () => {
      const foo = {
        func1: () => {}
      }
      registerMethods('foo', foo)

      expect(getMethodsFor('foo')).toEqual(foo)
    })

    it('adds a method name', () => {
      registerMethods({ bar: { func2: () => {} } })
      expect(getMethodNames()).toContain('func2')
    })
  })
})
