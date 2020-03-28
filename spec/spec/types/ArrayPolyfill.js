/* globals describe, expect, it, jasmine */

import { subClassArray } from '../../../src/types/ArrayPolyfill.js'
const { any, createSpy } = jasmine

describe('ArrayPolyfill.js', function () {
  describe('subClassArray()', function () {
    it('creates a new class inherited from Array', () => {
      const MyArray = subClassArray('myArray', Array)
      expect(new MyArray()).toEqual(any(Array))
      expect(new MyArray()).toEqual(any(MyArray))
    })

    it('sets the name attribute of the class correctly', () => {
      const MyArray = subClassArray('myArray', Array)
      expect(MyArray.name).toEqual('myArray')
    })

    it('calls the given function on construction', () => {
      const spy = createSpy()
      const MyArray = subClassArray('myArray', Array, spy)

      new MyArray(1, 2, 3, 4) // eslint-disable-line
      expect(spy).toHaveBeenCalledWith(1, 2, 3, 4)
    })
  })
})
