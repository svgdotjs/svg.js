describe('Number', function() {
  var number

  beforeEach(function() {
    number = new SVG.Number
  })

  describe('new', function() {
    it('is zero', function() {
      expect(number.value).toBe(0)
    })
    it('has a blank unit', function() {
      expect(number.unit).toBe('')
    })
    it('parses a pixel value', function() {
      number = new SVG.Number('20px')
      expect(number.value).toBe(20)
      expect(number.unit).toBe('px')
    })
    it('parses a percent value', function() {
      number = new SVG.Number('99%')
      expect(number.value).toBe(0.99)
      expect(number.unit).toBe('%')
    })
    it('parses a seconds value', function() {
      number = new SVG.Number('2s')
      expect(number.value).toBe(2000)
      expect(number.unit).toBe('s')
    })
    it('parses a negative percent value', function() {
      number = new SVG.Number('-89%')
      expect(number.value).toBe(-0.89)
      expect(number.unit).toBe('%')
    })
    it('falls back to 0 if given value is NaN', function() {
      number = new SVG.Number(NaN)
      expect(number.value).toBe(0)
    })
    it('falls back to maximum value if given number is positive infinite', function() {
      number = new SVG.Number(1.7976931348623157E+10308)
      expect(number.value).toBe(3.4e+38)
    })
    it('falls back to minimum value if given number is negative infinite', function() {
      number = new SVG.Number(-1.7976931348623157E+10308)
      expect(number.value).toBe(-3.4e+38)
    })
  })

  describe('toString()', function() {
    it('converts the number to a string', function() {
      expect(number.toString()).toBe('0')
    })
    it('appends the unit', function() {
      number.value = 1.21
      number.unit = 'px' 
      expect(number.toString()).toBe('1.21px')
    })
    it('converts percent values properly', function() {
      number.value = 1.36
      number.unit = '%' 
      expect(number.toString()).toBe('136%')
    })
    it('converts second values properly', function() {
      number.value = 2500
      number.unit = 's' 
      expect(number.toString()).toBe('2.5s')
    })
  })

  describe('valueOf()', function() {
    it('returns a numeric value for default units', function() {
      expect(typeof number.valueOf()).toBe('number')
      number = new SVG.Number('12')
      expect(typeof number.valueOf()).toBe('number')
      number = new SVG.Number(13)
      expect(typeof number.valueOf()).toBe('number')
    })
    it('returns a numeric value for pixel units', function() {
      number = new SVG.Number('10px')
      expect(typeof number.valueOf()).toBe('number')
    })
    it('returns a numeric value for percent units', function() {
      number = new SVG.Number('20%')
      expect(typeof number.valueOf()).toBe('number')
    })
    it('converts to a primitive when multiplying', function() {
      number.value = 80
      expect(number * 4).toBe(320)
    })
  })

  describe('to()', function() {
    beforeEach(function() {
      number.plus(4)
    })
    it('changes the unit value', function() {
      number.to('%')
      expect(number.unit).toBe('%')
    })
    it('changes the output value', function() {
      var oldNumber = number.valueOf()
      number.to('%')
      expect(number.toString()).toBe('400%')
    })
  })

  describe('plus()', function() {
    it('adds a given number', function() {
      number.plus(3.5)
      expect(number.valueOf()).toBe(3.5)
    })
    it('adds a given percentage value', function() {
      number.plus('225%')
      expect(number.valueOf()).toBe(2.25)
    })
    it('adds a given pixel value', function() {
      number.plus('83px')
      expect(number.valueOf()).toBe(83)
    })
  })

  describe('minus()', function() {
    it('subtracts a given number', function() {
      number.minus(3.7)
      expect(number.valueOf()).toBe(-3.7)
    })
    it('subtracts a given percentage value', function() {
      number.minus('223%')
      expect(number.valueOf()).toBe(-2.23)
    })
    it('subtracts a given pixel value', function() {
      number.minus('85px')
      expect(number.valueOf()).toBe(-85)
    })
  })

  describe('times()', function() {
    beforeEach(function() {
      number.plus(4)
    })
    it('multiplies with a given number', function() {
      number.times(3)
      expect(number.valueOf()).toBe(12)
    })
    it('multiplies with a given percentage value', function() {
      number.times('110%')
      expect(number.valueOf()).toBe(4.4)
    })
    it('multiplies with a given pixel value', function() {
      number.times('85px')
      expect(number.valueOf()).toBe(340)
    })
  })

  describe('divide()', function() {
    beforeEach(function() {
      number.plus(90)
    })
    it('divides by a given number', function() {
      number.divide(3)
      expect(number.valueOf()).toBe(30)
    })
    it('divides by a given percentage value', function() {
      number.divide('3000%')
      expect(number.valueOf()).toBe(3)
    })
    it('divides by a given pixel value', function() {
      number.divide('45px')
      expect(number.valueOf()).toBe(2)
    })
  })

  describe('morph()', function() {
    it('prepares the color for morphing', function() {
      var destination = new SVG.Number
      number.morph(destination)
      expect(number.destination).toEqual(destination)
    })
  })

  describe('at()', function() {
    it('morphes number to a given position', function() {
      var destination = new SVG.Number(200)
      var morphed = number.morph(destination).at(0.4)
      expect(morphed.valueOf()).toBe(80)
    })
    it('morphes number to a given percentage position', function() {
      var destination = new SVG.Number('100%')
      var morphed = number.morph(destination).at(0.72)
      expect(morphed.toString()).toBe('72%')
    })
  })

})












