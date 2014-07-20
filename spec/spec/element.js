describe('Element', function() {
  
  beforeEach(function() {
    draw.attr('viewBox', null)
  })

  afterEach(function() {
    draw.clear()
  })
  
  it('should create a circular reference on the node', function() {
    var rect = draw.rect(100,100)
    expect(rect.node.instance).toBe(rect)
  })

  describe('native()', function() {
    it('returns the node reference', function() {
      var rect = draw.rect(100,100)
      expect(rect.native()).toBe(rect.node)
    })
  })
  
  describe('attr()', function() {
    var rect
    
    beforeEach(function() {
      rect = draw.rect(100,100)
    })

    afterEach(function() {
      rect.remove()
    })

    it('sets one attribute when two arguments are given', function() {
      rect.attr('fill', '#ff0066')
      expect(rect.node.getAttribute('fill')).toBe('#ff0066')
    })
    it('sets various attributes when an object is given', function() {
      rect.attr({ fill: '#00ff66', stroke: '#ff2233', 'stroke-width': 10 })
      expect(rect.node.getAttribute('fill')).toBe('#00ff66')
      expect(rect.node.getAttribute('stroke')).toBe('#ff2233')
      expect(rect.node.getAttribute('stroke-width')).toBe('10')
    })
    it('gets the value of the string value given as first argument', function() {
      rect.attr('fill', '#ff0066')
      expect(rect.attr('fill')).toEqual('#ff0066')
    })
    it('gets an object with all attributes without any arguments', function() {
      rect.attr({ fill: '#00ff66', stroke: '#ff2233' })
      var attr = rect.attr()
      expect(attr.fill).toBe('#00ff66')
      expect(attr.stroke).toBe('#ff2233')
    })
    it('removes an attribute if the second argument is explicitly set to null', function() {
      rect.attr('stroke-width', 10)
      expect(rect.node.getAttribute('stroke-width')).toBe('10')
      rect.attr('stroke-width', null)
      expect(rect.node.getAttribute('stroke-width')).toBe(null)
    })
    it('correctly parses numeric values as a getter', function() {
      rect.attr('stroke-width', 11)
      expect(rect.node.getAttribute('stroke-width')).toBe('11')
      expect(rect.attr('stroke-width')).toBe(11)
    })
    it('correctly parses negative numeric values as a getter', function() {
      rect.attr('x', -120)
      expect(rect.node.getAttribute('x')).toBe('-120')
      expect(rect.attr('x')).toBe(-120)
    })
    it('falls back on default values if attribute is not present', function() {
      expect(rect.attr('stroke-linejoin')).toBe('miter')
    })
    it('gets the "style" attribute as a string', function() {
      rect.style('cursor', 'pointer')
      expect(rect.node.style.cursor).toBe('pointer')
    })
    it('redirects to the style() method when setting a style string', function() {
      rect.attr('style', 'cursor:move;')
      expect(rect.node.style.cursor).toBe('move')
    })
    it('removes style attribute on node if the style is empty', function() {
      rect.style('cursor', 'move')
      rect.style('cursor', '')
      expect(rect.style.cursor).toBe(undefined)
    })
    it('acts as a global getter when no arguments are given', function() {
      rect.fill('#ff0066')
      expect(rect.attr().fill).toBe('#ff0066')
    })
    it('correctly parses numeric values as a global getter', function() {
      rect.stroke({ width: 20 })
      expect(rect.attr()['stroke-width']).toBe(20)
    })
    it('correctly parses negative numeric values as a global getter', function() {
      rect.x(-30)
      expect(rect.attr().x).toBe(-30)
    })
    it('leaves unit values alone as a global getter', function() {
      rect.attr('x', '69%')
      expect(rect.attr().x).toBe('69%')
    })
  })

  describe('id()', function() {
    var rect
    
    beforeEach(function() {
      rect = draw.rect(100,100)
    })
    
    it('gets the value if the id attribute without an argument', function() {
      expect(rect.id()).toBe(rect.attr('id'))
    })
    it('sets the value of the id', function() {
      rect.id('new_id')
      expect(rect.attr('id')).toBe('new_id')
    })
  })
  
  describe('style()', function() {
    it('sets the style with key and value arguments', function() {
      var rect = draw.rect(100,100).style('cursor', 'crosshair')
      expect(stripped(rect.node.style.cssText)).toBe('cursor:crosshair;')
    })
    it('sets multiple styles with an object as the first argument', function() {
      var rect = draw.rect(100,100).style({ cursor: 'help', display: 'block' })
      expect(stripped(rect.node.style.cssText)).toMatch(/cursor:help;/)
      expect(stripped(rect.node.style.cssText)).toMatch(/display:block;/)
      expect(stripped(rect.node.style.cssText).length).toBe(('display:block;cursor:help;').length)
    })
    it('gets a style with a string key as the fists argument', function() {
      var rect = draw.rect(100,100).style({ cursor: 'progress', display: 'block' })
      expect(rect.style('cursor')).toBe('progress')
    })
    it('gets a style with a string key as the fists argument', function() {
      var rect = draw.rect(100,100).style({ cursor: 's-resize', display: 'none' })
      expect(stripped(rect.style())).toMatch(/display:none;/)
      expect(stripped(rect.style())).toMatch(/cursor:s-resize;/)
      expect(stripped(rect.style()).length).toBe(('cursor:s-resize;display:none;').length)
    })
    it('removes a style if the value is an empty string', function() {
      var rect = draw.rect(100,100).style({ cursor: 'n-resize', display: '' })
      expect(stripped(rect.style())).toBe('cursor:n-resize;')
    })
    it('removes a style if the value explicitly set to null', function() {
      var rect = draw.rect(100,100).style('cursor', 'w-resize')
      expect(stripped(rect.style())).toBe('cursor:w-resize;')
      rect.style('cursor', null)
      expect(rect.style()).toBe('')
    })
  })
  
  describe('transform()', function() {
    it('gets the current transformations', function() {
      var rect = draw.rect(100,100)
      expect(rect.transform()).toEqual(new SVG.Matrix(rect).extract())
    })
    it('sets the translation of and element', function() {
      var rect = draw.rect(100,100).transform({ x: 10, y: 11 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(1,0,0,1,10,11)')
    })
    it('sets the scaleX and scaleY of and element', function() {
      var rect = draw.rect(100,100).transform({ scaleX: 0.5, scaleY: 2 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(0.5,0,0,2,0,0)')
    })
    it('sets the skewX of and element', function() {
      var rect = draw.rect(100,100).transform({ skewX: 10 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(1,0,0.17632698070846498,1,0,0)')
    })
    it('sets the skewY of and element', function() {
      var rect = draw.rect(100,100).transform({ skewY: -10 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(1,-0.17632698070846498,0,1,0,0)')
    })
    it('rotates the element around its centre if no rotation point is given', function() {
      var rect = draw.rect(100,100).center(150,150).transform({ rotation: 45 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(0.7071067811865475,0.7071067811865475,-0.7071067811865475,0.7071067811865475,150,-62.13203435596424)')
      expect(rect.transform('rotation')).toBe(45)
    })
    it('rotates the element around the given rotation point', function() {
      var rect = draw.rect(100,100).transform({ rotation: 55, cx: 80, cy:2 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(0.573576436351046,0.8191520442889917,-0.8191520442889917,0.573576436351046,35.7521891804943,-64.67931641582143)')
    })
    it('transforms element using a matrix', function() {
      var rect = draw.rect(100,100).transform({ a: 0.5, c: 0.5 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(0.5,0,0.5,1,0,0)')
    })
  })
  
  describe('data()', function() {
    it('sets a data attribute and convert value to json', function() {
      var rect = draw.rect(100,100).data('test', 'value')
      expect(rect.node.getAttribute('data-test')).toBe('value')
    })
    it('sets a data attribute and not convert value to json if flagged raw', function() {
      var rect = draw.rect(100,100).data('test', 'value', true)
      expect(rect.node.getAttribute('data-test')).toBe('value')
    })
    it('sets multiple data attributes and convert values to json when an object is passed', function() {
      var rect = draw.rect(100,100).data({
        forbidden: 'fruit'
      , multiple: {
          values: 'in'
        , an: 'object'
        }
      })
      expect(rect.node.getAttribute('data-forbidden')).toBe('fruit')
      expect(rect.node.getAttribute('data-multiple')).toEqual('{"values":"in","an":"object"}')
    })
    it('gets data value if only one argument is passed', function() {
      var rect = draw.rect(100,100).data('test', 101)
      expect(rect.data('test')).toBe(101)
    })
    it('maintains data type for a number', function() {
      var rect = draw.rect(100,100).data('test', 101)
      expect(typeof rect.data('test')).toBe('number')
    })
    it('maintains data type for an object', function() {
      var rect = draw.rect(100,100).data('test', { string: 'value', array: [1,2,3] })
      expect(typeof rect.data('test')).toBe('object')
      expect(Array.isArray(rect.data('test').array)).toBe(true) 
    })
  })
  
  describe('remove()', function() {
    it('removes an element and return it', function() {
      var rect = draw.rect(100,100)
      expect(rect.remove()).toBe(rect)
    })
    it('removes an element from its parent', function() {
      var rect = draw.rect(100,100)
      rect.remove()
      expect(draw.has(rect)).toBe(false)
    })
  })

  describe('addTo()', function() {
    it('adds an element to a given parent and returns itself', function() {
      var rect  = draw.rect(100,100)
        , group = draw.group()

      expect(rect.addTo(group)).toBe(rect)
      expect(rect.parent()).toBe(group)
    })
  })

  describe('putIn()', function() {
    it('adds an element to a given parent and returns parent', function() {
      var rect  = draw.rect(100,100)
        , group = draw.group()

      expect(rect.putIn(group)).toBe(group)
      expect(rect.parent()).toBe(group)
    })
  })
  
  describe('rbox()', function() {
    it('returns an instance of SVG.RBox', function() {
      var rect = draw.rect(100,100)
      expect(rect.rbox() instanceof SVG.RBox).toBe(true)
    })
    it('returns the correct rectangular box', function() {
      var rect = draw.size(200, 150).viewbox(0, 0, 200, 150).rect(105, 210).move(2, 12)
      var box = rect.rbox()
      expect(box.x).toBe(2)
      expect(box.y).toBe(12)
      expect(box.cx).toBe(54.5)
      expect(box.cy).toBe(117)
      expect(box.width).toBe(105)
      expect(box.height).toBe(210)
    })
    it('returns the correct rectangular box within a viewbox', function() {
      var rect = draw.size(200,150).viewbox(0,0,100,75).rect(105,210).move(2,12)
      var box = rect.rbox()
      expect(box.x).toBe(1)
      expect(box.y).toBe(6)
      expect(box.cx).toBe(27.25)
      expect(box.cy).toBe(58.5)
      expect(box.width).toBe(52.5)
      expect(box.height).toBe(105)
    })
  })
  
  describe('doc()', function() {
    it('returns the parent document', function() {
      var rect = draw.rect(100,100)
      expect(rect.doc()).toBe(draw)
    })
  })
  
  describe('parent', function() {
    it('contains the parent svg', function() {
      var rect = draw.rect(100,100)
      expect(rect.parent()).toBe(draw)
    })
    it('contains the parent group when in a group', function() {
      var group = draw.group()
        , rect = group.rect(100,100)
      expect(rect.parent()).toBe(group)
    })
  })
  
  describe('clone()', function() {
    var rect, group, circle

    beforeEach(function() {
      rect   = draw.rect(100,100).center(321,567).fill('#f06')
      group  = draw.group().add(rect)
      circle = group.circle(100)
    })

    it('makes an exact copy of the element', function() {
      clone = rect.clone()
      expect(clone.attr('id', null).attr()).toEqual(rect.attr('id', null).attr())
    })
    it('assigns a new id to the cloned element', function() {
      clone = rect.clone()
      expect(clone.attr('id')).not.toBe(rect.attr('id'))
    })
    it('copies all child nodes as well', function() {
      clone = group.clone()
      expect(clone.children().length).toBe(group.children().length)
    })
    it('assigns a new id to cloned child elements', function() {
      clone = group.clone()
      expect(clone.attr('id')).not.toEqual(group.attr('id'))
      expect(clone.get(0).attr('id')).not.toBe(group.get(0).attr('id'))
      expect(clone.get(1).attr('id')).not.toBe(group.get(1).attr('id'))
    })
  })

  describe('toString()', function() {
    it('returns the element id', function() {
      var rect = draw.rect(100,100).center(321,567).fill('#f06')
      expect(rect + '').toBe(rect.attr('id'))
    })
  })

  describe('replace()', function() {
    it('replaces the original element by another given element', function() {
      var rect = draw.rect(100,100).center(321,567).fill('#f06')
      var circle = draw.circle(200)
      var rectIndex = draw.children().indexOf(rect)

      rect.replace(circle)
      
      expect(rectIndex).toBe(draw.children().indexOf(circle))
    })
    it('removes the original element', function() {
      var rect = draw.rect(100,100).center(321,567).fill('#f06')

      rect.replace(draw.circle(200))
      
      expect(draw.has(rect)).toBe(false)
    })
    it('returns the new element', function() {
      var circle  = draw.circle(200)
      var element = draw.rect(100,100).center(321,567).fill('#f06').replace(circle)
      
      expect(element).toBe(circle)
    })
  })

  describe('classes()', function() {
    it('returns an array of classes on the node', function() {
      var element = draw.rect(100,100)
      element.node.setAttribute('class', 'one two')
      expect(element.classes()).toEqual(['one', 'two'])
    })
  })

  describe('hasClass()', function() {
    it('returns true if the node has the class', function() {
      var element = draw.rect(100,100)
      element.node.setAttribute('class', 'one')
      expect(element.hasClass('one')).toBeTruthy()
    })

    it('returns false if the node does not have the class', function() {
      var element = draw.rect(100,100)
      element.node.setAttribute('class', 'one')
      expect(element.hasClass('two')).toBeFalsy()
    })
  })

  describe('addClass()', function() {
    it('adds the class to the node', function() {
      var element = draw.rect(100,100)
      element.addClass('one')
      expect(element.hasClass('one')).toBeTruthy()
    })

    it('does not add duplicate classes', function() {
      var element = draw.rect(100,100)
      element.addClass('one')
      element.addClass('one')
      expect(element.node.getAttribute('class')).toEqual('one')
    })

    it('returns the svg instance', function() {
      var element = draw.rect(100,100)
      expect(element.addClass('one')).toEqual(element)
    })
  })

  describe('removeClass()', function() {
    it('removes the class from the node when the class exists', function() {
      var element = draw.rect(100,100)
      element.addClass('one')
      element.removeClass('one')
      expect(element.hasClass('one')).toBeFalsy()
    })

    it('does nothing when the class does not exist', function() {
      var element = draw.rect(100,100)
      element.removeClass('one')
      expect(element.hasClass('one')).toBeFalsy()
    })

    it('returns the element', function() {
      var element = draw.rect(100,100)
      expect(element.removeClass('one')).toEqual(element)
    })
  })

  describe('toggleClass()', function() {
    it('adds the class when it does not already exist', function(){
      var element = draw.rect(100,100)
      element.toggleClass('one')
      expect(element.hasClass('one')).toBeTruthy()
    })
    it('removes the class when it already exists', function(){
      var element = draw.rect(100,100)
      element.addClass('one')
      element.toggleClass('one')
      expect(element.hasClass('one')).toBeFalsy()
    })
    it('returns the svg instance', function() {
      var element = draw.rect(100,100)
      expect(element.toggleClass('one')).toEqual(element)
    })
  })

  describe('reference()', function() {
    it('gets a referenced element from a given attribute', function() {
      var rect = draw.defs().rect(100, 100)
        , use  = draw.use(rect)
        , mark = draw.marker(10, 10)
        , path = draw.path(svgPath).marker('end', mark)

      expect(use.reference('href')).toBe(rect)
      expect(path.reference('marker-end')).toBe(mark)
    })
  })
})
