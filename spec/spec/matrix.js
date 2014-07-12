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

			describe('extract()', function() {
				var extract

				beforeEach(function() {
					extract = matrix.extract()
				})

				it('parses translation values', function() {
					expect(extract.x).toBe(0)
					expect(extract.y).toBe(0)
				})
				it('parses skew values', function() {
					expect(extract.skewX).toBe(0)
					expect(extract.skewY).toBe(0)
				})
				it('parses scale values', function() {
					expect(extract.scaleX).toBe(1)
					expect(extract.scaleY).toBe(1)
				})
				it('parses rotaton value', function() {
					expect(extract.rotation).toBe(0)
				})
			})
		})

		describe('with an element given', function() {
			
			beforeEach(function() {
				matrix = new SVG.Matrix(draw.rect(100, 100).skew(10, 20).translate(40, 50).scale(3, 2))
			})

			it('parses the current transform matrix form an element', function() {
				expect(matrix.a).toBe(3.192533254623413)
				expect(matrix.b).toBe(1.091910719871521)
				expect(matrix.c).toBe(0.35265403985977173)
				expect(matrix.d).toBe(2)
				expect(matrix.e).toBe(51.383460998535156)
				expect(matrix.f).toBe(64.55880737304688)
			})
			
		})
	})

	describe('native()', function() {
	  it('returns the node reference', function() {
	    expect(new SVG.Matrix().native() instanceof SVGMatrix).toBeTruthy()
	  })
	})

})







