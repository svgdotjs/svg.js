// Karma configuration
// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator

const karmaCommon = require('./karma.conf.common.js')

const SauceLabsLaunchers = {
  /** Real mobile devices are not available
   *  Your account does not have access to Android devices.
   *  Please contact sales@saucelabs.com to add this feature to your account.*/
  /*sl_android_chrome: {
    base: 'SauceLabs',
    appiumVersion: '1.5.3',
    deviceName: 'Samsung Galaxy S7 Device',
    deviceOrientation: 'portrait',
    browserName: 'Chrome',
    platformVersion: '6.0',
    platformName: 'Android'
  },*/
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
    platform: 'macOS 10.13',
    version: '12.0',
    recordVideo: true,
    recordScreenshots: true,
    screenResolution: '1024x768'
  }/*,
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
      // Concurrency level
      // how many browser should be started simultaneous
      // Saucelabs allow up to 5 concurrent sessions on the free open source tier.
      concurrency: 5,

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

      // test results reporter to use
      // possible values: 'dots', 'progress'
      // available reporters: https://npmjs.org/browse/keyword/karma-reporter
      reporters: ['spec', 'saucelabs'],

      specReporter: {
        maxLogLines: 5,             // limit number of lines logged per test
        suppressErrorSummary: false,// do print error summary
        suppressFailed: false,      // do print information about failed tests
        suppressPassed: true,       // do not print information about passed tests
        suppressSkipped: true,      // do not print information about skipped tests
        showSpecTiming: true,       // print the time elapsed for each spec
        failFast: false             // test would finish with error when a first fail occurs.
      },

      customLaunchers: SauceLabsLaunchers,

      // start these browsers
      browsers: Object.keys(SauceLabsLaunchers),
      sauceLabs: {
          testName: 'SVG.js Unit Tests',
          connectOptions: {
            noSslBumpDomains: "all"
          }
      },

      // The number of disconnections tolerated.
      browserDisconnectTolerance: 0, // well, sometimes it helps to just restart
      // How long does Karma wait for a browser to reconnect (in ms).
      browserDisconnectTimeout: 10 * 60 * 1000,
      // How long will Karma wait for a message from a browser before disconnecting from it (in ms). ~ macOS 10.12 needs more than 7 minutes
      browserNoActivityTimeout: 20 * 60 * 1000,
      // Timeout for capturing a browser (in ms).  On newer versions of iOS simulator (10.0+), the start up time could be between 3 - 6 minutes.
      captureTimeout: 12 * 60 * 1000, // this is useful if saucelabs takes a long time to boot a vm

      // Required to make Safari on Sauce Labs play nice.
      hostname: 'karmalocal.dev'
    })

  )

}
