const webpackConfig = require("./webpack.config.test");

delete webpackConfig.entry;

module.exports = (config) => {
   config.set({
      basePath: '../',
      frameworks: ['jasmine'],
      plugins: [
         'karma-jasmine',
         'karma-chrome-launcher',
         'karma-webpack',
         'karma-firefox-launcher',
      ],
      files: [
         '.config/pretest.js',
         'spec/RAFPlugin.js',
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
         'spec/types/index.ts',
      ],
      preprocessors: {
         'spec/types/index.ts': ['webpack']
      },
      reporters: ['progress'],
      proxies: {
         '/fixtures/': '/base/spec/fixtures/'
      },

      // web server port
      port: 9876,

      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: ['ChromeHeadless', 'FirefoxHeadless'],
      singleRun: true,
      mime: {
         "text/x-typescript": ["ts", "tsx"],
      },
      webpack: webpackConfig,
      webpackMiddleware: {
         noInfo: true
      },
   })
}