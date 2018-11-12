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
      it('sets the y value to 0', function() {
        var point = new SVG.Point(7)

        expect(point.x).toBe(7)
        expect(point.y).toBe(0)
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
  })

  describe('clone()', function() {
    it('returns cloned point', function() {
      var point1 = new SVG.Point(1,1)
        , point2 = point1.clone()

      expect(point1).toEqual(point2)
      expect(point1).not.toBe(point2)
    })
  })
})
