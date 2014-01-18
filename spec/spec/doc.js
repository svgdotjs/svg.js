describe('Doc', function() {
  
  it('should be an instance of SVG.Container', function() {
    expect(draw instanceof SVG.Container).toBe(true)
  })

  it('should have a defs element', function() {
    expect(draw._defs instanceof SVG.Defs).toBe(true)
  });

  it('defs element parent should be this SVG.Doc', function(){
    expect(draw._defs.parent).toBe(draw)
  })

  describe('defs()', function(){
    it('should return defs element', function(){
      expect(draw.defs()).toBe(draw._defs);
    })
  })

})