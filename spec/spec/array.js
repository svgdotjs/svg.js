describe('Array', function () {
	var array

	it('parses a matrix array correctly to string', function() {
		array = new SVG.Array([ .343,  .669, .119, 0,   0 
					 										, .249, -.626, .130, 0,   0
					 										, .172,  .334, .111, 0,   0
					 										, .000,  .000, .000, 1,  -0 ])

		expect(array + '').toBe('0.343 0.669 0.119 0 0 0.249 -0.626 0.13 0 0 0.172 0.334 0.111 0 0 0 0 0 1 0')
	})
	describe('reverse()', function() {
		it('reverses the array', function() {
			array = new SVG.Array([1 ,2 ,3, 4, 5]).reverse()
			expect(array.value).toEqual([5, 4, 3, 2, 1])
		})
		it('returns itself', function() {
			array = new SVG.Array()
			expect(array.reverse()).toBe(array)
		})
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

describe('PathArray', function () {
	var p1, p2, p3

	beforeEach(function() {
		p1 = new SVG.PathArray('m10 10 h 80 v 80 h -80 l 300 400 z')
		p2 = new SVG.PathArray('m10 80 c 40 10 65 10 95 80 s 150 150 180 80 t 300 300 q 52 10 95 80 z')
		p3 = new SVG.PathArray('m80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 z')
	})

	it('converts to absolute values', function() {
		expect(p1.toString()).toBe('M10 10H90V90H10L310 490Z ')
		expect(p2.toString()).toBe('M10 80C50 90 75 90 105 160S255 310 285 240T585 540Q637 550 680 620Z ')
		expect(p3.toString()).toBe('M80 80A45 45 0 0 0 125 125L125 80Z ')
	})

	describe('move()', function() {
		it('moves all points in a straight path', function() {
			expect(p1.move(100,200).toString()).toBe('M100 200H180V280H100L400 680Z ')
		})
		it('moves all points in a curved path', function() {
			expect(p2.move(100,200).toString()).toBe('M100 200C140 210 165 210 195 280S345 430 375 360T675 660Q727 670 770 740Z ')
		})
		it('moves all points in a arc path', function() {
			expect(p3.move(100,200).toString()).toBe('M100 200A45 45 0 0 0 145 245L145 200Z ')
		})
	})

	describe('size()', function() {
		it('resizes all points in a straight path', function() {
			expect(p1.size(600,200).toString()).toBe('M10 10H170V43.333333333333336H10L610 210Z ')
		})
		it('resizes all points in a curved path', function() {
			expect(p2.size(600,200).toString()).toBe('M10 80C45.82089552238806 83.70370370370371 68.2089552238806 83.70370370370371 95.07462686567165 109.62962962962963S229.40298507462686 165.1851851851852 256.2686567164179 139.25925925925927T524.9253731343283 250.37037037037038Q571.4925373134329 254.07407407407408 610 280Z ')
		})
		it('resizes all points in a arc path', function() {
			expect(p3.size(600,200).toString()).toBe('M80 80A599.9998982747568 199.9999660915856 0 0 0 679.9998982747568 279.99996609158563L679.9998982747568 80Z ')
		})
	})

})