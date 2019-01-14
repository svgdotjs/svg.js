describe('Selector', function() {

  describe('SVG()', function() {
    it('gets an element\'s instance by id', function() {
      var rect = draw.rect(111, 333)

      expect(SVG('#'+rect.id())).toBe(rect)
    })
    // it('gets a referenced element by attribute value', function() {
    //   var rect = draw.defs().rect(100, 100)
    //     , use  = draw.use(rect)
    //     , mark = draw.marker(10, 10)
    //     , path = draw.path(svgPath).marker('end', mark)
    //
    //   expect(SVG('#'+use.attr('href'))).toBe(rect)
    //   expect(SVG('#'+path.attr('marker-end'))).toBe(mark)
    // })
  })

  describe('find()', function() {
    var e1, e2, e3, e4 ,e5

    beforeEach(function() {
      e1 = draw.rect(100, 100).addClass('selectable-element')
      e2 = draw.rect(100, 100).addClass('unselectable-element')
      e3 = draw.rect(100, 100).addClass('selectable-element')
      e4 = draw.rect(100, 100).addClass('unselectable-element')
      e5 = draw.rect(100, 100).addClass('selectable-element')
    })
    it('gets all elements with a given class name', function() {
      expect(SVG.find('rect.selectable-element')).toEqual([e1, e3, e5])
    })
    it('returns an Array', function() {
      expect(SVG.find('rect.selectable-element') instanceof Array).toBe(true)
    })
  })

  describe('Parent#find()', function() {
    it('gets all elements with a given class name inside a given element', function() {
      var group = draw.group()
        , e1 = draw.rect(100, 100).addClass('selectable-element')
        , e2 = draw.rect(100, 100).addClass('unselectable-element')
        , e3 = group.rect(100, 100).addClass('selectable-element')
        , e4 = draw.rect(100, 100).addClass('unselectable-element')
        , e5 = group.rect(100, 100).addClass('selectable-element')

      expect(group.find('rect.selectable-element')).toEqual([e3, e5])
    })
  })

  describe('Parent#findOne()', function() {
    it('gets all elements with a given class name inside a given element', function() {
      var group = draw.group()
        , e1 = draw.rect(100, 100).addClass('selectable-element')
        , e2 = draw.rect(100, 100).addClass('unselectable-element')
        , e3 = group.rect(100, 100).addClass('selectable-element')
        , e4 = draw.rect(100, 100).addClass('unselectable-element')
        , e5 = group.rect(100, 100).addClass('selectable-element')

      expect(group.findOne('rect.selectable-element')).toBe(e3)
    })
  })

})
