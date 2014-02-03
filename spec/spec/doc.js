describe('Doc', function() {
  
  it('is an instance of SVG.Container', function() {
    expect(draw instanceof SVG.Container).toBe(true)
  })
  
  it('has a defs element', function() {
    expect(draw._defs instanceof SVG.Defs).toBe(true)
  })

  describe('defs()', function() {
    it('returns defs element', function(){
      expect(draw.defs()).toBe(draw._defs)
    })
    it('references parent node', function(){
      expect(draw.defs().parent).toBe(draw)
    })
  })
  
})