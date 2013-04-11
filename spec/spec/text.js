// IMPORTANT!!!
// The native getBBox() on text elements is not accurate to the pixel.
// Therefore some values are treated with the approximately() function.

describe('Text', function() {
  var text
  
  beforeEach(function() {
    text = draw.text(loremIpsum).size(5)
  })
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('x()', function() {
    it('should return the value of x without an argument', function() {
      expect(approximately(text.x())).toBe(approximately(0))
    })
    it('should set the value of x with the first argument', function() {
      text.x(123)
      var box = text.bbox()
      expect(approximately(box.x)).toBe(approximately(123))
    })
    it('should set the value of x based on the anchor with the first argument', function() {
      text.x(123, true)
      var box = text.bbox()
      expect(approximately(box.x)).toBe(approximately(123))
    })
  })
  
  describe('y()', function() {
    it('should return the value of y without an argument', function() {
      expect(text.y()).toBe(0)
    })
    it('should set the value of y with the first argument', function() {
      text.y(345)
      var box = text.bbox()
      expect(approximately(box.y)).toBe(approximately(345))
    })
    it('should set the value of y based on the anchor with the first argument', function() {
      text.y(345, true)
      var box = text.bbox()
      expect(approximately(box.y)).toBe(approximately(345))
    })
  })
  
  describe('cx()', function() {
    it('should return the value of cx without an argument', function() {
      var box = text.bbox()
      expect(approximately(text.cx())).toBe(approximately(box.width / 2))
    })
    it('should set the value of cx with the first argument', function() {
      text.cx(123)
      var box = text.bbox()
      expect(approximately(box.cx)).toBe(approximately(123))
    })
    it('should set the value of cx based on the anchor with the first argument', function() {
      text.cx(123, true)
      var box = text.bbox()
      expect(approximately(box.cx)).toBe(approximately(123))
    })
  })
  
  describe('cy()', function() {
    it('should return the value of cy without an argument', function() {
      var box = text.bbox()
      expect(text.cy()).toBe(box.cy)
    })
    it('should set the value of cy with the first argument', function() {
      text.cy(345)
      var box = text.bbox()
      expect(approximately(box.cy)).toBe(approximately(345))
    })
    it('should set the value of cy based on the anchor with the first argument', function() {
      text.cy(345, true)
      var box = text.bbox()
      expect(approximately(box.cy)).toBe(approximately(345 + box.height / 2))
    })
  })
  
  describe('move()', function() {
    it('should set the x and y position', function() {
      text.move(123,456)
      expect(text.lines[0].node.getAttribute('x')).toBe('123')
      expect(text.node.getAttribute('y')).toBe('456')
    })
  })
  
  describe('center()', function() {
    it('should set the cx and cy position', function() {
      text.center(321,567)
      var box = text.bbox()
      expect(approximately(box.cx)).toBe(approximately(321))
      expect(approximately(box.cy)).toBe(approximately(567))
    })
  })
  
  describe('size()', function() {
    it('should define the width and height of the element', function() {
      text.size(50)
      expect(text.style('font-size')).toBe(50)
    })
  })
  
})








