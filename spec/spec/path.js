describe('Path', function() {
  var path
  
  beforeEach(function() {
    path = draw.path(svgPath)
  })
  
  afterEach(function() {
    draw.clear()
  })
  
  describe('x()', function() {
    it('should return the value of x without an argument', function() {
      expect(path.x()).toBe(0)
    })
    it('should set the value of x with the first argument', function() {
      path.x(123)
      var box = path.bbox()
      expect(box.x).toBe(123)
    })
  })
  
  describe('y()', function() {
    it('should return the value of y without an argument', function() {
      expect(path.y()).toBe(0)
    })
    it('should set the value of y with the first argument', function() {
      path.y(345)
      var box = path.bbox()
      expect(box.y).toBe(345)
    })
  })
  
  describe('cx()', function() {
    it('should return the value of cx without an argument', function() {
      expect(path.cx()).toBe(50)
    })
    it('should set the value of cx with the first argument', function() {
      path.cx(123)
      var box = path.bbox()
      expect(box.cx).toBe(123)
    })
  })
  
  describe('cy()', function() {
    it('should return the value of cy without an argument', function() {
      expect(path.cy()).toBe(50)
    })
    it('should set the value of cy with the first argument', function() {
      path.cy(345)
      var box = path.bbox()
      expect(box.cy).toBe(345)
    })
  })
  
  describe('move()', function() {
    it('should set the x and y position', function() {
      path.move(123,456)
      var box = path.bbox()
      expect(box.x).toBe(123)
      expect(box.y).toBe(456)
    })
    it('should set the x and y position when scaled to half its size', function() {
      path.scale(0.5).move(123,456)
      var box = path.bbox()
      expect(box.x).toBe(123)
      expect(box.y).toBe(456)
    })
  })

  describe('dx()', function() {
    it('moves the x positon of the element relative to the current position', function() {
      path.move(50,60)
      path.dx(100)
      var box = path.bbox()
      expect(box.x).toBe(150)
    })
  })

  describe('dy()', function() {
    it('moves the y positon of the element relative to the current position', function() {
      path.move(50, 60)
      path.dy(120)
      var box = path.bbox()
      expect(box.y).toBe(180)
    })
  })

  describe('dmove()', function() {
    it('moves the x and y positon of the element relative to the current position', function() {
      path.move(50,60)
      path.dmove(80, 25)
      var box = path.bbox()
      expect(box.x).toBe(130)
      expect(box.y).toBe(85)
    })
  })
  
  describe('center()', function() {
    it('should set the cx and cy position', function() {
      path.center(321,567)
      var box = path.bbox()
      expect(box.x).toBe(271)
      expect(box.y).toBe(517)
    })
  })

  describe('width()', function() {
    it('sets the width of the element', function() {
      path.width(234)
      var box = path.bbox()
      expect(approximately(box.width, 0.1)).toBe(234)
    })
    it('gets the width of the element aithout an agrument', function() {
      path.width(456)
      expect(approximately(path.width(), 0.1)).toBe(456)
    })
  })

  describe('height()', function() {
    it('sets the height of the element', function() {
      path.height(654)
      var box = path.bbox()
      expect(approximately(box.height, 0.1)).toBe(654)
    })
    it('gets the height of the element aithout an agrument', function() {
      path.height(321)
      expect(approximately(path.height(), 0.1)).toBe(321)
    })
  })
  
  describe('size()', function() {
    it('defines the width and height of the element', function() {
      path.size(987,654)
      var box = path.bbox()
      expect(approximately(box.width, 0.1)).toBe(987)
      expect(approximately(box.height, 0.1)).toBe(654)
    })
    it('defines the width and height proportionally with only the width value given', function() {
      var box = path.bbox()
      path.size(500)
      expect(path.width()).toBe(500)
      expect(path.width() / path.height()).toBe(box.width / box.height)
    })
    it('defines the width and height proportionally with only the height value given', function() {
      var box = path.bbox()
      path.size(null, 525)
      expect(path.height()).toBe(525)
      expect(path.width() / path.height()).toBe(box.width / box.height)
    })
  })
  
  describe('scale()', function() {
    it('should scale the element universally with one argument', function() {
      var box1 = path.bbox()
        , box2 = path.scale(2).bbox()
      
      expect(box1.width * 2).toBe(box2.width)
      expect(box1.height * 2).toBe(box2.height)
    })
    it('should scale the element over individual x and y axes with two arguments', function() {
      var box1 = path.bbox()
        , box2 = path.scale(2, 3.5).bbox()
      
      expect(box1.width * 2).toBe(box2.width)
      expect(box1.height * 3.5).toBe(box2.height)
    })
  })

  describe('translate()', function() {
    it('should set the translation of an element', function() {
      path.transform({ x: 12, y: 12 })
      expect(path.node.getAttribute('transform')).toBe('translate(12 12)')
    })
  })

  describe('plot()', function() {
    it('falls back to a single point without an argument', function() {
      path = draw.path()
      expect(path.node.getAttribute('d')).toBe('M0 0 ')
    })
  })

  describe('toString()', function() {
    it('renders path array correctly to string', function() {
      path = path.plot('M 50 60 A 60 60 0 0 0 50 -60 H 100 V 100 L 20 30 C 10 20 30 40 50 60 ')
      expect(path.node.getAttribute('d')).toBe('M50 60A60 60 0 0 0 50 -60H100V100L20 30C10 20 30 40 50 60 ')
    })
    it('renders path array correctly to string', function() {
      path = path.plot('M 50 60 A 60 60 1 1 0 50 -60 H 100 V 100 L 20 30 C 10 20 30 40 50 60 ')
      expect(path.node.getAttribute('d')).toBe('M50 60A60 60 1 1 0 50 -60H100V100L20 30C10 20 30 40 50 60 ')
    })
  })

  describe('length()', function() {
    it('gets the total length of the path', function() {
      expect(path.length()).toBe(path.node.getTotalLength())
    })
  })

  describe('pointAt()', function() {
    it('gets a point at given length', function() {
      expect(path.pointAt(100)).toEqual(path.node.getPointAtLength(100))
    })
  })

  
})








