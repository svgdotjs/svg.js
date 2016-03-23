describe('Sugar', function() {

  var rect

  beforeEach(function() {
    draw.attr('viewBox', null)
  })

  afterEach(function() {
    draw.clear()
  })

  describe('fill()', function() {
    it('returns the node reference', function() {
      rect = draw.rect(100,100)
      expect(rect.fill('red')).toBe(rect)
    })

    it('returns the value with no argument given', function() {
      rect = draw.rect(100,100).fill('red')
      expect(rect.fill('red')).toBe('red')
    })
    
    describe('color, opacity, rule', function() {
    
      ['color', 'opacity', 'rule'].forEach(function(a){
      
        describe('fill-'+a+'()', function(){
        
          rect = draw.rect(100,100).fill('red')
        
        })
      
      })
    
    })
  })
  
  describe('()', function() {
    it('returns the node reference', function() {
      rect = draw.rect(100,100)
      expect(rect.fill('red')).toBe(rect)
    })

    it('returns the value with no argument given', function() {
      rect = draw.rect(100,100).fill('red')
      expect(rect.fill('red')).toBe('red')
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
    var rect, ctm

    beforeEach(function() {
      rect = draw.rect(100,100)
    })

    it('gets the current transformations', function() {
      expect(rect.transform()).toEqual(new SVG.Matrix(rect).extract())
    })
    it('sets the translation of and element', function() {
      rect.transform({ x: 10, y: 11 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(1,0,0,1,10,11)')
    })
    it('performs an absolute translation', function() {
      rect.transform({ x: 10, y: 11 }).transform({ x: 20, y: 21 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(1,0,0,1,20,21)')
    })
    it('performs a relative translation when relative is set to true', function() {
      rect.transform({ x: 10, y: 11 }).transform({ x: 20, y: 21, relative: true })
      expect(rect.node.getAttribute('transform')).toBe('matrix(1,0,0,1,30,32)')
    })
    it('performs a relative translation with relative flag', function() {
      rect.transform({ x: 10, y: 11 }).transform({ x: 20, y: 21 }, true)
      expect(rect.node.getAttribute('transform')).toBe('matrix(1,0,0,1,30,32)')
    })
    it('sets the scaleX and scaleY of and element', function() {
      rect.transform({ scaleX: 0.5, scaleY: 2 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(0.5,0,0,2,25,-50)')
    })
    it('performs a uniform scale with scale given', function() {
      rect.transform({ scale: 3 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(3,0,0,3,-100,-100)')
    })
    it('performs an absolute scale by default', function() {
      rect.transform({ scale: 3 }).transform({ scale: 0.5 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(0.5,0,0,0.5,25,25)')
    })
    it('performs a relative scale with a relative flag', function() {
      rect.transform({ scaleX: 0.5, scaleY: 2 }).transform({ scaleX: 3, scaleY: 4 }, true)
      expect(rect.node.getAttribute('transform')).toBe('matrix(1.5,0,0,8,-25,-350)')
    })
    it('sets the skewX of and element with center on the element', function() {
      ctm = rect.transform({ skewX: 10 }).ctm()
      expect(ctm.a).toBe(1)
      expect(ctm.b).toBe(0)
      expect(ctm.c).toBeCloseTo(0.17632698070846498)
      expect(ctm.d).toBe(1)
      expect(ctm.e).toBeCloseTo(-8.81634903542325)
      expect(ctm.f).toBe(0)
    })
    it('sets the skewX of and element with given center', function() {
      ctm = rect.transform({ skewX: 10, cx: 0, cy: 0 }).ctm()
      expect(ctm.a).toBe(1)
      expect(ctm.b).toBe(0)
      expect(ctm.c).toBeCloseTo(0.17632698070846498)
      expect(ctm.d).toBe(1)
      expect(ctm.e).toBe(0)
      expect(ctm.f).toBe(0)
    })
    it('sets the skewY of and element', function() {
      ctm = rect.transform({ skewY: -10, cx: 0, cy: 0 }).ctm()
      expect(ctm.a).toBe(1)
      expect(ctm.b).toBeCloseTo(-0.17632698070846498)
      expect(ctm.c).toBe(0)
      expect(ctm.d).toBe(1)
      expect(ctm.e).toBe(0)
      expect(ctm.f).toBe(0)
    })
    it('rotates the element around its centre if no rotation point is given', function() {
      ctm = rect.center(100, 100).transform({ rotation: 45 }).ctm()
      expect(ctm.a).toBeCloseTo(0.7071068286895752)
      expect(ctm.b).toBeCloseTo(0.7071068286895752)
      expect(ctm.c).toBeCloseTo(-0.7071068286895752)
      expect(ctm.d).toBeCloseTo(0.7071068286895752)
      expect(ctm.e).toBeCloseTo(100)
      expect(ctm.f).toBeCloseTo(-41.421356201171875)
      expect(rect.transform('rotation')).toBe(45)
    })
    it('rotates the element around the given rotation point', function() {
      ctm = rect.transform({ rotation: 55, cx: 80, cy:2 }).ctm()
      expect(ctm.a).toBeCloseTo(0.5735765099525452)
      expect(ctm.b).toBeCloseTo(0.8191521167755127)
      expect(ctm.c).toBeCloseTo(-0.8191521167755127)
      expect(ctm.d).toBeCloseTo(0.5735765099525452)
      expect(ctm.e).toBeCloseTo(35.75218963623047)
      expect(ctm.f).toBeCloseTo(-64.67931365966797)
    })
    it('transforms element using a matrix', function() {
      rect.transform({ a: 0.5, c: 0.5 })
      expect(rect.node.getAttribute('transform')).toBe('matrix(0.5,0,0.5,1,0,0)')
    })
  })

  describe('untransform()', function() {
    var circle

    beforeEach(function() {
      circle = draw.circle(100).translate(50, 100)
    })

    it('removes the transform attribute', function() {
      expect(circle.node.getAttribute('transform')).toBe('matrix(1,0,0,1,50,100)')
      circle.untransform()
      expect(circle.node.getAttribute('transform')).toBeNull()
    })
    it('resets the current transform matix', function() {
      expect(circle.ctm()).toEqual(new SVG.Matrix(1,0,0,1,50,100))
      circle.untransform()
      expect(circle.ctm()).toEqual(new SVG.Matrix)
    })
  })

  describe('ctm()', function() {
    var rect

    beforeEach(function() {
      rect = draw.rect(100, 100)
    })

    it('gets the current transform matrix of the element', function() {
      rect.translate(10, 20)
      expect(rect.ctm().toString()).toBe('matrix(1,0,0,1,10,20)')
    })
    it('returns an instance of SVG.Matrix', function() {
      expect(rect.ctm() instanceof SVG.Matrix).toBeTruthy()
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
      expect(box.x).toBeCloseTo(2,0)
      expect(box.y).toBeCloseTo(12)
      expect(box.cx).toBeCloseTo(54.5)
      expect(box.cy).toBeCloseTo(117)
      expect(box.width).toBe(105)
      expect(box.height).toBe(210)
    })
    it('returns the correct rectangular box within a viewbox', function() {
      var rect = draw.size(200,150).viewbox(0,0,100,75).rect(105,210).move(2,12)
      var box = rect.rbox()
      expect(box.x).toBeCloseTo(4)
      expect(box.y).toBeCloseTo(24)
      expect(box.cx).toBeCloseTo(56.5)
      expect(box.cy).toBeCloseTo(129)
      expect(box.width).toBe(105)
      expect(box.height).toBe(210)
    })
  })

  describe('doc()', function() {
    it('returns the parent document', function() {
      var rect = draw.rect(100,100)
      expect(rect.doc()).toBe(draw)
    })
  })

  describe('parent()', function() {
    it('contains the parent svg', function() {
      var rect = draw.rect(100,100)
      expect(rect.parent()).toBe(draw)
    })
    it('contains the parent group when in a group', function() {
      var group = draw.group()
        , rect = group.rect(100,100)
      expect(rect.parent()).toBe(group)
    })
    it('contains the parent which matches type', function() {
      var group = draw.group()
        , rect = group.rect(100,100)
      expect(rect.parent(SVG.Doc)).toBe(draw)
    })
    it('contains the parent which matches selector', function() {
      var group1 = draw.group().addClass('test')
        , group2 = group1.group()
        , rect = group2.rect(100,100)
      expect(rect.parent('.test')).toBe(group1)
    })
  })

  describe('parents()', function() {
    it('returns array of parent up to but not including the dom element filtered by type', function() {
      var group1 = draw.group().addClass('test')
        , group2 = group1.group()
        , rect = group2.rect(100,100)

      expect(rect.parents('.test')[0]).toBe(group1)
      expect(rect.parents(SVG.G)[0]).toBe(group2)
      expect(rect.parents(SVG.G)[1]).toBe(group1)
      expect(rect.parents().length).toBe(3)
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
    it('inserts the clone after the cloned element', function() {
      clone = rect.clone()
      expect(rect.next()).toBe(clone)
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

  describe('svg()', function() {
    describe('without an argument', function() {
      it('returns full raw svg when called on the main svg doc', function() {
        draw.size(100,100).rect(100,100).id(null)
        draw.circle(100).fill('#f06').id(null)
        expect(draw.svg()).toBe('<svg id="SvgjsSvg1000" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="100" height="100"><rect width="100" height="100"></rect><circle r="50" cx="50" cy="50" fill="#ff0066"></circle></svg>')
      })
      it('returns partial raw svg when called on a sub group', function() {
        var group = draw.group().id(null)
        group.rect(100,100).id(null)
        group.circle(100).fill('#f06').id(null)
        expect(group.svg()).toBe('<g><rect width="100" height="100"></rect><circle r="50" cx="50" cy="50" fill="#ff0066"></circle></g>')
      })
      it('returns a single element when called on an element', function() {
        var group = draw.group().id(null)
        group.rect(100,100).id(null)
        var circle = group.circle(100).fill('#f06').id(null)
        expect(circle.svg()).toBe('<circle r="50" cx="50" cy="50" fill="#ff0066"></circle>')
      })
    })
    describe('with raw svg given', function() {
      it('imports a full svg document', function() {
        draw.svg('<svg id="SvgjsSvg1000" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 50 50"><rect id="SvgjsRect1183" width="100" height="100"></rect><circle id="SvgjsCircle1184" r="50" cx="25" cy="25" fill="#ff0066"></circle></svg>')
        expect(draw.get(0).type).toBe('svg')
        expect(draw.get(0).children().length).toBe(2)
        expect(draw.get(0).get(0).type).toBe('rect')
        expect(draw.get(0).get(1).type).toBe('circle')
        expect(draw.get(0).get(1).attr('fill')).toBe('#ff0066')
      })
      it('imports partial svg content', function() {
        draw.svg('<g id="SvgjsG1185"><rect id="SvgjsRect1186" width="100" height="100"></rect><circle id="SvgjsCircle1187" r="50" cx="25" cy="25" fill="#ff0066"></circle></g>')
        expect(draw.get(0).type).toBe('g')
        expect(draw.get(0).get(0).type).toBe('rect')
        expect(draw.get(0).get(1).type).toBe('circle')
        expect(draw.get(0).get(1).attr('fill')).toBe('#ff0066')
      })
      it('does not import on single elements, even with an argument it acts as a getter', function() {
        var rect   = draw.rect(100,100).id(null)
          , result = rect.svg('<circle r="300"></rect>')
        expect(result).toBe('<rect width="100" height="100"></rect>')
      })
    })
  })

  describe('writeDataToDom()', function() {
    it('set all properties in el.dom to the svgjs:data attribute', function(){
      var rect = draw.rect(100,100)
      rect.dom.foo = 'bar'
      rect.dom.number = new SVG.Number('3px')

      rect.writeDataToDom()

      expect(rect.attr('svgjs:data')).toBe('{"foo":"bar","number":"3px"}')
    })
  })

  describe('setData()', function() {
    it('read all data from the svgjs:data attribute and assign it to el.dom', function(){
      var rect = draw.rect(100,100)

      rect.attr('svgjs:data', '{"foo":"bar","number":"3px"}')
      rect.setData(JSON.parse(rect.attr('svgjs:data')))

      expect(rect.dom.foo).toBe('bar')
      expect(rect.dom.number).toBe('3px')
    })
  })

  describe('point()', function() {
    it('creates a point from screen coordinates transformed in the elements space', function(){
      var rect = draw.rect(100,100)
      expect(rect.point(2,5).x).toBeCloseTo(-6)
      expect(rect.point(2,5).y).toBeCloseTo(-3)
    })
  })
})
