module.exports = {
  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '../',

  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['jasmine'],

  // list of files / patterns to load in the browser
  files: [
    '.config/pretest.js',
    {
      pattern: 'spec/fixtures/fixture.css',
      included: false,
      served: true
    },
    {
      pattern: 'spec/fixtures/fixture.svg',
      included: false,
      served: true
    },
    {
      pattern: 'spec/fixtures/pixel.png',
      included: false,
      served: true
    },
    'dist/svg.js',
    'spec/spec/**/*.js'
  ],

  // requests (http or link src) will be redirect from fixtures to base/spec/fixtures by the Karma server
  proxies: {
    '/fixtures/': '/base/spec/fixtures/'
  },

  // list of files to exclude
  exclude: [],

  // Concurrency level
  // how many browser should be started simultaneous
  concurrency: Infinity,

  // enable / disable colors in the output (reporters and logs)
  colors: true

}
