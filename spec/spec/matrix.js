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
				it('parses rotatoin value', function() {
					expect(extract.rotation).toBe(0)
				})
			})
		})

		describe('with an element given', function() {
			var rect

			beforeEach(function() {
				rect = draw.rect(100, 100)
				matrix = new SVG.Matrix(rect)
			})

			it('parses the current transform matrix form an element', function() {
				rect.rotate(-10).translate(40, 50).scale(2)
				expect(matrix.a).toBe(1.9696155786514282)
				expect(matrix.b).toBe(-0.3472963869571686)
				expect(matrix.c).toBe(0.3472963869571686)
				expect(matrix.d).toBe(1.9696155786514282)
				expect(matrix.e).toBe(-8.373950958251953)
				expect(matrix.f).toBe(7.758301258087158)
			})

			describe('extract()', function() {

				it('parses translation values', function() {
					var extract = new SVG.Matrix(draw.rect(100, 100).translate(40, 50)).extract()
					expect(extract.x).toBe(40)
					expect(extract.y).toBe(50)
				})
				it('parses skewX value', function() {
					var extract = new SVG.Matrix(draw.rect(100, 100).skew(10, 0)).extract()
					expect(approximately(extract.skewX, 0.01)).toBe(10)
				})
				it('parses skewX value', function() {
					var extract = new SVG.Matrix(draw.rect(100, 100).skew(0, 20)).extract()
					expect(approximately(extract.skewY, 0.01)).toBe(20)
				})
				it('parses scale values', function() {
					var extract = new SVG.Matrix(draw.rect(100, 100).scale(2, 3)).extract()
					expect(extract.scaleX).toBe(2)
					expect(extract.scaleY).toBe(3)
				})
				it('parses rotatoin value', function() {
					var extract = new SVG.Matrix(draw.rect(100, 100).rotate(-100)).extract()
					expect(approximately(extract.rotation, 0.01)).toBe(-100)
				})

			})
			
		})
	})

	describe('native()', function() {
	  it('returns the node reference', function() {
	    expect(new SVG.Matrix().native() instanceof SVGMatrix).toBeTruthy()
	  })
	})

})







