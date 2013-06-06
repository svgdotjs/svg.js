describe('Color', function() {

	it('should correclty parse a rgb string', function() {
		var color = new SVG.Color('rgb(255,0,128)')
		expect(color.r).toBe(255)
		expect(color.g).toBe(0)
		expect(color.b).toBe(128)
	})
	
	it('should correclty parse a 3-based hex string', function() {
		var color = new SVG.Color('#f06')
		expect(color.r).toBe(255)
		expect(color.g).toBe(0)
		expect(color.b).toBe(102)
	})

	it('should correclty parse a 6-based hex string', function() {
		var color = new SVG.Color('#0066ff')
		expect(color.r).toBe(0)
		expect(color.g).toBe(102)
		expect(color.b).toBe(255)
	})

})