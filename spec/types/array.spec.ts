import * as SVGJS from '@svgdotjs/svg.js'

describe('Array', function () {
  var array: SVGJS.Array<number>

  it('parses a matrix array correctly to string', function () {
    array = new SVGJS.Array([.343, .669, .119, 0, 0
      , .249, -.626, .130, 0, 0
      , .172, .334, .111, 0, 0
      , .000, .000, .000, 1, -0])

    expect(array + '').toBe('0.343 0.669 0.119 0 0 0.249 -0.626 0.13 0 0 0.172 0.334 0.111 0 0 0 0 0 1 0')
  })
  it('parses space seperated string and converts it to array', function () {
    expect((new SVGJS.Array('1 2 3 4')).valueOf()).toEqual([1, 2, 3, 4])
  })
  it('parses comma seperated string and converts it to array', function () {
    expect((new SVGJS.Array('1,2,3,4')).valueOf()).toEqual([1, 2, 3, 4])
  })
  describe('reverse()', function () {
    it('reverses the array', function () {
      const arrayNative = new SVGJS.Array([1, 2, 3, 4, 5]).reverse()
      expect(arrayNative.valueOf()).toEqual([5, 4, 3, 2, 1])
    })
    it('returns itself', function () {
      array = new SVGJS.Array()
      expect(array.reverse()).toBe(array)
    })
  })
  describe('clone()', function () {
    it('creates a deep clone of the array', function () {
      var array = new SVGJS.Array([1, 2, 3, 4, 5])

      var clone = array.clone()

      expect(array).toEqual(clone)
      expect(array).not.toBe(clone)

      const array2Dim = new SVGJS.Array([[1, 2], [3, 4], [5]])
      const clone2Dim = array2Dim.clone()

      expect(array2Dim).toEqual(clone2Dim)
      for (var i = 0, len = array2Dim.length; i; ++i) {
        expect(array2Dim[i]).not.toBe(clone2Dim[i])
      }
    })
    it('also works with PointArray', function () {
      var array = new SVGJS.PointArray([1, 2, 3, 4, 5, 6])
      var clone = array.clone()

      expect(array).toEqual(clone)
      expect(array).not.toBe(clone)

      for (var i = 0, len = array.length; i; ++i) {
        expect(array[i]).not.toBe(clone[i])
      }
    })
    it('also works with PathArray', function () {
      var array = new SVGJS.PathArray([['M', 1, 2], ['L', 3, 4], ['L', 5, 6]])
      var clone = array.clone()

      expect(array).toEqual(clone)
      expect(array).not.toBe(clone)

      for (var i = 0, len = array.length; i; ++i) {
        expect(array[i]).not.toBe(clone[i])
      }
    })
  })
})


describe('PointArray', function () {
  it('parses a string to a point array', function () {
    var array = new SVGJS.PointArray('0,1 -.05,7.95 1000.0001,-200.222')

    expect(array.valueOf()).toEqual([[0, 1], [-0.05, 7.95], [1000.0001, -200.222]])
  })
  it('parses a points array correctly to string', function () {
    var array = new SVGJS.PointArray([[0, .15], [-100, -3.141592654], [50, 100]])

    expect(array + '').toBe('0,0.15 -100,-3.141592654 50,100')
  })
  it('parses a flat array of x/y coordinates to a point array', function () {
    var array = new SVGJS.PointArray([1, 4, 5, 68, 12, 24])

    expect(array.valueOf()).toEqual([[1, 4], [5, 68], [12, 24]])
  })
  it('parses points with space delimitered x/y coordinates', function () {
    var array = new SVGJS.PointArray('221.08 191.79 0.46 191.79 0.46 63.92 63.8 0.46 284.46 0.46 284.46 128.37 221.08 191.79')

    expect(array + '').toBe('221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79')
  })
  it('parses points with comma delimitered x/y coordinates', function () {
    var array = new SVGJS.PointArray('221.08,191.79,0.46,191.79,0.46,63.92,63.8,0.46,284.46,0.46,284.46,128.37,221.08,191.79')

    expect(array + '').toBe('221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79')
  })
  it('parses points with comma and space delimitered x/y coordinates', function () {
    var array = new SVGJS.PointArray('221.08, 191.79, 0.46, 191.79, 0.46, 63.92, 63.8, 0.46, 284.46, 0.46, 284.46, 128.37, 221.08, 191.79')

    expect(array + '').toBe('221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79')
  })
  it('parses points with space and comma delimitered x/y coordinates', function () {
    var array = new SVGJS.PointArray('221.08 ,191.79 ,0.46 ,191.79 ,0.46 ,63.92 ,63.8 ,0.46 ,284.46 ,0.46 ,284.46 ,128.37 ,221.08 ,191.79')

    expect(array + '').toBe('221.08,191.79 0.46,191.79 0.46,63.92 63.8,0.46 284.46,0.46 284.46,128.37 221.08,191.79')
  })
  it('parses points with redundant spaces at the end', function () {
    var array = new SVGJS.PointArray('2176.6,1708.8 2176.4,1755.8 2245.8,1801.5 2297,1787.8  ')

    expect(array + '').toBe('2176.6,1708.8 2176.4,1755.8 2245.8,1801.5 2297,1787.8')
  })
  it('parses points with space delimitered x/y coordinates - even with leading or trailing space', function () {
    var array = new SVGJS.PointArray('  1 2 3 4  ')

    expect(array + '').toBe('1,2 3,4')
  })
  it('parses odd number of points with space delimitered x/y coordinates and silently remove the odd point', function () {
    // this  is according to spec: https://svgwg.org/svg2-draft/shapes.html#DataTypePoints

    var array = new SVGJS.PointArray('1 2 3')

    expect(array + '').toBe('1,2')
  })
  it('parses odd number of points in a flat array of x/y coordinates and silently remove the odd point', function () {
    // this  is according to spec: https://svgwg.org/svg2-draft/shapes.html#DataTypePoints

    var array = new SVGJS.PointArray([1, 2, 3])

    expect(array.valueOf()).toEqual([[1, 2]])
  })

  describe('size()', function () {
    it('correctly sizes the points over the whole area', function () {
      var array = new SVGJS.PointArray([10, 10, 20, 20, 30, 30])
      expect(array.size(60, 60).valueOf()).toEqual([[10, 10], [40, 40], [70, 70]])
    })

    it('let coordinates untouched when width/height is zero', function () {
      var array = new SVGJS.PointArray([10, 10, 10, 20, 10, 30])
      expect(array.size(60, 60).valueOf()).toEqual([[10, 10], [10, 40], [10, 70]])

      array = new SVGJS.PointArray([10, 10, 20, 10, 30, 10])
      expect(array.size(60, 60).valueOf()).toEqual([[10, 10], [40, 10], [70, 10]])
    })

  })
})

describe('PathArray', function () {
  var p1: SVGJS.PathArray, p2: SVGJS.PathArray, p3: SVGJS.PathArray, p4: SVGJS.PathArray, p5: SVGJS.PathArray, p6: SVGJS.PathArray, p7: SVGJS.PathArray

  beforeEach(function () {
    p1 = new SVGJS.PathArray('m10 10 h 80 v 80 h -80 l 300 400 z')
    p2 = new SVGJS.PathArray('m10 80 c 40 10 65 10 95 80 s 150 150 180 80 t 300 300 q 52 10 95 80 z')
    p3 = new SVGJS.PathArray('m80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 z')
    p4 = new SVGJS.PathArray('M215.458,245.23c0,0,77.403,0,94.274,0S405,216.451,405,138.054S329.581,15,287.9,15c-41.68,0-139.924,0-170.688,0C86.45,15,15,60.65,15,134.084c0,73.434,96.259,112.137,114.122,112.137C146.984,246.221,215.458,245.23,215.458,245.23z')
    p5 = new SVGJS.PathArray('M10 10-45-30.5.5 .89L2e-2.5.5.5-.5C.5.5.5.5.5.5L-3-4z')
    p6 = new SVGJS.PathArray('m 0,0 0,3189 2209,0 0,-3189 -2209,0 z m 154,154 1901,0 0,2881 -1901,0 0,-2881 z')

  })

  it('converts to absolute values', function () {
    expect(p1.toString()).toBe('M10 10H90V90H10L310 490Z ')
    expect(p2.toString()).toBe('M10 80C50 90 75 90 105 160S255 310 285 240T585 540Q637 550 680 620Z ')
    expect(p3.toString()).toBe('M80 80A45 45 0 0 0 125 125L125 80Z ')
    expect(p4.toString()).toBe('M215.458 245.23C215.458 245.23 292.861 245.23 309.73199999999997 245.23S405 216.451 405 138.054S329.581 15 287.9 15C246.21999999999997 15 147.97599999999997 15 117.21199999999999 15C86.45 15 15 60.65 15 134.084C15 207.518 111.259 246.221 129.122 246.221C146.984 246.221 215.458 245.23 215.458 245.23Z ')
    expect(p6.toString()).toBe('M0 0L0 3189L2209 3189L2209 0L0 0ZM154 154L2055 154L2055 3035L154 3035L154 154Z ')
  })

  it('parses difficult syntax correctly', function () {
    expect(p5.toString()).toBe('M10 10L-45 -30.5L0.5 0.89L0.02 0.5L0.5 -0.5C0.5 0.5 0.5 0.5 0.5 0.5L-3 -4Z ')
  })

  it('parses flat arrays correctly', function () {
    p6 = new SVGJS.PathArray(['M', 0, 0, 'L', 100, 100, 'z'])
    expect(p6.toString()).toBe('M0 0L100 100Z ')
  })

  it('parses nested arrays correctly', function () {
    p7 = new SVGJS.PathArray([['M', 0, 0], ['L', 100, 100], ['z']])
    expect(p7.toString()).toBe('M0 0L100 100Z ')
  })

  // this test is designed to cover a certain line but it doesnt work because of #608
  it('returns the valueOf when PathArray is given', function () {
    var p = new SVGJS.PathArray('m10 10 h 80 v 80 h -80 l 300 400 z')

    expect((new SVGJS.PathArray(p))).toEqual(p)
  })

  it('can handle all formats which can be used', function () {
    // when no command is specified after move, line is used automatically (specs say so)
    expect(new SVGJS.PathArray('M10 10 80 80 30 30 Z').toString()).toBe('M10 10L80 80L30 30Z ')

    // parsing can handle 0.5.3.3.2 stuff
    expect(new SVGJS.PathArray('M10 10L.5.5.3.3Z').toString()).toBe('M10 10L0.5 0.5L0.3 0.3Z ')
  })

  describe('move()', function () {
    it('moves all points in a straight path', function () {
      expect(p1.move(100, 200).toString()).toBe('M100 200H180V280H100L400 680Z ')
    })
    it('moves all points in a curved path', function () {
      expect(p2.move(100, 200).toString()).toBe('M100 200C140 210 165 210 195 280S345 430 375 360T675 660Q727 670 770 740Z ')
    })
    it('moves all points in a arc path', function () {
      expect(p3.move(100, 200).toString()).toBe('M100 200A45 45 0 0 0 145 245L145 200Z ')
    })
  })

  describe('size()', function () {
    it('resizes all points in a straight path', function () {
      expect(p1.size(600, 200).toString()).toBe('M10 10H170V43.333333333333336H10L610 210Z ')
    })
    it('resizes all points in a curved path', function () {
      expect(p2.size(600, 200).toString()).toBe('M10 80C45.82089552238806 83.70370370370371 68.2089552238806 83.70370370370371 95.07462686567165 109.62962962962963S229.40298507462686 165.1851851851852 256.2686567164179 139.25925925925927T524.9253731343283 250.37037037037038Q571.4925373134329 254.07407407407408 610 280Z ')
    })
    it('resizes all points in a arc path', function () {
      var expected = [
        ['M', 80, 80],
        ['A', 600, 200, 0, 0, 0, 680, 280],
        ['L', 680, 80],
        ['Z']
      ]

      var toBeTested = p3.size(600, 200)

      for (var i = toBeTested.length; i--;) {
        expect((toBeTested[i].shift() as string).toUpperCase()).toBe((expected[i].shift() as string).toUpperCase())
        for (var j = toBeTested[i].length; j--;) {
          expect(toBeTested[i][j]).toBeCloseTo(expected[i][j] as number)
        }
      }
    })
  })

  describe('equalCommands()', function () {
    it('return true if the passed path array use the same commands', function () {
      var pathArray1 = new SVGJS.PathArray('m -1500,-478 a 292,195 0 0 1 262,205 l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')
        , pathArray2 = new SVGJS.PathArray('m  -680, 527 a 292,195 0 0 1 262,205 l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')

      expect(pathArray1.equalCommands(pathArray2)).toBe(true)
    })
    it('return false if the passed path array does not use the same commands', function () {
      var pathArray1 = new SVGJS.PathArray('m -1500,-478 a 292,195 0 0 1 262,205   l -565,319 c 0,0 -134,-374 51,-251 185,122 251,-273 251,-273 z')
        , pathArray2 = new SVGJS.PathArray('m - 663, 521 c 147,178 118,-25 245,210 l -565,319 c 0,0 -134,-374 51,-251 185,122 268,-278 268,-278 z')

      expect(pathArray1.equalCommands(pathArray2)).toBe(false)
    })
  })

})
