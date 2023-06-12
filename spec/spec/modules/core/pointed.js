/* globals describe, expect, it, beforeEach, container */

import { SVG } from '../../../../src/main.js'

describe('pointed.js', () => {
  let canvas, lines

  beforeEach(() => {
    canvas = SVG().addTo(container)
    const line = canvas.line(1, 2, 3, 4)
    const polygon = canvas.polygon([1, 2, 3, 4])
    const polyline = canvas.polyline([1, 2, 3, 4])
    lines = { line, polygon, polyline }
  })
  ;['line', 'polygon', 'polyline'].forEach((l) => {
    describe('for ' + l, () => {
      describe('x()', () => {
        it('sets the x value of the ' + l + 'and returns itself', () => {
          expect(lines[l].x(50)).toBe(lines[l])
          expect(lines[l].bbox().x).toBe(50)
        })

        it('gets the x value of the ' + l, () => {
          expect(lines[l].x(50).x()).toBe(50)
        })
      })

      describe('y()', () => {
        it('sets the y value of the ' + l + 'and returns itself', () => {
          expect(lines[l].y(50)).toBe(lines[l])
          expect(lines[l].bbox().y).toBe(50)
        })

        it('gets the y value of the ' + l, () => {
          expect(lines[l].y(50).y()).toBe(50)
        })
      })

      describe('width()', () => {
        it('sets the width of the ' + l + 'and returns itself', () => {
          expect(lines[l].width(50)).toBe(lines[l])
          expect(lines[l].bbox().width).toBe(50)
        })

        it('gets the width of the ' + l, () => {
          expect(lines[l].width(50).width()).toBe(50)
        })
      })

      describe('height()', () => {
        it('sets the height of the ' + l + 'and returns itself', () => {
          expect(lines[l].height(50)).toBe(lines[l])
          expect(lines[l].bbox().height).toBe(50)
        })

        it('gets the height of the ' + l, () => {
          expect(lines[l].height(50).height()).toBe(50)
        })
      })
    })
  })
})
