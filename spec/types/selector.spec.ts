import * as SVGJS from '@svgdotjs/svg.js'
import * as helpers from './helpers'

describe('Selector', function () {

  describe('SVG()', function () {
    it('gets an element\'s instance by id', function () {
      var rect = helpers.draw.rect(111, 333)

      expect(SVGJS.SVG('#' + rect.id())).toBe(rect)
    })
  })

  describe('find()', function () {
    var e1: SVGJS.Rect, e2: SVGJS.Rect, e3: SVGJS.Rect, e4: SVGJS.Rect, e5: SVGJS.Rect

    beforeEach(function () {
      e1 = helpers.draw.rect(100, 100).addClass('selectable-element')
      e2 = helpers.draw.rect(100, 100).addClass('unselectable-element')
      e3 = helpers.draw.rect(100, 100).addClass('selectable-element')
      e4 = helpers.draw.rect(100, 100).addClass('unselectable-element')
      e5 = helpers.draw.rect(100, 100).addClass('selectable-element')
    })
    it('gets all elements with a given class name', function () {
      expect(SVGJS.find('rect.selectable-element')).toEqual([e1, e3, e5])
    })
    it('returns an Array', function () {
      expect(SVGJS.find('rect.selectable-element') instanceof Array).toBe(true)
    })
  })

  describe('Parent#find()', function () {
    it('gets all elements with a given class name inside a given element', function () {
      var group = helpers.draw.group()
        , e1 = helpers.draw.rect(100, 100).addClass('selectable-element')
        , e2 = helpers.draw.rect(100, 100).addClass('unselectable-element')
        , e3 = group.rect(100, 100).addClass('selectable-element')
        , e4 = helpers.draw.rect(100, 100).addClass('unselectable-element')
        , e5 = group.rect(100, 100).addClass('selectable-element')

      expect(group.find('rect.selectable-element')).toEqual([e3, e5])
    })
  })

  describe('Parent#findOne()', function () {
    it('gets all elements with a given class name inside a given element', function () {
      var group = helpers.draw.group()
        , e1 = helpers.draw.rect(100, 100).addClass('selectable-element')
        , e2 = helpers.draw.rect(100, 100).addClass('unselectable-element')
        , e3 = group.rect(100, 100).addClass('selectable-element')
        , e4 = helpers.draw.rect(100, 100).addClass('unselectable-element')
        , e5 = group.rect(100, 100).addClass('selectable-element')

      expect(group.findOne('rect.selectable-element')).toBe(e3)
    })
  })

})
