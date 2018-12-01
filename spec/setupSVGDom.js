import svgdom from 'svgdom'

import { buildCanvas, buildFixtures, clear } from './helpers.js'
import { registerWindow } from '../src/main.js'

function setup () {
  let win = /*new*/ svgdom
  registerWindow(win, win.document)
  buildCanvas()
  buildFixtures()
  global.container = win.document.getElementById('canvas')
}

function teardown () {
  clear()
  global.container = null
  registerWindow()
}

beforeEach(setup)
afterEach(teardown)
