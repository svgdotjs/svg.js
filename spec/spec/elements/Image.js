/* globals describe, expect, it, jasmine */

import { Image, Pattern, SVG } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'

const { any, objectContaining, createSpy } = jasmine

const url = 'spec/fixtures/pixel.png'
describe('Image.js', () => {
  describe('()', () => {
    it('creates a new object of type Image', () => {
      expect(new Image()).toEqual(any(Image))
    })

    it('sets passed attributes on the element', () => {
      expect(new Image({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('load()', () => {
    it('is a noop when url is falsy and returns itself', () => {
      const image = Object.freeze(new Image())
      expect(image.load()).toBe(image)
    })

    it('executes a callback when the image is loaded', (done) => {
      const spy = createSpy('image', (e) => {
        expect(e.target.complete).toBe(true)
        expect(spy.calls.all()).toEqual([
          objectContaining({ object: image, args: [any(getWindow().Event)] })
        ])
        done()
      }).and.callThrough()

      const image = new Image().load(url, spy)
    })

    it('errors when image cant be loaded', () => {
      // cant test this because of jasmine timeouts and browser disconnects
    })

    // it('sets the width and height of the image automatically', () => {
    //   const image = new Image('spec/fixtures/pixel.png')
    // })

    it('should set width and height automatically if no size is given', (done) => {
      const image = new Image().load(url, () => {
        expect(image.attr('height')).toBe(1)
        expect(image.attr('width')).toBe(1)
        done()
      })
    })

    it('should not change with and height when size already set', (done) => {
      const image = new Image()
        .load(url, () => {
          expect(image.attr('height')).toBe(100)
          expect(image.attr('width')).toBe(100)
          done()
        })
        .size(100, 100)
    })

    it('changes size of pattern to image size if parent is pattern and size is 0', (done) => {
      const pattern = new Pattern().size(0, 0)
      new Image()
        .load(url, () => {
          expect(pattern.attr('height')).toBe(100)
          expect(pattern.attr('width')).toBe(100)
          done()
        })
        .size(100, 100)
        .addTo(pattern)
    })

    it('does not change size of pattern if pattern has a size set', (done) => {
      const pattern = new Pattern().size(50, 50)
      new Image()
        .load(url, () => {
          expect(pattern.attr('height')).toBe(50)
          expect(pattern.attr('width')).toBe(50)
          done()
        })
        .size(100, 100)
        .addTo(pattern)
    })
  })

  describe('Container', () => {
    describe('image()', () => {
      it('creates image in the container', () => {
        const canvas = SVG()
        const image = canvas.image(url)
        expect(image).toBe(image)
        expect(canvas.children()).toEqual([image])
      })
    })
  })

  describe('attribute hook', () => {
    it('creates a pattern in defs when value is an image and puts image there', () => {
      const canvas = SVG()
      const image = new Image()
      canvas.rect(100, 100).attr('something', image)
      expect(canvas.defs().children()).toEqual([any(Pattern)])
      expect(canvas.defs().findOne('image')).toBe(image)
    })

    it('creates an image from image path in defs with pattern when attr is fill', () => {
      const canvas = SVG()
      canvas.rect(100, 100).attr('fill', url)
      expect(canvas.defs().children()).toEqual([any(Pattern)])
      expect(canvas.defs().findOne('image').attr('href')).toBe(url)
    })

    it('creates an image from image path in defs with pattern when attr is stroke', () => {
      const canvas = SVG()
      canvas.rect(100, 100).attr('stroke', url)
      expect(canvas.defs().children()).toEqual([any(Pattern)])
      expect(canvas.defs().findOne('image').attr('href')).toBe(url)
    })
  })
})
