describe('Bare', function() {

  describe('element()', function() {
    var element

    beforeEach(function() {
      element = draw.element('rect')
    })

    it('creates an instance of SVG.Bare', function() {
      expect(element instanceof SVG.Bare).toBeTruthy()
    })
    it('creates element in called parent', function() {
      expect(element.parent()).toBe(draw)
    })
  })

  describe('words()', function() {
    it('inserts plain text in a node', function() {
      var element = draw.element('title').words('These are some words.').id(null)
      expect(element.svg()).toBe('<title>These are some words.</title>')
    })
  })
})