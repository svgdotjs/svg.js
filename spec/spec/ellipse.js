describe('Ellipse', function() {
  var ellipse
  
  beforeEach(function() {
    ellipse = draw.ellipse(240,90)
  })
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('x()', function() {
    it('should return the value of x without an argument', function() {
      expect(ellipse.x()).toBe(0)
    })
    it('should set the value of x with the first argument', function() {
      ellipse.x(123)
      var box = ellipse.bbox()
      expect(box.x).toBe(123)
    })
  })
  
  describe('y()', function() {
    it('should return the value of y without an argument', function() {
      expect(ellipse.y()).toBe(0)
    })
    it('should set the value of cy with the first argument', function() {
      ellipse.y(345)
      var box = ellipse.bbox()
      expect(box.y).toBe(345)
    })
  })
  
  describe('cx()', function() {
    it('should return the value of cx without an argument', function() {
      expect(ellipse.cx()).toBe(120)
    })
    it('should set the value of cx with the first argument', function() {
      ellipse.cx(123)
      var box = ellipse.bbox()
      expect(box.cx).toBe(123)
    })
  })
  
  describe('cy()', function() {
    it('should return the value of cy without an argument', function() {
      expect(ellipse.cy()).toBe(45)
    })
    it('should set the value of cy with the first argument', function() {
      ellipse.cy(345)
      var box = ellipse.bbox()
      expect(box.cy).toBe(345)
    })
  })
  
  describe('move()', function() {
    it('should set the x and y position', function() {
      ellipse.move(123,456)
      var box = ellipse.bbox()
      expect(box.x).toBe(123)
      expect(box.y).toBe(456)
    })
  })
  
  describe('center()', function() {
    it('should set the cx and cy position', function() {
      ellipse.center(321,567)
      var box = ellipse.bbox()
      expect(box.cx).toBe(321)
      expect(box.cy).toBe(567)
    })
  })
  
  describe('size()', function() {
    it('should define the rx and ry of the element', function() {
      ellipse.size(987,654)
      expect(ellipse.node.getAttribute('rx')).toBe((987 / 2).toString())
      expect(ellipse.node.getAttribute('ry')).toBe((654 / 2).toString())
    })
  })
  
  describe('scale()', function() {
    it('should scale the element universally with one argument', function() {
      var box = ellipse.scale(2).bbox()
      
      expect(box.width).toBe(ellipse.attr('rx') * 2 * 2)
      expect(box.height).toBe(ellipse.attr('ry') * 2 * 2)
    })
    it('should scale the element over individual x and y axes with two arguments', function() {
      var box = ellipse.scale(2, 3.5).bbox()
      
      expect(box.width).toBe(ellipse.attr('rx') * 2 * 2)
      expect(box.height).toBe(ellipse.attr('ry') * 2 * 3.5)
    })
  })
  
})








