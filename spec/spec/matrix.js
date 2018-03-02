describe('Matrix', function() {
  var matrix

  describe('initialization', function() {

    describe('without a source', function() {

      beforeEach(function() {
        matrix = new SVG.Matrix
      })

      it('creates a new matrix with default values', function() {
        expect(matrix.a).toBe(1)
        expect(matrix.b).toBe(0)
        expect(matrix.c).toBe(0)
        expect(matrix.d).toBe(1)
        expect(matrix.e).toBe(0)
        expect(matrix.f).toBe(0)
      })

      describe('decompose()', function() {
        var decompose

        beforeEach(function() {
          decompose = matrix.decompose()
        })

        it('parses translation values', function() {
          expect(decompose.translateX).toBe(0)
          expect(decompose.translateY).toBe(0)
        })
        it('parses shear values', function() {
          expect(decompose.shear).toBe(0)
        })
        it('parses scale values', function() {
          expect(decompose.scaleX).toBe(1)
          expect(decompose.scaleY).toBe(1)
        })
        it('parses rotatoin value', function() {
          expect(decompose.rotate).toBe(0)
        })
      })

      describe('toString()' , function() {
        it('exports correctly to a string', function() {
          expect(matrix.toString()).toBe('matrix(1,0,0,1,0,0)')
        })
      })
    })

    describe('with an element given', function() {
      var rect

      beforeEach(function() {
        // Draw is defined in helpers
        rect = draw.rect(100, 100)
          .transform({
            rotate: -10,
            translate: [40, 50],
            scale: 2,
          })
        matrix = new SVG.Matrix(rect)
      })

      it('parses the current transform matrix from an element', function() {

        expect(matrix.a).toBeCloseTo(1.969615506024416)
        expect(matrix.b).toBeCloseTo(-0.34729635533386066)
        expect(matrix.c).toBeCloseTo(0.34729635533386066)
        expect(matrix.d).toBeCloseTo(1.969615506024416)
        expect(matrix.e).toBeCloseTo(-25.84559306791384)
        expect(matrix.f).toBeCloseTo(18.884042465472234)
      })

    })

    describe('with a string given', function() {
      it('parses the string value correctly', function() {
        var matrix = new SVG.Matrix('2, 0, 0, 2, 100, 50')

        expect(matrix.a).toBe(2)
        expect(matrix.b).toBe(0)
        expect(matrix.c).toBe(0)
        expect(matrix.d).toBe(2)
        expect(matrix.e).toBe(100)
        expect(matrix.f).toBe(50)
      })
    })

    describe('with an array given', function() {
      it('parses the array correctly', function() {
        var matrix = new SVG.Matrix([2, 0, 0, 2, 100, 50])

        expect(matrix.a).toBe(2)
        expect(matrix.b).toBe(0)
        expect(matrix.c).toBe(0)
        expect(matrix.d).toBe(2)
        expect(matrix.e).toBe(100)
        expect(matrix.f).toBe(50)
      })
    })

    describe('with an object given', function() {
      it('parses the object correctly', function() {
        var matrix = new SVG.Matrix({a:2, b:0, c:0, d:2, e:100, f:50})

        expect(matrix.a).toBe(2)
        expect(matrix.b).toBe(0)
        expect(matrix.c).toBe(0)
        expect(matrix.d).toBe(2)
        expect(matrix.e).toBe(100)
        expect(matrix.f).toBe(50)
      })
    })

    describe('with 6 arguments given', function() {
      it('parses the arguments correctly', function() {
        var matrix = new SVG.Matrix(2, 0, 0, 2, 100, 50)

        expect(matrix.a).toBe(2)
        expect(matrix.b).toBe(0)
        expect(matrix.c).toBe(0)
        expect(matrix.d).toBe(2)
        expect(matrix.e).toBe(100)
        expect(matrix.f).toBe(50)
      })
    })

  })

  describe('clone()', function() {
    it('returns a clone of the matrix', function() {
      var matrix = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , clone = matrix.clone()
      expect(matrix).not.toBe(clone)
      for(var i in 'abcdef') {
        expect(matrix[i]).toEqual(clone[i])
      }
    })
  })

  describe('morph()', function() {
    it('stores a given matrix for morphing', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = new SVG.Matrix(1, 0, 0, 1, 4, 3)

      matrix1.morph(matrix2)

      expect(matrix1.destination).toEqual(matrix2)
    })
    it('stores a clone, not the given matrix itself', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = new SVG.Matrix(1, 0, 0, 1, 4, 3)

      matrix1.morph(matrix2)

      expect(matrix1.destination).not.toBe(matrix2)
    })
  })

  describe('at()', function() {
    it('returns a morphed array at a given position', function() {
      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 0, 0)
        , matrix2 = new SVG.Matrix(1, 0, 0, 1, 4, 3)
        , matrix3 = matrix1.morph(matrix2).at(0.5)

      expect(matrix1.toString()).toBe('matrix(2,0,0,5,0,0)')
      expect(matrix2.toString()).toBe('matrix(1,0,0,1,4,3)')
      expect(matrix3.toString()).toBe('matrix(1.5,0,0,3,2,1.5)')
    })
    it('returns itself when no destination specified', function() {
      var matrix = new SVG.Matrix(2, 0, 0, 5, 0, 0)
      expect(matrix.at(0.5)).toBe(matrix)
    })
  })

  describe('multiply()', function() {
    it('multiplies two matices', function() {
      var matrix1 = new SVG.Matrix(1, 4, 2, 5, 3, 6)
        , matrix2 = new SVG.Matrix(7, 8, 8, 7, 9, 6)
        , matrix3 = matrix1.multiply(matrix2)

      expect(matrix1.toString()).toBe('matrix(1,4,2,5,3,6)')
      expect(matrix2.toString()).toBe('matrix(7,8,8,7,9,6)')
      expect(matrix3.toString()).toBe('matrix(23,68,22,67,24,72)')
    })

    it('accepts matrices in any form', function() {
      var matrix1 = new SVG.Matrix(1, 4, 2, 5, 3, 6)
        , matrix2 = matrix1.multiply('7,8,8,7,9,6')

      expect(matrix1.toString()).toBe('matrix(1,4,2,5,3,6)')
      expect(matrix2.toString()).toBe('matrix(23,68,22,67,24,72)')
    })
  })

  describe('inverse()', function() {
    it('inverses matrix', function() {

      var matrix1 = new SVG.Matrix(2, 0, 0, 5, 4, 3)
        , matrix2 = matrix1.inverse()
        , abcdef = [0.5,0,0,0.2,-2,-0.6]

      expect(matrix1.toString()).toBe('matrix(2,0,0,5,4,3)')

      for(var i in 'abcdef') {
        expect(matrix2['abcdef'[i]]).toBeCloseTo(abcdef[i])
      }
    })
  })

  describe('translate()', function() {
    it('translates matrix by given x and y values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).translate(10, 12.5)
      expect(matrix.e).toBe(14)
      expect(matrix.f).toBe(15.5)
    })

    it('does nothing if you give it no x or y value', function() {
      var matrix = new SVG.Matrix(1, 2, 3, 4, 5, 6).translate()
      expect(matrix.e).toBe(5)
      expect(matrix.f).toBe(6)
    })
  })

  describe('scale()', function() {
    it('performs a uniformal scale with one value', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).scale(3)

      expect(matrix.a).toBe(3)
      expect(matrix.d).toBe(3)
      expect(matrix.e).toBe(4 * 3)
      expect(matrix.f).toBe(3 * 3)
    })
    it('performs a non-uniformal scale with two values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).scale(2.5, 3.5)

      expect(matrix.a).toBe(2.5)
      expect(matrix.d).toBe(3.5)
      expect(matrix.e).toBe(4 * 2.5)
      expect(matrix.f).toBe(3 * 3.5)
    })
    it('performs a uniformal scale at a given center point with three values', function() {
      var matrix = new SVG.Matrix(1, 3, 2, 3, 4, 3).scale(3, 2, 3)

      expect(matrix.a).toBe(3)
      expect(matrix.b).toBe(9)
      expect(matrix.c).toBe(6)
      expect(matrix.d).toBe(9)
      expect(matrix.e).toBe(8)
      expect(matrix.f).toBe(3)
    })
    it('performs a non-uniformal scale at a given center point with four values', function() {
      var matrix = new SVG.Matrix(1, 3, 2, 3, 4, 3).scale(3, 2, 2, 3)

      expect(matrix.a).toBe(3)
      expect(matrix.b).toBe(6)
      expect(matrix.c).toBe(6)
      expect(matrix.d).toBe(6)
      expect(matrix.e).toBe(8)
      expect(matrix.f).toBe(3)
    })
  })

  describe('rotate()', function() {
    it('performs a rotation with one argument', function() {
      var matrix = new SVG.Matrix(1, 3, 2, 3, 4, 3).rotate(30)

      expect(matrix.a).toBeCloseTo(-0.6339746)
      expect(matrix.b).toBeCloseTo(3.09807621)
      expect(matrix.c).toBeCloseTo(0.23205081)
      expect(matrix.d).toBeCloseTo(3.59807621)
      expect(matrix.e).toBeCloseTo(1.96410162)
      expect(matrix.f).toBeCloseTo(4.59807621)
    })
    it('performs a rotation around a given point with three arguments', function() {
      var matrix = new SVG.Matrix(1, 3, 2, 3, 4, 3).rotate(30, 2, 3)

      expect(matrix.a).toBeCloseTo(-0.633974596216)
      expect(matrix.b).toBeCloseTo(3.09807621135)
      expect(matrix.c).toBeCloseTo(0.232050807569)
      expect(matrix.d).toBeCloseTo(3.59807621135)
      expect(matrix.e).toBeCloseTo(3.73205080757)
      expect(matrix.f).toBeCloseTo(4.0)
    })
  })

  describe('flip()', function() {
    describe('with x given', function() {
      it('performs a flip over the horizontal axis with one argument', function() {
        var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).flip('x')

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(1)
        expect(matrix.e).toBe(-4)
        expect(matrix.f).toBe(3)
      })
      it('performs a flip over the horizontal axis over a given point with two arguments', function() {
        var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).flip('x', 150)

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(1)
        expect(matrix.e).toBe(296)
        expect(matrix.f).toBe(3)
      })
    })
    describe('with y given', function() {
      it('performs a flip over the vertical axis with one argument', function() {
        var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).flip('y')

        expect(matrix.a).toBe(1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(4)
        expect(matrix.f).toBe(-3)
      })
      it('performs a flip over the vertical axis over a given point with two arguments', function() {
        var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).flip('y', 100)

        expect(matrix.a).toBe(1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(4)
        expect(matrix.f).toBe(197)
      })
    })
    describe('with no axis given', function() {
      it('performs a flip over the horizontal and vertical axis with no argument', function() {
        var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).flip()

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(-4)
        expect(matrix.f).toBe(-3)
      })
      it('performs a flip over the horizontal and vertical axis over a given point with one argument that represent both coordinates', function() {
        var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).flip(100)

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(196)
        expect(matrix.f).toBe(197)
      })
      it('performs a flip over the horizontal and vertical axis over a given point with two arguments', function() {
        var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).flip(50, 100)

        expect(matrix.a).toBe(-1)
        expect(matrix.d).toBe(-1)
        expect(matrix.e).toBe(96)
        expect(matrix.f).toBe(197)
      })
    })
  })

  describe('skew()', function() {
    it('performs a uniformal skew with one value', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skew(30)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.57735026919)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(5.73205080757)
      expect(matrix.f).toBeCloseTo(5.30940107676)
    })

    it('performs a non-uniformal skew with two values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skew(30, 20)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.363970234266)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(5.73205080757)
      expect(matrix.f).toBeCloseTo(4.45588093706)
    })

    it('performs a uniformal skew at a given center point with three values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skew(30, 150, 100)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.57735026919)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(-52.0029761114)
      expect(matrix.f).toBeCloseTo(-81.2931393017)
    })

    it('performs a non-uniformal skew at a given center point with four values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skew(30, 20, 150, 100)

      expect(matrix.a).toBe(1.0)
      expect(matrix.b).toBeCloseTo(0.363970234266)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1.0)
      expect(matrix.e).toBeCloseTo(-52.0029761114)
      expect(matrix.f).toBeCloseTo(-50.1396542029)
    })

    it('can be chained', function(){
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skew(20, 30).skew(30, 20)
      expect(matrix.a).toBeCloseTo(1.33333333333)
      expect(matrix.b).toBeCloseTo(0.941320503456)
      expect(matrix.c).toBeCloseTo(0.941320503456)
      expect(matrix.d).toBeCloseTo(1.13247433143)
      expect(matrix.e).toBeCloseTo(8.1572948437)
      expect(matrix.f).toBeCloseTo(7.16270500812)
    })
  })

  describe('skewX', function(){
    it('performs a skew along the x axis with one value', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skewX(30)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBe(0)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(5.73205080757)
      expect(matrix.f).toBe(3)
    })

    it('performs a skew along the x axis at a given center point with three values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skewX(30, 150, 100)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBe(0)
      expect(matrix.c).toBeCloseTo(0.57735026919)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBeCloseTo(-52.0029761114)
      expect(matrix.f).toBe(3)
    })
  })

  describe('skewY', function(){
    it('performs a skew along the y axis with one value', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skewY(30)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.57735026919)
      expect(matrix.c).toBe(0)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBe(4)
      expect(matrix.f).toBeCloseTo(5.30940107676)
    })

    it('performs a skew along the y axis at a given center point with three values', function() {
      var matrix = new SVG.Matrix(1, 0, 0, 1, 4, 3).skewY(30, 150, 100)

      expect(matrix.a).toBe(1)
      expect(matrix.b).toBeCloseTo(0.57735026919)
      expect(matrix.c).toBe(0)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBe(4)
      expect(matrix.f).toBeCloseTo(-81.2931393017)
    })
  })

  describe('native()', function() {
    it('returns the node reference', function() {
      expect(new SVG.Matrix().native() instanceof window.SVGMatrix).toBeTruthy()
    })
  })

})
