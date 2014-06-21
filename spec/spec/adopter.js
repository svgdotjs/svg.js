describe('Adopter', function() {
  var path

  beforeEach(function() {
    path = SVG.get('lineAB')
  })

  it('adopts an exiting path element', function() {
    expect(path instanceof SVG.Path).toBe(true)
  })

  it('modifies an adopted element', function() {
    path.fill('#f06')
    expect(path.node.getAttribute('fill')).toBe('#ff0066')
  })

  it('adopts a parent when parent() method is called', function() {
    expect(path.parent() instanceof SVG.Doc).toBe(true)
  })

})