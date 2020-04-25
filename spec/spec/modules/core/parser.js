/* globals describe, expect, it */

import parser from '../../../../src/modules/core/parser.js'
import { getWindow } from '../../../../src/utils/window.js'

describe('parser.js', () => {
  describe('parser()', () => {
    it('returns an object with svg and path', () => {
      const nodes = parser()
      expect(nodes.path).toBeDefined()
      expect(nodes.svg).toBeDefined()
    })

    it('creates an svg node in the dom', () => {
      expect(getWindow().document.querySelector('svg')).toBe(null)
      const nodes = parser()
      expect(getWindow().document.querySelector('svg')).toBe(nodes.svg.node)
    })

    it('reuses parser instance when it was removed', () => {
      const nodes = parser()
      nodes.svg.remove()
      const nodes2 = parser()
      expect(nodes.svg).toBe(nodes2.svg)
      expect(nodes.path).toBe(nodes2.path)
    })
  })
})
