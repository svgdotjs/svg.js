describe('Color', function() {

	it('correclty parses a rgb string', function() {
		var color = new SVG.Color('rgb(255,0,128)')
		expect(color.r).toBe(255)
		expect(color.g).toBe(0)
		expect(color.b).toBe(128)
	})
	
	it('correclty parses a 3 digit hex string', function() {
		var color = new SVG.Color('#f06')
		expect(color.r).toBe(255)
		expect(color.g).toBe(0)
		expect(color.b).toBe(102)
	})

	it('correclty parses a 6 digit hex string', function() {
		var color = new SVG.Color('#0066ff')
		expect(color.r).toBe(0)
		expect(color.g).toBe(102)
		expect(color.b).toBe(255)
	})

})