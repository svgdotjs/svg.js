module.exports = [{
  //  * Real mobile devices are not available
  //  *  Your account does not have access to Android devices.
  //  *  Please contact sales@saucelabs.com to add this feature to your account.
  base: 'SauceLabs',
  browserName: 'Android',
  appiumVersion: '1.5.3',
  deviceName: 'Samsung Galaxy S7 Device',
  deviceOrientation: 'portrait',
  browserName: 'Chrome',
  platformVersion: '6.0',
  platformName: 'Android'
}, {
  base: 'SauceLabs',
  browserName: 'Android',
  deviceName: 'Android Emulator',
  deviceOrientation: 'portrait'
}, {
  base: 'SauceLabs',
  browserName: 'firefox',
  version: 'latest'
}, {
  base: 'SauceLabs',
  browserName: 'chrome',
  version: 'latest'
}, {
  base: 'SauceLabs',
  browserName: 'MicrosoftEdge',
  version: 'latest',
  platform: 'Windows 10'
}, {
  base: 'SauceLabs',
  browserName: 'safari',
  platform: 'macOS 10.12',
  version: '10.0'
}, {
  base: 'SauceLabs',
  browserName: 'Safari',
  deviceName: 'iPhone SE Simulator',
  deviceOrientation: 'portrait',
  platformVersion: '10.2',
  platformName: 'iOS'
}, {
  base: 'SauceLabs',
  browserName: 'internet explorer',
  platform: 'Windows XP',
  version: '6.0'
}, {
  base: 'SauceLabs',
  browserName: 'safari',
  platform: 'OS X 10.11',
  version: '9.0'
}]
