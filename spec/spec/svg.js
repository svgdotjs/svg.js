describe('SVG', function() {

  describe('()', function() {
    var drawing, wrapper

    beforeEach(function() {
      wrapper = document.createElement('svg')
      document.documentElement.appendChild(wrapper)
      drawing = SVG(wrapper)
    })

    afterEach(function() {
      wrapper.parentNode.removeChild(wrapper)
    })

    it('creates a new svg drawing', function() {
      expect(drawing.type).toBe('svg')
    })
    it('creates an instance of SVG.Doc', function() {
      expect(drawing instanceof SVG.Doc).toBe(true)
    })
    
    if(parserInDoc){
      it('sets no default size in svg documents', function() {
        expect(drawing.width()).toBe(0)
        expect(drawing.height()).toBe(0)
      })
    }else{
      it('sets size to 100% in html documents', function() {
        expect(drawing.width()).toBe('100%')
        expect(drawing.height()).toBe('100%')
      })
    }
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
      SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Path, {
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
    it('ignores non existant objects', function() {
      SVG.extend(SVG.Rect, SVG.Bogus, {
        soft: function() {
          return this.opacity(0.3)
        }
      })

      expect(typeof SVG.Rect.prototype.soft).toBe('function')
      expect(draw.rect(100,100).soft().attr('opacity')).toBe(0.3)
      expect(typeof SVG.Bogus).toBe('undefined')
    })
  })

  describe('prepare()', function() {
    var drawing, wrapper, parser

    beforeEach(function() {
      wrapper = document.createElement('svg')
      document.documentElement.appendChild(wrapper)
      drawing = SVG(wrapper)
    })

    it('creates a parser element when calling SVG()', function() {
      expect(SVG.parser.draw.nodeName).toBe('svg')
    })
    it('hides the parser', function() {
      expect(window.stripped(SVG.parser.draw.getAttribute('style'))).toBe('opacity:0;position:absolute;left:-100%;top:-100%;overflow:hidden')
    })
    it('holds polyline and path', function() {
      expect(SVG.select('polyline', SVG.parser.draw.node)[0].type).toBe('polyline')
      expect(SVG.select('path', SVG.parser.draw.node)[0].type).toBe('path')
    })
  })
})
