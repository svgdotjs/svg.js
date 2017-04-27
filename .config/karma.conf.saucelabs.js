// Karma configuration

// TODO: better soucelab/karma setup: https://github.com/mzabriskie/axios/blob/master/karma.conf.js

const karmaCommon = require('./karma.common')

/*function createCustomLauncher({
  browserName,
  version,
  platform,
  deviceName,
  deviceOrientation = 'portrait',
  platformVersion,
  platformName
  }) {
  return {
    base: 'SauceLabs',
    browserName,
    version,
    platform,
    deviceName,
    deviceOrientation,
    platformVersion,
    platformName
  }
}*/

const SauceLabsLaunchers = {
  /** Real mobile devices are not available
   *  Your account does not have access to Android devices.
   *  Please contact sales@saucelabs.com to add this feature to your account.*/
  sl_android_chrome: {
    base: 'SauceLabs',
    browserName: 'Android',
    appiumVersion: '1.5.3',
    deviceName: 'Samsung Galaxy S7 Device',
    deviceOrientation: 'portrait',
    //browserName: 'Chrome',
    platformVersion: '6.0',
    platformName: 'Android'
  }/*,
  sl_android: {
    base: 'SauceLabs',
    browserName: 'Android',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest'
  },
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest'
  },
  sl_windows_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    version: 'latest',
    platform: 'Windows 10'
  },
  sl_macos_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.12',
    version: '10.0'
  },
  sl_macos_iphone: {
    base: 'SauceLabs',
    browserName: 'Safari',
    deviceName: 'iPhone SE Simulator',
    deviceOrientation: 'portrait',
    platformVersion: '10.2',
    platformName: 'iOS'
  }*/
}


module.exports = function(config) {

  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.error("SAUCE_USERNAME and SAUCE_ACCESS_KEY must be provided as environment variables.")
    console.warn("Aborting Sauce Labs test")
    process.exit(1)
  }

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
        'karma-sauce-launcher',
        'karma-spec-reporter'
      ],

      // web server port
      port: 9876,

      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['spec', 'saucelabs'],

      specReporter: {
        maxLogLines: 5,             // limit number of lines logged per test
        suppressErrorSummary: false, // do not print error summary
        suppressFailed: false,      // do not print information about failed tests
        suppressPassed: true,      // do not print information about passed tests
        suppressSkipped: true,      // do not print information about skipped tests
        showSpecTiming: true,      // print the time elapsed for each spec
        failFast: false              // test would finish with error when a first fail occurs.
      },

      customLaunchers: SauceLabsLaunchers,

      // start these browsers
      browsers: Object.keys(SauceLabsLaunchers),
      sauceLabs: {
          testName: 'SVG.js Unit Tests'
      },

      // The number of disconnections tolerated.
      browserDisconnectTolerance: 1, // well, sometimes it helps to just restart
      // How long does Karma wait for a browser to reconnect (in ms).
      browserDisconnectTimeout: 5 * 60 * 1000,
      // How long will Karma wait for a message from a browser before disconnecting from it (in ms).
      browserNoActivityTimeout: 6 * 60 * 1000,
      // Timeout for capturing a browser (in ms).
      captureTimeout: 2 * 60 * 1000, // this is useful if saucelabs takes a long time to boot a vm

      // enable / disable colors in the output (reporters and logs)
      colors: true,

      // level of logging
      // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
      logLevel: config.LOG_DEBUG,

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: false,

      // Continuous Integration mode
      // if true, Karma captures browsers, runs the tests and exits
      singleRun: true,

      // Concurrency level
      // how many browser should be started simultaneous
      concurrency: 2
    })

  )

}
