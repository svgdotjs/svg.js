import { subClassArray } from '../../../src/types/ArrayPolyfill.js'
const { any, createSpy } = jasmine

describe('ArrayPolyfill.js', function() {
  describe('subClassArray()', function () {
    it('creates a new class inherited from Array', () => {
      const myArray = subClassArray('myArray', Array, )
      expect(new myArray()).toEqual(any(Array))
      expect(new myArray()).toEqual(any(myArray))
    })

    it('sets the name attribute of the class correctly', () => {
      const myArray = subClassArray('myArray', Array)
      expect(myArray.name).toEqual('myArray')
    })

    it('calls the given function on construction', () => {
      const spy = createSpy()
      const myArray = subClassArray('myArray', Array, spy)

      new myArray(1,2,3,4)
      expect(spy).toHaveBeenCalledWith(1, 2, 3, 4)
    })
  })
})
