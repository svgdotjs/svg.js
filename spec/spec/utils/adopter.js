/* globals describe, expect, it, beforeEach, afterEach, jasmine */

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
  root,
  G,
  Gradient,
  Dom,
  Path,
  Fragment
} from '../../../src/main.js'

import { mockAdopt, assignNewId, adopt } from '../../../src/utils/adopter.js'
import { buildFixtures } from '../../helpers.js'
import { globals, getWindow } from '../../../src/utils/window.js'

const { any, createSpy, objectContaining } = jasmine

describe('adopter.js', () => {
  let Node

  beforeEach(() => {
    Node = globals.window.Node
  })

  describe('create()', () => {
    it('creates a node of the specified type', () => {
      const rect = create('rect')
      expect(rect).toEqual(any(Node))
      expect(rect.nodeName).toBe('rect')
    })
  })

  describe('makeInstance()', () => {
    const adoptSpy = createSpy('adopt', adopt).and.callThrough()

    beforeEach(() => {
      adoptSpy.calls.reset()
      mockAdopt(adoptSpy)
    })

    afterEach(() => {
      mockAdopt()
    })

    it('creates a root-object when no argument given', () => {
      const doc = makeInstance()

      expect(doc).toEqual(any(getClass(root)))
      expect(doc).toEqual(any(Element))
    })

    it('returns a given svg.js object directly', () => {
      const rect = new Rect()
      const samerect = makeInstance(rect)
      expect(rect).toBe(samerect)
    })

    it('creates an element from passed svg string', () => {
      const rect = makeInstance('<rect width="200px" />')

      expect(adoptSpy).toHaveBeenCalledWith(any(Node))
      expect(adoptSpy).toHaveBeenCalledWith(
        objectContaining({ nodeName: 'rect' })
      )
      expect(rect).toEqual(any(Rect))
      expect(rect.parent()).toBe(null)
    })

    it('creates an element in the html namespace from passed html string', () => {
      const div = makeInstance('<div />', true)

      expect(adoptSpy).toHaveBeenCalledWith(any(Node))
      expect(adoptSpy).toHaveBeenCalledWith(
        objectContaining({
          nodeName: 'DIV',
          namespaceURI: 'http://www.w3.org/1999/xhtml'
        })
      )
      expect(div).toEqual(any(Dom))
      expect(div.parent()).toBe(null)
    })

    it('does not have its wrapper attached', () => {
      const rect = makeInstance('<rect width="200px" />')
      expect(rect.parent()).toBe(null)
    })

    it('searches for element in dom if selector given', () => {
      buildFixtures()

      const path = globals.window.document.getElementById('lineAB')

      const pathInst = makeInstance('#lineAB')
      const noEl = makeInstance('#doesNotExist')

      expect(adoptSpy).toHaveBeenCalledWith(path)
      expect(adoptSpy).toHaveBeenCalledWith(null)
      expect(pathInst).toEqual(any(Path))
      expect(noEl).toBe(null)
    })

    it('calls adopt when passed a node', () => {
      const rect = makeInstance(create('rect'))

      expect(adoptSpy).toHaveBeenCalledWith(any(Node))
      expect(adoptSpy).toHaveBeenCalledWith(
        objectContaining({ nodeName: 'rect' })
      )
      expect(rect).toEqual(any(Rect))
    })
  })

  describe('adopt()', () => {
    it('returns null of passed node is null', () => {
      expect(adopt(null)).toBe(null)
    })

    it('returns instance from node if present', () => {
      const rect = new Rect()
      expect(adopt(rect.node)).toBe(rect)
    })

    it('creates Fragment when document fragment is passed', () => {
      const frag = getWindow().document.createDocumentFragment()
      expect(adopt(frag)).toEqual(any(Fragment))
    })

    it('creates instance when node without instance is passed', () => {
      const rect = new Rect()
      const node = rect.node
      delete node.instance
      expect(adopt(node)).toEqual(any(Rect))
      expect(adopt(node)).not.toBe(rect)
    })

    it('creates instance when node without instance is passed with gradients', () => {
      const gradient = new Gradient('linear')
      const node = gradient.node
      delete node.instance
      expect(adopt(node)).toEqual(any(Gradient))
      expect(adopt(node).type).toBe('linearGradient')
      expect(adopt(node)).not.toBe(gradient)
    })

    it('creates Dom instances for unknown nodes', () => {
      const div = getWindow().document.createElement('div')
      expect(adopt(div)).toEqual(any(Dom))
    })
  })

  describe('nodeOrNew()', () => {
    it('creates a node of node argument is null', () => {
      const rect = nodeOrNew('rect', null)
      expect(rect).toEqual(any(Node))
      expect(rect.nodeName).toBe('rect')
    })

    it('returns the node if one is passed', () => {
      const div = globals.window.document.createElement('div')
      const node = nodeOrNew('something', div)

      // jasmine chucks on this when using the node directly
      expect(node.outerHTML).toBe(div.outerHTML)
    })
  })

  describe('register()/getClass()', () => {
    it('sets and gets a class from the class register', () => {
      const A = class {}
      register(A)
      expect(getClass('A')).toBe(A)
    })
  })

  describe('eid()', () => {
    it('returns a unique id', () => {
      expect(eid('foo')).not.toBe(eid('foo'))
    })
  })

  describe('assignNewId()', () => {
    it('assigns a new id if id is present on element', () => {
      const rect = new Rect().id('foo')
      assignNewId(rect.node)
      expect(rect.id()).not.toBe('foo')
    })

    it('does not set id if no id is present on element', () => {
      const rect = new Rect()
      assignNewId(rect.node)
      expect(rect.attr('id')).toBe(undefined)
    })

    it('recursively sets new ids on children', () => {
      const group = new G().id('foo')
      const rect = group.rect(100, 100).id('bar')
      assignNewId(group.node)
      expect(group.id()).not.toBe('foo')
      expect(rect.id()).not.toBe('bar')
    })
  })

  describe('extend()', () => {
    it('adds all functions in the given object to the target object', () => {
      const A = class {}

      extend(A, {
        test() {
          this.prop = 'test'
          return this
        }
      })

      expect(typeof A.prototype.test).toBe('function')
      expect(new A().test().prop).toBe('test')
    })

    it('accepts and extend multiple modules at once', () => {
      const A = class {}
      const B = class {}
      const C = class {}

      extend([A, B, C], {
        test() {
          this.prop = 'test'
          return this
        }
      })

      expect(typeof A.prototype.test).toBe('function')
      expect(new A().test().prop).toBe('test')
      expect(typeof B.prototype.test).toBe('function')
      expect(new B().test().prop).toBe('test')
      expect(typeof C.prototype.test).toBe('function')
      expect(new C().test().prop).toBe('test')
    })
  })

  describe('wrapWithAttrCheck()', () => {
    it('wraps a function so that it calls an attr function if an object is passed', () => {
      const attrSpy = createSpy('attr')

      const A = class {}
      extend(A, {
        test: wrapWithAttrCheck(function () {
          this.prop = 'test'
          return this
        }),
        attr: attrSpy
      })

      const obj = {}

      expect(new A().test().prop).toBe('test')
      expect(attrSpy).not.toHaveBeenCalled()
      new A().test(obj)
      expect(attrSpy).toHaveBeenCalledWith(obj)
    })
  })
})
