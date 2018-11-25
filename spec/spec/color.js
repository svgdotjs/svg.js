
describe('Color', function() {
	var color

	beforeEach(function() {
		color = new SVG.Color({ r: 0, g: 102, b: 255 })
	})

	describe ('construct: constructs a color in different formats', () => {

		it ('constructs a color from an object in the correct color space')

		it ('constructs a color from an array', () => {
			let color = new SVG.Color([ 30, 24, 50 ])
			expect( color.r ).toBe( 30 )
			expect( color.g ).toBe( 24 )
			expect( color.b ).toBe( 50 )

		})

		it('correclty parses an rgb string', () => {
			let color = new SVG.Color('rgb(255,0,128)')
			expect(color.r).toBe(255)
			expect(color.g).toBe(0)
			expect(color.b).toBe(128)
		})

		it('correclty parses a 3 digit hex string', () => {
			color = new SVG.Color('#f06')
			expect(color.r).toBe(255)
			expect(color.g).toBe(0)
			expect(color.b).toBe(102)
		})

		it('correclty parses a 6 digit hex string', () => {
			color = new SVG.Color('#0066ff')
			expect(color.r).toBe(0)
			expect(color.g).toBe(102)
			expect(color.b).toBe(255)
		})

	})

	describe ('input and output: Importing and exporting colors', () => {
		describe('hex()', function() {
			it('returns a hex color', function() {
				expect(color.hex()).toBe('#0066ff')
			})
		})

		describe('toRgb()', function() {
			it('returns a rgb string color', function() {
				expect(color.toRgb()).toBe('rgb(0,102,255)')
			})
		})

		describe('brightness()', function() {
			it('returns the percieved brightness value of a color', function() {
				expect(color.brightness()).toBe(0.346)
			})
		})
	})

	describe('color spaces: The color spaces supported by our library', () => {

		describe('lab()', () => {
			it ('can convert rgb to lab')
			it ('can convert from lab to rgb')
		})

		describe('lch()', () => {
			it ('can convert rgb to lch')
			it ('can convert from lch to rgb')
		})

		describe('hsl()', () => {
			it ('can convert from rgb to hsl')
			it ('can convert from hsl to rgb')
		})

		describe('xyz()', () => {
			it ('can convert from rgb to xyz')
			it ('can convert from xyz to rgb')
		})

		describe('cymk()', () => {
			it ('can convert from rgb to cymk')
			it ('can convert from cymk to rgb')
		})
	})

})
