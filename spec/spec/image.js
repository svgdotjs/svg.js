describe('Image', function() {
  var image
  
  beforeEach(function() {
    image = draw.image(imageUrl, 100, 100)
  })
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('x()', function() {
    it('should return the value of x without an argument', function() {
      expect(image.x()).toBe(0)
    })
    it('should set the value of x with the first argument', function() {
      image.x(123)
      var box = image.bbox()
      expect(box.x).toBe(123)
    })
  })
  
  describe('y()', function() {
    it('should return the value of y without an argument', function() {
      expect(image.y()).toBe(0)
    })
    it('should set the value of y with the first argument', function() {
      image.y(345)
      var box = image.bbox()
      expect(box.y).toBe(345)
    })
  })
  
  describe('cx()', function() {
    it('should return the value of cx without an argument', function() {
      expect(image.cx()).toBe(50)
    })
    it('should set the value of cx with the first argument', function() {
      image.cx(123)
      var box = image.bbox()
      expect(box.cx).toBe(123)
    })
  })
  
  describe('cy()', function() {
    it('should return the value of cy without an argument', function() {
      expect(image.cy()).toBe(50)
    })
    it('should set the value of cy with the first argument', function() {
      image.cy(345)
      var box = image.bbox()
      expect(box.cy).toBe(345)
    })
  })
  
  describe('move()', function() {
    it('should set the x and y position', function() {
      image.move(123,456)
      expect(image.node.getAttribute('x')).toBe('123')
      expect(image.node.getAttribute('y')).toBe('456')
    })
  })
  
  describe('center()', function() {
    it('should set the cx and cy position', function() {
      image.center(321,567)
      var box = image.bbox()
      expect(box.cx).toBe(321)
      expect(box.cy).toBe(567)
    })
  })
  
  describe('size()', function() {
    it('should define the width and height of the element', function() {
      image.size(987,654)
      expect(image.node.getAttribute('width')).toBe('987')
      expect(image.node.getAttribute('height')).toBe('654')
    })
  })
  
  describe('scale()', function() {
    it('should scale the element universally with one argument', function() {
      var box = image.scale(2).bbox()
      
      expect(box.width).toBe(image.attr('width') * 2)
      expect(box.height).toBe(image.attr('height') * 2)
    })
    it('should scale the element over individual x and y axes with two arguments', function() {
      var box = image.scale(2, 3.5).bbox()
      
      expect(box.width).toBe(image.attr('width') * 2)
      expect(box.height).toBe(image.attr('height') * 3.5)
    })
  })
  
})

















