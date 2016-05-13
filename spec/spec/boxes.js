describe('BBox', function() {

  afterEach(function() {
    draw.clear()
  })

  it('creates a new instance without passing an element', function() {
    var box = new SVG.BBox
    expect(box.x).toBe(0)
    expect(box.y).toBe(0)
    expect(box.cx).toBe(0)
    expect(box.cy).toBe(0)
    expect(box.width).toBe(0)
    expect(box.height).toBe(0)
  })

  describe('merge()', function() {
    it('merges various bounding boxes', function() {
      var box1 = draw.rect(100,100).move(50,50).bbox()
      var box2 = draw.rect(100,100).move(300,400).bbox()
      var box3 = draw.rect(100,100).move(500,100).bbox()
      var merged = box1.merge(box2).merge(box3)
      expect(merged.x).toBe(50)
      expect(merged.y).toBe(50)
      expect(merged.cx).toBe(325)
      expect(merged.cy).toBe(275)
      expect(merged.width).toBe(550)
      expect(merged.height).toBe(450)
    })
    it('returns a new bbox instance', function() {
      var box1 = draw.rect(100,100).move(50,50).bbox()
      var box2 = draw.rect(100,100).move(300,400).bbox()
      var merged = box1.merge(box2)
      expect(box1).not.toBe(merged)
      expect(box2).not.toBe(merged)
      expect(box1.x).toBe(50)
      expect(box1.y).toBe(50)
      expect(box2.x).toBe(300)
      expect(box2.y).toBe(400)
    })
  })

})

describe('TBox', function() {

  afterEach(function() {
    draw.clear()
  })

  it('creates a new instance without passing an element', function() {
    var box = new SVG.TBox
    expect(box.x).toBe(0)
    expect(box.y).toBe(0)
    expect(box.cx).toBe(0)
    expect(box.cy).toBe(0)
    expect(box.width).toBe(0)
    expect(box.height).toBe(0)
  })

  describe('merge()', function() {
    it('merges various bounding boxes', function() {
      var box1 = draw.rect(100,100).move(50,50).bbox()
      var box2 = draw.rect(100,100).move(300,400).bbox()
      var box3 = draw.rect(100,100).move(500,100).bbox()
      var merged = box1.merge(box2).merge(box3)
      expect(merged.x).toBe(50)
      expect(merged.y).toBe(50)
      expect(merged.cx).toBe(325)
      expect(merged.cy).toBe(275)
      expect(merged.width).toBe(550)
      expect(merged.height).toBe(450)
    })
    it('returns a new bbox instance', function() {
      var box1 = draw.rect(100,100).move(50,50).bbox()
      var box2 = draw.rect(100,100).move(300,400).bbox()
      var merged = box1.merge(box2)
      expect(box1).not.toBe(merged)
      expect(box2).not.toBe(merged)
      expect(box1.x).toBe(50)
      expect(box1.y).toBe(50)
      expect(box2.x).toBe(300)
      expect(box2.y).toBe(400)
    })
  })

})

describe('RBox', function() {

  afterEach(function() {
    draw.clear()
  })

  it('creates a new instance without passing an element', function() {
    var box = new SVG.RBox
    expect(box.x).toBe(0)
    expect(box.y).toBe(0)
    expect(box.cx).toBe(0)
    expect(box.cy).toBe(0)
    expect(box.width).toBe(0)
    expect(box.height).toBe(0)
  })

  describe('merge()', function() {
    it('merges various bounding boxes', function() {
      var box1 = draw.rect(100,100).move(50,50).bbox()
      var box2 = draw.rect(100,100).move(300,400).bbox()
      var box3 = draw.rect(100,100).move(500,100).bbox()
      var merged = box1.merge(box2).merge(box3)
      expect(merged.x).toBe(50)
      expect(merged.y).toBe(50)
      expect(merged.cx).toBe(325)
      expect(merged.cy).toBe(275)
      expect(merged.width).toBe(550)
      expect(merged.height).toBe(450)
    })
    it('returns a new bbox instance', function() {
      var box1 = draw.rect(100,100).move(50,50).bbox()
      var box2 = draw.rect(100,100).move(300,400).bbox()
      var merged = box1.merge(box2)
      expect(box1).not.toBe(merged)
      expect(box2).not.toBe(merged)
      expect(box1.x).toBe(50)
      expect(box1.y).toBe(50)
      expect(box2.x).toBe(300)
      expect(box2.y).toBe(400)
    })
  })

})

describe('Boxes', function() {
  var rect

  beforeEach(function() {
    rect = draw.rect(50, 180).move(25, 90).scale(2, 3, 25, 90).translate(10, 11)
  })
  afterEach(function() {
    draw.clear()
  })

  describe('bbox()', function() {
    it('returns an instance of SVG.BBox', function() {
      expect(rect.bbox() instanceof SVG.BBox).toBeTruthy()
    })
    it('matches the size of the target element, ignoring transformations', function() {
      var box = rect.bbox()
      expect(box.x).toBe(25)
      expect(box.y).toBe(90)
      expect(box.cx).toBe(50)
      expect(box.cy).toBe(180)
      expect(box.width).toBe(50)
      expect(box.height).toBe(180)
      expect(box.w).toBe(50)
      expect(box.h).toBe(180)
      expect(box.x2).toBe(75)
      expect(box.y2).toBe(270)
    })
    it('returns a box even if the element is not in the dom', function() {
      var line = new SVG.Line().plot(0, 0, 50, 50)
      var box = line.bbox()

      expect(box.x).toBe(0)
      expect(box.y).toBe(0)
      expect(box.width).toBe(50)
      expect(box.height).toBe(50)
      expect('Should not result into infinite loop').toBe('Should not result into infinite loop')
    })
  })

  describe('tbox()', function() {
    it('returns an instance of SVG.TBox', function() {
      expect(rect.tbox() instanceof SVG.TBox).toBeTruthy()
    })
    it('matches the size of the target element, including transformations', function() {
      var box = rect.tbox()
      expect(box.x).toBe(35)
      expect(box.y).toBe(101)
      expect(box.cx).toBe(85)
      expect(box.cy).toBe(371)
      expect(box.width).toBe(100)
      expect(box.height).toBe(540)
      expect(box.w).toBe(100)
      expect(box.h).toBe(540)
      expect(box.x2).toBe(135)
      expect(box.y2).toBe(641)
    })
  })

  describe('rbox()', function() {
    it('returns an instance of SVG.RBox', function() {
      expect(rect.rbox() instanceof SVG.RBox).toBeTruthy()
    })
    it('matches the size of the target element, including transformations', function() {
      var box = rect.rbox()
      expect(box.x).toBeCloseTo(60)
      expect(box.y).toBeCloseTo(281)
      expect(box.cx).toBeCloseTo(110)
      expect(box.cy).toBeCloseTo(551)
      expect(box.width).toBe(100)
      expect(box.height).toBe(540)
      expect(box.w).toBe(100)
      expect(box.h).toBe(540)
      expect(box.x2).toBeCloseTo(160)
      expect(box.y2).toBeCloseTo(821)
    })
  })

})






