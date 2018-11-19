describe('Svg', function() {

  describe('create()', function(){
    it('doenst alter size when adopting width SVG()', function() {
      var svg = SVG('#inlineSVG')
      expect(svg.width()).toBe(0)
      expect(svg.height()).toBe(0)
    })
  })

  it('is an instance of SVG.Container', function() {
    expect(draw instanceof SVG.Container).toBe(true)
  })

  it('is an instance of SVG.Svg', function() {
    expect(draw instanceof SVG.Svg).toBe(true)
  })

  it('returns itself as Svg when root', function() {
    expect(draw.root()).toBe(draw)
  })

  it('has a defs element when root', function() {
    expect(draw.defs() instanceof SVG.Defs).toBe(true)
  })

  describe('defs()', function() {
    it('returns defs element', function(){
      expect(draw.defs()).toBe(draw.node.getElementsByTagName('defs')[0].instance)
    })
    it('references parent node', function(){
      expect(draw.defs().parent()).toBe(draw)
    })
  })

  describe('isRoot()', function() {
    it('returns true when the Svg is not attached to dom', function() {
      expect(SVG().isRoot()).toBe(true)
    })
    it('returns true when its outer element is not an svg element', function () {
      expect(SVG().addTo(document.createElement('div')).isRoot()).toBe(true)
    })
    it('returns true when its the root element of the dom', function () {
      expect(draw.isRoot()).toBe(true)
    })
    it('returns false when parent is svg element', function () {
      expect(SVG().addTo(SVG()).isRoot()).toBe(false)
    })
  })

  describe('remove()', function() {
    it('removes the Svg from the dom only if Svg is not root element', function() {
      var cnt = window.document.querySelectorAll('svg').length
      draw.remove()
      if(parserInDoc){
        expect(window.document.querySelectorAll('svg').length).toBe(cnt)
      }else{
        expect(window.document.querySelectorAll('svg').length).toBe(cnt-1)
      }

      draw = SVG().addTo(drawing).size(100,100);
      expect(window.document.querySelectorAll('svg').length).toBe(cnt)
    })
  })

})
