/* globals beforeEach, afterEach, jasmine */
import { buildCanvas, clear } from './helpers.js'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 500

beforeEach(() => {
  // buildFixtures()
  buildCanvas()
  window.container = document.getElementById('canvas')
})

afterEach(() => {
  clear()
  window.container = null
})
