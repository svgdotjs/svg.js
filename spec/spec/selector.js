describe('Selector', function() {

  describe('get()', function() {
    it('gets an element\'s instance by id', function() {
      var rect = draw.rect(111, 333)
      
      expect(SVG.get(rect.attr('id'))).toBe(rect)
    })
    it('makes all the element\'s methods available', function() {
      var element = draw.group()
        , got = SVG.get(element.attr('id'))
      
      expect(got.transform()).toEqual(SVG.defaults.trans())
      expect(got.attr()).toEqual(element.attr())
    })
    it('gets a referenced element by attribute value', function() {
      var rect = draw.defs().rect(100, 100)
        , use  = draw.use(rect)
        , mark = draw.marker(10, 10)
        , path = draw.path(svgPath).marker('end', mark)

      expect(SVG.get(use.attr().href)).toBe(rect)
      expect(SVG.get(path.attr('marker-end'))).toBe(mark)
    })
  })
  
})