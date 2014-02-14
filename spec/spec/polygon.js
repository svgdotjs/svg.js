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

  describe('dx()', function() {
    it('moves the x positon of the element relative to the current position', function() {
      polygon.move(50,60)
      polygon.dx(100)
      var box = polygon.bbox()
      expect(box.x).toBe(150)
    })
  })

  describe('dy()', function() {
    it('moves the y positon of the element relative to the current position', function() {
      polygon.move(50, 60)
      polygon.dy(120)
      var box = polygon.bbox()
      expect(box.y).toBe(180)
    })
  })

  describe('dmove()', function() {
    it('moves the x and y positon of the element relative to the current position', function() {
      polygon.move(50,60)
      polygon.dmove(80, 25)
      var box = polygon.bbox()
      expect(box.x).toBe(130)
      expect(box.y).toBe(85)
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

  describe('width()', function() {
    it('sets the width and height of the element', function() {
      polygon.width(987)
      var box = polygon.bbox()
      expect(approximately(box.width, 0.1)).toBe(987)
    })
    it('gets the width and height of the element without an argument', function() {
      polygon.width(789)
      expect(approximately(polygon.width(), 0.1)).toBe(789)
    })
  })

  describe('height()', function() {
    it('sets the height and height of the element', function() {
      polygon.height(987)
      var box = polygon.bbox()
      expect(approximately(box.height, 0.1)).toBe(987)
    })
    it('gets the height and height of the element without an argument', function() {
      polygon.height(789)
      expect(approximately(polygon.height(), 0.1)).toBe(789)
    })
  })
  
  describe('size()', function() {
    it('should define the width and height of the element', function() {
      polygon.size(987,654)
      var box = polygon.bbox()
      expect(approximately(box.width, 0.1)).toBe(987)
      expect(approximately(box.height, 0.1)).toBe(654)
    })
    it('defines the width and height proportionally with only the width value given', function() {
      var box = polygon.bbox()
      polygon.size(500)
      expect(polygon.width()).toBe(500)
      expect(polygon.width() / polygon.height()).toBe(box.width / box.height)
    })
    it('defines the width and height proportionally with only the height value given', function() {
      var box = polygon.bbox()
      polygon.size(null, 525)
      expect(polygon.height()).toBe(525)
      expect(polygon.width() / polygon.height()).toBe(box.width / box.height)
    })
  })
  
  describe('scale()', function() {
    it('should scale the element universally with one argument', function() {
      var box1 = polygon.bbox()
        , box2 = polygon.scale(2).bbox()
      
      expect(box2.width).toBe(box1.width * 2)
      expect(box2.height).toBe(box1.height * 2)
    })
    it('should scale the element over individual x and y axes with two arguments', function() {
      var box1 = polygon.bbox()
        , box2 = polygon.scale(2, 3.5).bbox()
      
      expect(box2.width).toBe(box1.width * 2)
      expect(box2.height).toBe(box1.height * 3.5)
    })
  })

  describe('translate()', function() {
    it('should set the translation of an element', function() {
      polygon.transform({ x: 12, y: 12 })
      expect(polygon.node.getAttribute('transform')).toBe('translate(12 12)')
    })
  })
  
})








