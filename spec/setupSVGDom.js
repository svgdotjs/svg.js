import './RAFPlugin.js'
import { createHTMLWindow } from 'svgdom'

/* globals beforeEach, afterEach, jasmine */
import { buildCanvas, clear } from './helpers.js'
import { registerWindow } from '../src/main.js'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 200

function setup() {
  const win = createHTMLWindow()
  registerWindow(win, win.document)
  buildCanvas()
  // buildFixtures()
  global.container = win.document.getElementById('canvas')
}

function teardown() {
  clear()
  global.container = null
  registerWindow()
}

beforeEach(setup)
afterEach(teardown)
