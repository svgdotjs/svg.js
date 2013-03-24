describe('Polygon', function() {
  var polygon
  
  beforeEach(function() {
    polygon = draw.polygon('0,0 100,0 100,100 0,100')
  })
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('x()', function() {
    it('should return the value of x without an argument', function() {
      expect(polygon.x()).toBe(0)
    })
    it('should set the value of x with the first argument', function() {
      polygon.x(123)
      var box = polygon.bbox()
      expect(box.x).toBe(123)
    })
  })
  
  describe('y()', function() {
    it('should return the value of y without an argument', function() {
      expect(polygon.y()).toBe(0)
    })
    it('should set the value of y with the first argument', function() {
      polygon.y(345)
      var box = polygon.bbox()
      expect(box.y).toBe(345)
    })
  })
  
  describe('cx()', function() {
    it('should return the value of cx without an argument', function() {
      expect(polygon.cx()).toBe(50)
    })
    it('should set the value of cx with the first argument', function() {
      polygon.cx(123)
      var box = polygon.bbox()
      expect(box.cx).toBe(123)
    })
  })
  
  describe('cy()', function() {
    it('should return the value of cy without an argument', function() {
      expect(polygon.cy()).toBe(50)
    })
    it('should set the value of cy with the first argument', function() {
      polygon.cy(345)
      var box = polygon.bbox()
      expect(box.cy).toBe(345)
    })
  })
  
  describe('move()', function() {
    it('should set the x and y position', function() {
      polygon.move(123,456)
      var box = polygon.bbox()
      expect(box.x).toBe(123)
      expect(box.y).toBe(456)
    })
  })
  
  describe('center()', function() {
    it('should set the cx and cy position', function() {
      polygon.center(321,567)
      var box = polygon.bbox()
      expect(box.x).toBe(271)
      expect(box.y).toBe(517)
    })
  })
  
  describe('size()', function() {
    it('should define the width and height of the element', function() {
      polygon.size(987,654)
      var box = polygon.bbox()
      expect(approximately(box.width, 0.1)).toBe(987)
      expect(approximately(box.height, 0.1)).toBe(654)
    })
  })
  
  describe('scale()', function() {
    it('should scale the element universally with one argument', function() {
      var box = polygon.scale(2).bbox()
      
      expect(box.width).toBe(polygon._offset.width * 2)
      expect(box.height).toBe(polygon._offset.height * 2)
    })
    it('should scale the element over individual x and y axes with two arguments', function() {
      var box = polygon.scale(2, 3.5).bbox()
      
      expect(box.width).toBe(polygon._offset.width * 2)
      expect(box.height).toBe(polygon._offset.height * 3.5)
    })
  })
  
})








