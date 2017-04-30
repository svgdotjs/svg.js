// Karma configuration

const karmaCommon = require('./karma.common')

module.exports = function(config) {

  config.set(

    Object.assign(karmaCommon, {

      // this specifies which plugins karma should load
      // by default all karma plugins, starting with `karma-` will load
      // so if you are really puzzled why something isn't working, then comment
      // out plugins: [] - it's here to make karma load faster
      // get possible karma plugins by `ls node_modules | grep 'karma-*'`
      plugins: [
        'karma-coverage',
        'karma-jasmine',
        'karma-safari-launcher',
        'karma-spec-reporter'
      ],

      // web server port
      port: 9877,

      // start these browsers
      // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
      browsers: ['safari'],

      // preprocess matching files before serving them to the browser
      // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
      preprocessors: {
        'dist/svg.js': ['coverage']
      },

      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['spec', 'coverage'],

      specReporter: {
        maxLogLines: 5,             // limit number of lines logged per test
        suppressErrorSummary: false, // do not print error summary
        suppressFailed: false,      // do not print information about failed tests
        suppressPassed: false,      // do not print information about passed tests
        suppressSkipped: true,      // do not print information about skipped tests
        showSpecTiming: true,      // print the time elapsed for each spec
        failFast: false              // test would finish with error when a first fail occurs.
      },

      // configure the coverage reporter
      coverageReporter: {
        // Specify a reporter type.
        type: 'lcov',
        dir: 'coverage/',
        subdir: function(browser) {
          // normalization process to keep a consistent browser name accross different OS
          return browser.toLowerCase().split(/[ /-]/)[0]; // output the results into: './coverage/firefox/'
        }
      },

      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: Infinity,

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: false,

      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: false,

      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_INFO,

    })

  )

}
