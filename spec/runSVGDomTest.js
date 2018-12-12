/*
  This file has to be run with esm because node does not understand imports yet:
  node -r esm ./spec/runSvgdomTest.js || true

  Without "|| true" node reports a super long error when a test fails
 */

import Jasmine from 'jasmine'
const jasmine = new Jasmine()

jasmine.loadConfig({
  "spec_dir": "spec/",
  "spec_files": [
    "spec/types/*.js",
    "spec/utils/*.js",
    "spec/elements/*.js"
  ],
  "helpers": [
    "setupSVGDom.js"
  ]
})

jasmine.execute()
