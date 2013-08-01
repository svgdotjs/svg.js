describe('Array', function () {

	it('parses a matrix array correctly to string', function() {
		var array = new SVG.Array([ .343,  .669, .119, 0,   0 
					 										, .249, -.626, .130, 0,   0
					 										, .172,  .334, .111, 0,   0
					 										, .000,  .000, .000, 1,  -0 ])

		expect(array + '').toBe('0.343 0.669 0.119 0 0 0.249 -0.626 0.13 0 0 0.172 0.334 0.111 0 0 0 0 0 1 0')
	})

})


describe('PointArray', function () {

	it('parses a string to a point array', function() {
		var array = new SVG.PointArray('0,1 -.05,7.95 1000.0001,-200.222')

		expect(array.valueOf()).toEqual([[0, 1], [-0.05, 7.95], [1000.0001, -200.222]])
	})

	it('parses a points array correctly to string', function() {
		var array = new SVG.PointArray([[0,.15], [-100,-3.141592654], [50,100]])

		expect(array + '').toBe('0,0.15 -100,-3.141592654 50,100')
	})

})