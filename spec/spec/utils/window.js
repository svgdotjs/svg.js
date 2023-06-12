/* globals describe, expect, it */

import {
  registerWindow,
  globals,
  withWindow,
  getWindow,
  saveWindow,
  restoreWindow
} from '../../../src/utils/window.js'

describe('window.js', () => {
  describe('registerWindow()', () => {
    it('sets a new window as global', () => {
      saveWindow()
      const win = {}
      const doc = {}
      registerWindow(win, doc)
      expect(globals.window).toBe(win)
      expect(globals.document).toBe(doc)
      restoreWindow() // we need this or jasmine will fail in afterAll
    })
  })

  describe('withWindow()', () => {
    it('runs a function in the specified window context', () => {
      const win = { foo: 'bar', document: {} }
      const oldWindow = globals.window
      expect(globals.window).not.toBe(win)
      withWindow({ foo: 'bar', document: {} }, () => {
        expect(globals.window).toEqual(win)
        expect(globals.document).toEqual(win.document)
      })
      expect(globals.window).toBe(oldWindow)
    })
  })

  describe('getWindow()', () => {
    it('returns the registered window', () => {
      expect(getWindow()).toBe(globals.window)
    })
  })
})
