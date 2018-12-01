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
    it('accepts the unit as a second argument', function() {
      number = new SVG.Number(30, '%')
      expect(number.value).toBe(30)
      expect(number.unit).toBe('%')
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

  describe('plus()', function() {
    it('returns a new instance', function() {
      expect(number.plus(4.5)).not.toBe(number)
      expect(number.plus(4.5) instanceof SVG.Number).toBeTruthy()
    })
    it('adds a given number', function() {
      expect(number.plus(3.5).valueOf()).toBe(3.5)
    })
    it('adds a given percentage value', function() {
      expect(number.plus('225%').valueOf()).toBe(2.25)
    })
    it('adds a given pixel value', function() {
      expect(number.plus('83px').valueOf()).toBe(83)
    })
    it('use the unit of this number as the unit of the returned number by default', function (){
      expect(new SVG.Number('12s').plus('3%').unit).toBe('s')
    })
    it('use the unit of the passed number as the unit of the returned number when this number as no unit', function() {
      expect(number.plus('15%').unit).toBe('%')
    })
  })

  describe('minus()', function() {
    it('subtracts a given number', function() {
      expect(number.minus(3.7).valueOf()).toBe(-3.7)
    })
    it('subtracts a given percentage value', function() {
      expect(number.minus('223%').valueOf()).toBe(-2.23)
    })
    it('subtracts a given pixel value', function() {
      expect(number.minus('85px').valueOf()).toBe(-85)
    })
    it('use the unit of this number as the unit of the returned number by default', function (){
      expect(new SVG.Number('12s').minus('3%').unit).toBe('s')
    })
    it('use the unit of the passed number as the unit of the returned number when this number as no unit', function() {
      expect(number.minus('15%').unit).toBe('%')
    })
  })

  describe('times()', function() {
    beforeEach(function() {
      number = number.plus(4)
    })
    it('multiplies with a given number', function() {
      expect(number.times(3).valueOf()).toBe(12)
    })
    it('multiplies with a given percentage value', function() {
      expect(number.times('110%').valueOf()).toBe(4.4)
    })
    it('multiplies with a given pixel value', function() {
      expect(number.times('85px').valueOf()).toBe(340)
    })
    it('use the unit of this number as the unit of the returned number by default', function (){
      expect(new SVG.Number('12s').times('3%').unit).toBe('s')
    })
    it('use the unit of the passed number as the unit of the returned number when this number as no unit', function() {
      expect(number.times('15%').unit).toBe('%')
    })
  })

  describe('divide()', function() {
    beforeEach(function() {
      number = number.plus(90)
    })
    it('divides by a given number', function() {
      expect(number.divide(3).valueOf()).toBe(30)
    })
    it('divides by a given percentage value', function() {
      expect(number.divide('3000%').valueOf()).toBe(3)
    })
    it('divides by a given pixel value', function() {
      expect(number.divide('45px').valueOf()).toBe(2)
    })
    it('use the unit of this number as the unit of the returned number by default', function (){
      expect(new SVG.Number('12s').divide('3%').unit).toBe('s')
    })
    it('use the unit of the passed number as the unit of the returned number when this number as no unit', function() {
      expect(number.divide('15%').unit).toBe('%')
    })
  })
})
