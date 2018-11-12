import Jasmine from 'jasmine'
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

jasmine.execute()
