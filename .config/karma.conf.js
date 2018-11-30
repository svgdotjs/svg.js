// Karma configuration

const karmaCommon = require('./karma.conf.common.js')

let chromeBin = 'ChromeHeadless'
if (process.platform === 'linux') {
  // We need to choose either Chrome or Chromium.
  // Canary is not available on linux.
  // If we do not find Chromium then we can deduce that
  // either Chrome is installed or there is no Chrome variant at all,
  // in which case karma-chrome-launcher will output an error.
  // If `which` finds nothing it will throw an error.
  const { execSync } = require('child_process')

  try {
    if (execSync('which chromium-browser')) chromeBin = 'ChromiumHeadless'
  } catch (e) {}
}

module.exports = function (config) {
  config.set(
    Object.assign(karmaCommon(config), {
      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        'dist/svg.min.js': ['coverage']
      },

      // this specifies which plugins karma should load
      // by default all karma plugins, starting with `karma-` will load
      // so if you are really puzzled why something isn't working, then comment
      // out plugins: [] - it's here to make karma load faster
      // get possible karma plugins by `ls node_modules | grep 'karma-*'`
      plugins: [
        'karma-chrome-launcher',
        'karma-coverage',
        'karma-firefox-launcher',
        'karma-jasmine'
      ],

      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['progress', 'coverage'],

      // configure the coverage reporter
      coverageReporter: {
        // Specify a reporter type.
        type: 'lcov',
        dir: 'coverage/',
        subdir: function (browser) {
          // normalization process to keep a consistent browser name accross different OS
          return browser.toLowerCase().split(/[ /-]/)[0] // output the results into: './coverage/firefox/'
        }
      },

      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: [chromeBin, 'FirefoxHeadless']
    })
  )
}
