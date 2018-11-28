import { buildCanvas, buildFixtures, clear } from './helpers.js'

beforeEach(() => {
  //buildFixtures()
  buildCanvas()
  window.container = document.getElementById('canvas')
})

afterEach(() => {
  clear()
  window.container = null
})
