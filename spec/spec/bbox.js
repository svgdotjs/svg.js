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