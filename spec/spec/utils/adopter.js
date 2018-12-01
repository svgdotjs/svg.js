const { any, createSpy, objectContaining } = jasmine

import {
  create,
  makeInstance,
  nodeOrNew,
  register,
  getClass,
  eid,
  extend,
  wrapWithAttrCheck,
  Rect,
  Element,
  adopt,
  root
} from '../../../src/main.js'

import { mockAdopt } from '../../../src/utils/adopter.js'
import { buildFixtures } from '../../helpers.js'
import { globals } from '../../../src/utils/window.js'

describe('Adopter.js', () => {
  let Node

  beforeEach(() => {
    Node = globals.window.Node
  })

  describe('create()', () => {
    it('creates a node of the specified type', () => {
      let rect = create('rect')
      expect(rect).toEqual(any(Node))
      expect(rect.nodeName).toBe('rect')
    })
  })

  describe('makeInstance()', () => {
    const adoptSpy = createSpy('adopt')

    beforeEach(() => {
      adoptSpy.calls.reset()
      mockAdopt(adoptSpy)
    })

    afterEach(() => {
      mockAdopt()
    })

    it('creates a root-object when no argument given', () => {
      let doc = makeInstance()

      expect(doc).toEqual(any(getClass(root)))
      expect(doc).toEqual(any(Element))
    })

    it('returns a given svg.js object directly', () => {
      let rect = new Rect()
      let samerect = makeInstance(rect)
      expect(rect).toBe(samerect)
    })

    it('creates an element from passed svg string', () => {
      makeInstance('<rect width="200px">')

      expect(adoptSpy).toHaveBeenCalledWith(any(Node))
      expect(adoptSpy).toHaveBeenCalledWith(objectContaining({nodeName: 'rect'}))
    })

    it('searches for element in dom if selector given', () => {
      buildFixtures()

      let path = globals.window.document.getElementById('lineAB')

      makeInstance('#lineAB')
      makeInstance('#doesNotExist')

      expect(adoptSpy).toHaveBeenCalledWith(path)
      expect(adoptSpy).toHaveBeenCalledWith(null)
    })

    it('calls adopt when passed a node', () => {
      makeInstance(create('rect'))

      expect(adoptSpy).toHaveBeenCalledWith(any(Node))
      expect(adoptSpy).toHaveBeenCalledWith(objectContaining({nodeName: 'rect'}))
    })
  })

  describe('nodeOrNew()', () => {
    it('creates a node of node argument is null', () => {
      let rect = nodeOrNew('rect', null)
      expect(rect).toEqual(any(Node))
      expect(rect.nodeName).toBe('rect')
    })

    it('returns the node if one is passed', () => {
      let div = globals.window.document.createElement('div')
      let node = nodeOrNew('something', div)

      // jasmine chucks on this when using the node directly
      expect(node.outerHTML).toBe(div.outerHTML)
    })
  })

  describe('register()/getClass()', () => {
    it('sets and gets a class from the class register', () => {
      const a = class {}
      register(a)
      expect(getClass('a')).toBe(a)
    })
  })

  describe('eid()', () => {
    it('returns a unique id', () => {
      expect(eid('foo')).not.toBe(eid('foo'))
    })
  })

  describe('extend()', () => {
    it('adds all functions in the given object to the target object', () => {
      const a = class {}

      extend(a, {
        test () { this.prop = 'test'; return this }
      })

      expect(typeof a.prototype.test).toBe('function')
      expect(new a().test().prop).toBe('test')
    })
    it('accepts and extend multiple modules at once', () => {
      const a = class {}
      const b = class {}
      const c = class {}

      extend([a, b, c], {
        test () { this.prop = 'test'; return this }
      })

      expect(typeof a.prototype.test).toBe('function')
      expect(new a().test().prop).toBe('test')
      expect(typeof b.prototype.test).toBe('function')
      expect(new b().test().prop).toBe('test')
      expect(typeof c.prototype.test).toBe('function')
      expect(new c().test().prop).toBe('test')
    })
  })

  describe('wrapWithAttrCheck()', () => {
    it('wraps a function so that it calles an attr function if an object is passed', () => {
      const attrSpy = createSpy('attr')

      const a = class {}
      extend(a, {
        test: wrapWithAttrCheck(function () {
          this.prop = 'test'; return this
        }),
        attr: attrSpy
      })

      const obj = {}

      expect(new a().test().prop).toBe('test')
      expect(attrSpy).not.toHaveBeenCalled()
      new a().test(obj)
      expect(attrSpy).toHaveBeenCalledWith(obj)
    })
  })
})
