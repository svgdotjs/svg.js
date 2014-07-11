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
			it('parses translation values', function() {
				expect(matrix.x).toBe(0)
				expect(matrix.y).toBe(0)
			})
			it('parses skew values', function() {
				expect(matrix.skewX).toBe(0)
				expect(matrix.skewY).toBe(0)
			})
			it('parses scale values', function() {
				expect(matrix.scaleX).toBe(1)
				expect(matrix.scaleY).toBe(1)
			})
			it('parses rotaton value', function() {
				expect(matrix.rotation).toBe(0)
			})
		})

		describe('with an element given', function() {
			
			beforeEach(function() {
				matrix = new SVG.Matrix(draw.rect(100, 100).skew(10, 20).translate(50, 50).scale(3, 2))
			})

			it('parses the current transform matrix form an element', function() {
				expect(matrix.a).toBe(1)
				expect(matrix.b).toBe(0)
				expect(matrix.c).toBe(0)
				expect(matrix.d).toBe(1)
				expect(matrix.e).toBe(0)
				expect(matrix.f).toBe(0)
			})
		})
	})

})







