describe('Point', function() {
  var point

  describe('initialization', function() {

    describe('without a source', function() {

      beforeEach(function() {
        point = new SVG.Point
      })

      it('creates a new point with default values', function() {
        expect(point.x).toBe(0)
        expect(point.y).toBe(0)
      })

    })

    describe('with x and y given', function() {
      it('creates a point with given values', function() {
        var point = new SVG.Point(2,4)

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })

    describe('with only x given', function() {
      it('creates a point using the given value for both x and y', function() {
        var point = new SVG.Point(7)

        expect(point.x).toBe(7)
        expect(point.y).toBe(7)
      })
    })

    describe('with array given', function() {
      it('creates a point from array', function() {
        var point = new SVG.Point([2,4])

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })

    describe('with object given', function() {
      it('creates a point from object', function() {
        var point = new SVG.Point({x:2,y:4})

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })

    describe('with SVG.Point given', function() {
      it('creates a point from SVG.Point', function() {
        var point = new SVG.Point(new SVG.Point(2,4))

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })

    describe('with native SVGPoint given', function() {
      it('creates a point from native SVGPoint', function() {
        var point = new SVG.Point(new SVG.Point(2,4).native())

        expect(point.x).toBe(2)
        expect(point.y).toBe(4)
      })
    })

  })

  describe('clone()', function() {
    it('returns cloned point', function() {
      var point1 = new SVG.Point(1,1)
        , point2 = new SVG.Point(point1)

      expect(point1).toEqual(point2)
      expect(point1).not.toBe(point2)
    })
  })

  describe('morph()', function() {
    it('stores a given point for morphing', function() {
      var point1 = new SVG.Point(1,1)
        , point2 = new SVG.Point(2,2)

      point1.morph(point2)

      expect(point1.destination).toEqual(point2)
    })
    it('stores a clone, not the given matrix itself', function() {
      var point1 = new SVG.Point(1,1)
        , point2 = new SVG.Point(2,2)

      point1.morph(point2)

      expect(point1.destination).not.toBe(point2)
    })
    it('allow passing the point by directly passing its coordinates', function() {
      var point1 = new SVG.Point(1,1)
        , point2 = new SVG.Point(2,2)

      point1.morph(point2.x, point2.y)

      expect(point1.destination).toEqual(point2)
    })
  })

  describe('at()', function() {
    it('returns a morphed point at a given position', function() {
      var point1 = new SVG.Point(1,1)
        , point2 = new SVG.Point(2,2)
        , point3 = point1.morph(point2).at(0.5)

      expect(point3).toEqual(new SVG.Point(1.5, 1.5))
    })
  })

  describe('transform()', function() {
    it('returns a point transformed with given matrix', function() {
      var point = new SVG.Point(1,5)
        , matrix = new SVG.Matrix(0,0,1,0,0,1)

      expect(point.transform(matrix)).toEqual(new SVG.Point(5,1))
    })
  })

  describe('native()', function() {
    it('returns native SVGPoint', function() {
      expect(new SVG.Point().native() instanceof SVGPoint).toBeTruthy()
    })
  })

  describe('toArray()', function() {
    it('return an array of the x and y coordinates', function() {
      var point = new SVG.Point(2,-13)
      expect(point.toArray()).toEqual([point.x, point.y])
    })
  })

  describe('plus()', function() {
    it('perform an element-wise addition with the passed point', function() {
      var point1 = new SVG.Point(4,3)
        , point2 = new SVG.Point(2,5)
        , point3 = point1.plus(point2)

      expect(point3).toEqual(new SVG.Point(point1.x + point2.x, point1.y + point2.y))
    })
    it('allow passing the point by directly passing its coordinates', function() {
      var point1 = new SVG.Point(4,3)
      , point2 = new SVG.Point(2,5)
      , point3 = point1.plus(point2.x, point2.y)

      expect(point3).toEqual(new SVG.Point(point1.x + point2.x, point1.y + point2.y))
    })
    it('perform an element-wise addition with the passed number', function() {
      var point1 = new SVG.Point(4,3)
        , number = 6
        , point2 = point1.plus(number)

      expect(point2).toEqual(new SVG.Point(point1.x + number, point1.y + number))
    })
  })

  describe('minus()', function() {
    it('perform an element-wise subtraction with the passed point', function() {
      var point1 = new SVG.Point(4,3)
        , point2 = new SVG.Point(2,5)
        , point3 = point1.minus(point2)

      expect(point3).toEqual(new SVG.Point(point1.x - point2.x, point1.y - point2.y))
    })
    it('allow passing the point by directly passing its coordinates', function() {
      var point1 = new SVG.Point(4,3)
      , point2 = new SVG.Point(2,5)
      , point3 = point1.minus(point2.x, point2.y)

      expect(point3).toEqual(new SVG.Point(point1.x - point2.x, point1.y - point2.y))
    })
    it('perform an element-wise subtraction with the passed number', function() {
      var point1 = new SVG.Point(4,3)
        , number = 6
        , point2 = point1.minus(number)

      expect(point2).toEqual(new SVG.Point(point1.x - number, point1.y - number))
    })
  })

  describe('times()', function() {
    it('perform an element-wise multiplication with the passed point', function() {
      var point1 = new SVG.Point(4,3)
        , point2 = new SVG.Point(2,5)
        , point3 = point1.times(point2)

      expect(point3).toEqual(new SVG.Point(point1.x * point2.x, point1.y * point2.y))
    })
    it('allow passing the point by directly passing its coordinates', function() {
      var point1 = new SVG.Point(4,3)
      , point2 = new SVG.Point(2,5)
      , point3 = point1.times(point2.x, point2.y)

      expect(point3).toEqual(new SVG.Point(point1.x * point2.x, point1.y * point2.y))
    })
    it('perform an element-wise multiplication with the passed number', function() {
      var point1 = new SVG.Point(4,3)
        , number = 6
        , point2 = point1.times(number)

      expect(point2).toEqual(new SVG.Point(point1.x * number, point1.y * number))
    })
  })

  describe('divide()', function() {
    it('perform an element-wise division with the passed point', function() {
      var point1 = new SVG.Point(4,3)
        , point2 = new SVG.Point(2,5)
        , point3 = point1.divide(point2)

      expect(point3).toEqual(new SVG.Point(point1.x / point2.x, point1.y / point2.y))
    })
    it('allow passing the point by directly passing its coordinates', function() {
      var point1 = new SVG.Point(4,3)
      , point2 = new SVG.Point(2,5)
      , point3 = point1.divide(point2.x, point2.y)

      expect(point3).toEqual(new SVG.Point(point1.x / point2.x, point1.y / point2.y))
    })
    it('perform an element-wise division with the passed number', function() {
      var point1 = new SVG.Point(4,3)
        , number = 6
        , point2 = point1.divide(number)

      expect(point2).toEqual(new SVG.Point(point1.x / number, point1.y / number))
    })
  })

  describe('norm()', function() {
    it('calculate the Euclidean norm', function() {
      var point = new SVG.Point(-2,12)
      expect(point.norm()).toBe(Math.sqrt(point.x*point.x + point.y*point.y))
    })
  })

  describe('distance()', function() {
    it('calculate the distance to the passed point', function() {
      var point1 = new SVG.Point(-6,-20)
        , point2 = new SVG.Point(8,18)

      expect(point1.distance(point2)).toBe(Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)))
    })
    it('allow passing the point by directly passing its coordinates', function() {
      var point1 = new SVG.Point(-6,-20)
        , point2 = new SVG.Point(8,18)

      expect(point1.distance(point2.x, point2.y)).toBe(Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)))
    })
  })
})
