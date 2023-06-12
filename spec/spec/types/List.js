/* globals describe, expect, it, jasmine */

import { List } from '../../../src/main.js'

const { any, createSpy, objectContaining } = jasmine

describe('List.js', () => {
  describe('()', () => {
    it('creates a new List from Array', () => {
      const list = new List([1, 2, 3])
      expect(list).toEqual(any(List))
    })

    it('creates preallocated List like Array(1)', () => {
      const list = new List(1)
      expect(list.length).toBe(1)
    })

    it('is instance of Array', () => {
      const list = new List([1, 2, 3])
      expect(list).toEqual(any(Array))
    })

    it('allows index access', () => {
      const list = new List([1, 2, 3])
      expect(list[1]).toBe(2)
    })
  })

  describe('each()', () => {
    it('works like map but with context set to the element when a function is passed', () => {
      const list = new List([1, 2, 3]).each((el) => el * 2)
      expect(list).toEqual(any(List))
      expect(list).toEqual([2, 4, 6])

      const spy = createSpy()
      const obj = {}
      const list2 = new List([obj])
      list2.each(spy)
      expect(spy.calls.first()).toEqual(
        objectContaining({
          object: obj,
          args: [obj, 0, list2]
        })
      )
    })

    it('calls a method on every element in the list and passes arguments when a string is passed', () => {
      const list = new List([10, 11, 12])
      expect(list.each('toString', 16)).toEqual(['a', 'b', 'c'])
    })
  })

  describe('toArray()', () => {
    it('returns a plain array from the contents of the list', () => {
      const list = new List([1, 2, 3])
      const arr = list.toArray()
      expect(arr).toEqual(any(Array))
      expect(arr).not.toEqual(any(List))
      expect(arr).toEqual([1, 2, 3])
    })
  })

  describe('static extend()', () => {
    it('adds new method names to the List', () => {
      List.extend(['fooBar'])
      expect(new List().fooBar).toEqual(any(Function))

      const obj = { fooBar: createSpy() }
      new List([obj]).fooBar()
      expect(obj.fooBar).toHaveBeenCalled()

      delete List.prototype.fooBar
    })

    it('skips reserved names', () => {
      const { constructor, each, toArray } = List.prototype
      List.extend(['constructor', 'each', 'toArray'])
      expect(List.prototype).toEqual(
        objectContaining({ constructor, each, toArray })
      )
    })

    it('skips private methods starting with an underscore', () => {
      List.extend(['_private'])
      expect(new List()._private).toBe(undefined)
    })
  })
})
