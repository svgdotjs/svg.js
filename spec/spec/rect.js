describe('Rect', function() {
  var rect
  
  beforeEach(function() {
    rect = draw.rect(220,100)
  })
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('x()', function() {
    it('should return the value of x without an argument', function() {
      expect(rect.x()).toBe(0)
    })
    it('should set the value of x with the first argument', function() {
      rect.x(123)
      var box = rect.bbox()
      expect(box.x).toBe(123)
    })
  })
  
  describe('y()', function() {
    it('should return the value of y without an argument', function() {
      expect(rect.y()).toBe(0)
    })
    it('should set the value of y with the first argument', function() {
      rect.y(345)
      var box = rect.bbox()
      expect(box.y).toBe(345)
    })
  })
  
  describe('cx()', function() {
    it('should return the value of cx without an argument', function() {
      expect(rect.cx()).toBe(110)
    })
    it('should set the value of cx with the first argument', function() {
      rect.cx(123)
      var box = rect.bbox()
      expect(box.cx).toBe(123)
    })
  })
  
  describe('cy()', function() {
    it('should return the value of cy without an argument', function() {
      expect(rect.cy()).toBe(50)
    })
    it('should set the value of cy with the first argument', function() {
      rect.cy(345)
      var box = rect.bbox()
      expect(box.cy).toBe(345)
    })
  })
  
  describe('move()', function() {
    it('should set the x and y position', function() {
      rect.move(123,456)
      expect(rect.node.getAttribute('x')).toBe('123')
      expect(rect.node.getAttribute('y')).toBe('456')
    })
  })
  
  describe('center()', function() {
    it('should set the cx and cy position', function() {
      rect.center(321,567)
      var box = rect.bbox()
      expect(box.cx).toBe(321)
      expect(box.cy).toBe(567)
    })
  })
  
  describe('size()', function() {
    it('should define the width and height of the element', function() {
      rect.size(987,654)
      expect(rect.node.getAttribute('width')).toBe('987')
      expect(rect.node.getAttribute('height')).toBe('654')
    })
  })
  
  describe('scale()', function() {
    it('should scale the element universally with one argument', function() {
      var box = rect.scale(2).bbox()
      
      expect(box.width).toBe(rect.attr('width') * 2)
      expect(box.height).toBe(rect.attr('height') * 2)
    })
    it('should scale the element over individual x and y axes with two arguments', function() {
      var box = rect.scale(2, 3.5).bbox()
      
      expect(box.width).toBe(rect.attr('width') * 2)
      expect(box.height).toBe(rect.attr('height') * 3.5)
    })
  })
  
})








