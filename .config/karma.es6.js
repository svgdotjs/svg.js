const karmaCommon = require('./karma.conf.common.js')

module.exports = function (config) {
  config.set(
    Object.assign(karmaCommon(config), {
      files: [
        'spec/RAFPlugin.js',
        {
          pattern: 'spec/fixtures/fixture.css',
          included: false,
          served: true
        },
        {
          pattern: 'spec/fixtures/pixel.png',
          included: false,
          served: true
        },
        {
          pattern: 'src/**/*.js',
          included: false,
          served: true,
          type: 'modules'
        },
        {
          pattern: 'spec/helpers.js',
          included: false,
          served: true,
          type: 'module'
        },
        {
          pattern: 'spec/setupBrowser.js',
          included: true,
          type: 'module'
        },
        {
          pattern: 'spec/spec/*/*.js',
          included: true,
          type: 'module'
        }
      ],

      reporters: ['progress'],
      browsers: ['ChromeHeadless', 'FirefoxHeadless'],
      singleRun: false,
      concurrency: Infinity
    })
  )
}
