describe('TextPath', function() {
	var text
		, data = 'M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'

	beforeEach(function() {
		text = draw.text('We go up, then we go down, then up again')
	})

	afterEach(function() {
		draw.clear() 
	})

	describe('path()', function() {
		it('returns the text element', function() {
			expect(text.path(data)).toBe(text)
		})
		it('stores a reference to the path', function() {
			expect(text.path(data).track instanceof SVG.Path).toBe(true)
		})
		it('creates a textPath node in th text element', function() {
			text.path(data)
			expect(text.node.firstChild.nodeName).toBe('textPath')
		})
		it('stores a reference to the textPath', function() {
			expect(text.path(data).textPath instanceof SVG.TextPath).toBe(true)
		})
	})

})