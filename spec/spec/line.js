describe('Line', function() {
  var line
  
  beforeEach(function() {
    line = draw.line(0,100,100,0)
  })
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('x()', function() {
    it('should return the value of x without an argument', function() {
      expect(line.x()).toBe(0)
    })
    it('should set the value of x with the first argument', function() {
      line.x(123)
      var box = line.bbox()
      expect(box.x).toBe(123)
    })
  })
  
  describe('y()', function() {
    it('should return the value of y without an argument', function() {
      expect(line.y()).toBe(0)
    })
    it('should set the value of y with the first argument', function() {
      line.y(345)
      var box = line.bbox()
      expect(box.y).toBe(345)
    })
  })
  
  describe('cx()', function() {
    it('should return the value of cx without an argument', function() {
      expect(line.cx()).toBe(50)
    })
    it('should set the value of cx with the first argument', function() {
      line.cx(123)
      var box = line.bbox()
      expect(box.cx).toBe(123)
    })
  })
  
  describe('cy()', function() {
    it('should return the value of cy without an argument', function() {
      expect(line.cy()).toBe(50)
    })
    it('should set the value of cy with the first argument', function() {
      line.cy(345)
      var box = line.bbox()
      expect(box.cy).toBe(345)
    })
  })
  
  describe('move()', function() {
    it('should set the x and y position', function() {
      line.move(123,456)
      var box = line.bbox()
      expect(box.x).toBe(123)
      expect(box.y + box.height).toBe(556)
      expect(box.x + box.width).toBe(223)
      expect(box.y).toBe(456)
    })
  })
  
  describe('center()', function() {
    it('should set the cx and cy position', function() {
      line.center(321,567)
      var box = line.bbox()
      expect(box.x).toBe(271)
      expect(box.y + box.height).toBe(617)
      expect(box.x + box.width).toBe(371)
      expect(box.y).toBe(517)
    })
  })
  
  describe('size()', function() {
    it('should define the width and height of the element', function() {
      line.size(987,654)
      var box = line.bbox()
      expect(box.x).toBe(0)
      expect(box.y + box.height).toBe(654)
      expect(box.x + box.width).toBe(987)
      expect(box.y).toBe(0)
    })
  })
  
  describe('scale()', function() {
    it('should scale the element universally with one argument', function() {
      var box1 = line.bbox()
        , box2 = line.scale(2).bbox()
      
      expect(box2.width).toBe(box1.width * 2)
      expect(box2.height).toBe(box1.height * 2)
    })
    it('should scale the element over individual x and y axes with two arguments', function() {
      var box1 = line.bbox()
        , box2 = line.scale(2,3.5).bbox() 
      
      expect(box2.width).toBe(box1.width * 2)
      expect(box2.height).toBe(box1.height * 3.5)
    })
  })

  describe('translate()', function() {
    it('should set the translation of an element', function() {
      line.transform({ x: 12, y: 12 })
      expect(line.node.getAttribute('transform')).toBe('translate(12 12)')
    })
  })
  
  describe('plot()', function() {
    it('should update the start and end points', function() {
      line.plot(100,200,300,400)
      var box = line.bbox()
      expect(box.x).toBe(100)
      expect(box.y).toBe(200)
      expect(box.x + box.width).toBe(300)
      expect(box.y + box.height).toBe(400)
    })
  })
  
})








