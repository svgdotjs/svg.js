import Jasmine from 'jasmine'
import svgdom from 'svgdom'

import { buildCanvas, buildFixtures, clear } from './helpers.js'
import { registerWindow } from '../src/main.js'

const jasmine = new Jasmine()

//jasmine.loadConfigFile('spec/support/jasmine.json')

jasmine.loadConfig({
  "spec_dir": "spec/spec",
  "spec_files": [
    "types/*.js",
    // "!(helpers).js"
  ],
  "helpers": [
    // "helpers.js"
  ]
})

jasmine.jasmine.currentEnv_.beforeEach(() => {
  let win = /*new*/ svgdom
  registerWindow(win, win.document)
  buildCanvas()
  buildFixtures()
  global.container = win.document.getElementById('canvas')
})

jasmine.jasmine.currentEnv_.afterEach(() => {
  clear()
  global.container = null
  registerWindow()
})

jasmine.execute()
