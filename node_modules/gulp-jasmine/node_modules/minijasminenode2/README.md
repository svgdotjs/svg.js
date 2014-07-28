minijasminenode2
======

Based on Jasmine-Node, but minus the fancy stuff.
This node.js module makes Pivotal Lab's Jasmine
(http://github.com/pivotal/jasmine) spec framework available in
node.js or via the command line.

version notice
--------------

minijasminenode comes in two flavors.

 - minijasminenode runs [Jasmine 1.3](http://jasmine.github.io/1.3/introduction.html)
 - minijasminenode2 runs [Jasmine 2.0](http://jasmine.github.io/2.0/introduction.html)

This is the branch for minijasminenode2. [Switch to minijasminenode](https://github.com/juliemr/minijasminenode/tree/jasmine1).

Note that there have been breaking changes between Jasmine 1.3.1 and Jasmine 2.0.
Notably, a different interface for reporters and custom matchers. Also, note that
per-spec timeouts (e.g. `it('does foo', fn, 1000))` no longer work in Jasmine 2.0.

features
--------

MiniJasmineNode exports a library which
- places Jasmine in Node's global namespace, similar to how it's run in a browser.
- adds result reporters for the terminal.
- adds the ability to load tests from file.
- adds focused specs with `iit` and `ddescribe`.

The module also contains a command line wrapper.

installation
------------

Get the library with

    npm install minijasminenode2

Or, install globally

    npm install -g minijasminenode2

If you install globally, you can use minijasminenode directly from the command line

    minijasminenode2 mySpecFolder/mySpec.js

See more options

    minijasminenode2 --help

usage
-----
```javascript
// Your test file - mySpecFolder/mySpec.js
describe('foo', function() {
  it('should pass', function() {
    expect(2 + 2).toEqual(4);
  });
});
```


```javascript
    var miniJasmineLib = require('minijasminenode2');
    // At this point, jasmine is available in the global node context.

    // Add your tests by filename.
    miniJasmineLib.addSpecs('myTestFolder/mySpec.js');

    // If you'd like to add a custom Jasmine reporter, you can do so. Tests will
    // be automatically reported to the terminal.
    miniJasmineLib.addReporter(myCustomReporter);

    // Run those tests!
    miniJasmineLib.executeSpecs(options);
```

You can also pass an options object into `executeSpecs`

````javascript
    var miniJasmineLib = require('minijasminenode2');

    var options = {
      // An array of filenames, relative to current dir. These will be
      // executed, as well as any tests added with addSpecs()
      specs: ['specDir/mySpec1.js', 'specDir/mySpec2.js'],
      // A function to call on completion.
      // function(passed)
      onComplete: function(passed) { console.log('done!'); },
      // If true, display suite and spec names.
      isVerbose: false,
      // If true, print colors to the terminal.
      showColors: true,
      // If true, include stack traces in failures.
      includeStackTrace: true,
      // Time to wait in milliseconds before a test automatically fails
      defaultTimeoutInterval: 5000
    };
    miniJasmineLib.executeSpecs(options);
````


to run the tests
----------------
`./specs.sh`

This will run passing tests as well as show examples of how failures look. To run only passing tests, use `npm test` or `./bin/minijn spec/*_spec.js`
