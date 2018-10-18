# SVG.js

[![Build Status](https://travis-ci.org/svgdotjs/svg.js.svg?branch=master)](https://travis-ci.org/svgdotjs/svg.js)
[![Coverage Status](https://coveralls.io/repos/github/svgdotjs/svg.js/badge.svg?branch=master)](https://coveralls.io/github/svgdotjs/svg.js?branch=master)
[![CDNJS](https://img.shields.io/cdnjs/v/svg.js.svg)](https://cdnjs.com/libraries/svg.js)
[![Join the chat at https://gitter.im/svgdotjs/svg.js](https://badges.gitter.im/svgdotjs/svg.js.svg)](https://gitter.im/svgdotjs/svg.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

__A lightweight library for manipulating and animating SVG, without any dependencies.__

SVG.js is licensed under the terms of the MIT License.

## Installation

#### Bower:

`bower install svg.js`

#### Node:

`npm install svg.js`

#### Cdnjs:

[https://cdnjs.com/libraries/svg.js](https://cdnjs.com/libraries/svg.js)

## Documentation
Check [https://svgdotjs.github.io](https://svgdotjs.github.io/) to learn more.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=pay%40woutfierens.com&lc=US&item_name=SVG.JS&currency_code=EUR&bn=PP-DonationsBF%3Abtn_donate_74x21.png%3ANonHostedGuest)

## Development

To develop svg.js, you have a few commands available to you. Firstly, you should clone this repo, then cd into the folder with this README and run:

    npm install

You'll now have all the dev dependencies installed, and you'll be ready to build the bundle. Once you've made your changes just run:

    npm run build

This will build svg.js and make a distribution in the `/dist` folder. While developing, this may not be so convenient as the build will fail if you have any linting errors, refer to the [standard coding styleguide](https://standardjs.com/) for style we use, linters are available for most popular text editors as well.

However, because we were too nice to put you through the pain of always having to work with a linter, we added a gentle mode that you can use by running:

    npm run build:dev

This will only warn you about linting errors and give you useful feedback about possible errors you may have in your code (but this is no substitute for tests). Please make sure that **before making any pull requests**, you pass all of our tests and can build with `npm run build` first.

### Testing

This will set up everything. While you are working, you should make sure your changes pass all of our tests, so just run:

    npm run test

Or just launch the jasmine test runner from `/spec/SpecRunner.html`. Its good to try the spec runner on a few different browsers.

### Performance

You can run performance tests by making a new benchmarks, look in the `/bench` folder and just add a new js file with the test you want to make. We include a few examples in the repo to make it easy for you to make your own.

### Playgrounds

If you would like a simple sandbox that you can use

## Pull Requests

We welcome any pull requests and will try our hardest to review them as soon as possible. If you need any help or would like to chat, check out our [gitter group](https://gitter.im/svgdotjs/svg.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge), we are always happy to see new users!
