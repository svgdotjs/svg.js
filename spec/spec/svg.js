describe('SVG', function() {

  describe('()', function() {
    var drawing, wrapper, wrapperHTML, rect

    beforeEach(function() {
      wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      wrapper.id = 'testSvg'
      wrapperHTML = document.createElement('div')
      wrapperHTML.id = 'testDiv'
      rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      document.documentElement.appendChild(wrapper)
      document.documentElement.appendChild(wrapperHTML)
    })

    afterEach(function() {
      wrapper.parentNode.removeChild(wrapper)
      wrapperHTML.parentNode.removeChild(wrapperHTML)
    })

    it('creates an instanceof SVG.Svg without any argument', function() {
      expect(SVG() instanceof SVG.Svg).toBe(true)
      expect(SVG().node.nodeName).toBe('svg')
    })

    it('creates an instanceof SVG.Dom with html node', function() {
      var el = SVG(wrapperHTML)
      expect(el instanceof SVG.Dom).toBe(true)
      expect(el.node).toBe(wrapperHTML)
    })

    it('creates new SVG.Dom when called with css selector pointing to html node', function() {
      var el = SVG('#testDiv')
      expect(el instanceof SVG.Dom).toBe(true)
      expect(el.node).toBe(wrapperHTML)
    })

    it('creates an instanceof SVG.Svg with svg node', function() {
      var doc = SVG(wrapper)
      expect(doc instanceof SVG.Svg).toBe(true)
      expect(doc.node).toBe(wrapper)
    })

    it('creates new SVG.Svg when called with css selector pointing to svg node', function() {
      var doc = SVG('#testSvg')
      expect(doc instanceof SVG.Svg).toBe(true)
      expect(doc.node).toBe(wrapper)
    })

    it('adopts any SVGElement', function() {
      expect(SVG(rect) instanceof SVG.Rect).toBe(true)
      expect(SVG(rect).node).toBe(rect)
    })

    it('creates an instanceof SVG.Svg when importing a whole svg', function() {
      var doc = SVG('<svg width="200"><rect></rect></svg>')

      expect(doc instanceof SVG.Svg).toBe(true)
      expect(doc.node.nodeName).toBe('svg')
      expect(doc.width()).toBe(200)
      expect(doc.get(0).node.nodeName).toBe('rect')
    })

    it('creates SVG.Shape from any shape string', function() {
      var rect = SVG('<rect width="200" height="100" />')
        , circle = SVG('<circle r="200" />')

      expect(rect instanceof SVG.Rect).toBe(true)
      expect(rect.node.nodeName).toBe('rect')
      expect(rect.width()).toBe(200)

      expect(circle instanceof SVG.Circle).toBe(true)
      expect(circle.node.nodeName).toBe('circle')
      expect(circle.attr('r')).toBe(200)
    })

    it('returns the argument when called with any SVG.Element', function() {
      drawing = SVG(wrapper)
      expect(SVG(drawing)).toBe(drawing)
    })
  })

  describe('create()', function() {
    it('creates an element with given node name and return it', function() {
      var element = SVG.create('rect')

      expect(element.nodeName).toBe('rect')
    })
  })

  describe('extend()', function() {
    it('adds all functions in the given object to the target object', function() {
      SVG.extend(SVG.Rect, {
        soft: function() {
          return this.opacity(0.2)
        }
      })

      expect(typeof SVG.Rect.prototype.soft).toBe('function')
      expect(draw.rect(100,100).soft().attr('opacity')).toBe(0.2)
    })
    it('accepts and extend multiple modules at once', function() {
      SVG.extend([SVG.Rect, SVG.Ellipse, SVG.Path], {
        soft: function() {
          return this.opacity(0.5)
        }
      })

      expect(typeof SVG.Rect.prototype.soft).toBe('function')
      expect(draw.rect(100,100).soft().attr('opacity')).toBe(0.5)
      expect(typeof SVG.Ellipse.prototype.soft).toBe('function')
      expect(draw.ellipse(100,100).soft().attr('opacity')).toBe(0.5)
      expect(typeof SVG.Path.prototype.soft).toBe('function')
      expect(draw.path().soft().attr('opacity')).toBe(0.5)
    })
    // it('ignores non existant objects', function() {
    //   SVG.extend([SVG.Rect, SVG.Bogus], {
    //     soft: function() {
    //       return this.opacity(0.3)
    //     }
    //   })
    //
    //   expect(typeof SVG.Rect.prototype.soft).toBe('function')
    //   expect(draw.rect(100,100).soft().attr('opacity')).toBe(0.3)
    //   expect(typeof SVG.Bogus).toBe('undefined')
    // })
  })
})
