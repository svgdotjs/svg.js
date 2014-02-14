describe('Use', function() {
  var use, rect

  beforeEach(function() {
    rect = draw.rect(100,100)
    use = draw.use(rect)
  })

  it('creates an instance of SVG.Use', function() {
    expect(use instanceof SVG.Use).toBe(true)
  })

  it('sets the target element id to its href attribute', function() {
    expect(use.node.getAttributeNS(SVG.xlink, 'href')).toBe('#' + rect)
  })

  it('stores a reference to the target element', function() {
    expect(use.target).toBe(rect)
  })

  it('adopts the geometry of the target element', function() {
    expect(use.bbox()).toEqual(rect.bbox())
  })
  
})