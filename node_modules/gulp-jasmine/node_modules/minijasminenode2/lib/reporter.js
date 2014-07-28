var noopTimer = {
  start: function() {},
  elapsed: function() { return 0; }
};

/**
 * Reporter for the terminal. Based on the console reporter from Jasmine 2.0.0
 * and the verbose terminal reporter from Jasmine-Node.
 *
 * @constructor
 * @param {Object} options
 */
exports.TerminalReporter = function(options) {
  var print = options.print,
    showColors = options.showColors || false,
    done = options.done || function() {},
    isVerbose = options.isVerbose || false,
    verboseIndent = 0,
    timer = options.timer || noopTimer,
    includeStackTrace = options.includeStackTrace || false,
    stackFilter = options.stackFilter || function(string) {return string},
    specCount,
    failureCount,
    failedSpecs = [],
    pendingCount,
    ansi = {
      green: '\x1B[32m',
      red: '\x1B[31m',
      yellow: '\x1B[33m',
      none: '\x1B[0m'
    };

  this.jasmineStarted = function(specInfo) {
    if (isVerbose) {
      print('Running ' + specInfo.totalSpecsDefined + ' specs.');
      printNewline();
    }
    specCount = 0;
    failureCount = 0;
    pendingCount = 0;
    timer.start();
  };

  this.jasmineDone = function() {
    printNewline();
    if (failedSpecs.length) {
      printNewline();
      print('Failures: ');
    }
    for (var i = 0; i < failedSpecs.length; i++) {
      specFailureDetails(i, failedSpecs[i]);
    }

    printNewline();
    var specCounts = specCount + ' ' + plural('spec', specCount) + ', ' +
      failureCount + ' ' + plural('failure', failureCount);

    if (pendingCount) {
      specCounts += ', ' + pendingCount + ' pending ' + plural('spec', pendingCount);
    }

    print(specCounts);

    printNewline();
    var seconds = timer.elapsed() / 1000;
    print('Finished in ' + seconds + ' ' + plural('second', seconds));

    printNewline();

    done(failureCount === 0);
  };

  this.suiteStarted = function(suite) {
    if (isVerbose) {
      printNewline();
      print(indent(suite.description, verboseIndent));
      verboseIndent += 2;
    }
  };

  this.suiteDone = function() {
    if (isVerbose) {
      verboseIndent -= 2;
    }
  }

  this.specDone = function(result) {
    specCount++;
    var suffix = '';
    if (isVerbose) {
      printNewline();
    }

    if (result.status == 'pending') {
      pendingCount++;
      var text = isVerbose ? indent(result.description + ': pending', verboseIndent + 2) : '*';
      print(colored('yellow', text));
      return;
    }

    if (result.status == 'passed') {
      var text = isVerbose ? indent(result.description + ': passed', verboseIndent + 2) : '.';
      print(colored('green', text));
      return;
    }

    if (result.status == 'failed') {
      failureCount++;
      failedSpecs.push(result);
      var text = isVerbose ? indent(result.description + ': failed', verboseIndent + 2) : 'F';
      print(colored('red', text));
    }
    // TODO - do we want to output failure info in real-time when verbose?
  };

  function printNewline() {
    print('\n');
  }

  function colored(color, str) {
    return showColors ? (ansi[color] + str + ansi.none) : str;
  }

  function plural(str, count) {
    return count == 1 ? str : str + 's';
  }

  function repeat(thing, times) {
    var arr = [];
    for (var i = 0; i < times; i++) {
      arr.push(thing);
    }
    return arr;
  }

  function indent(str, spaces) {
    var lines = (str || '').split('\n');
    var newArr = [];
    for (var i = 0; i < lines.length; i++) {
      newArr.push(repeat(' ', spaces).join('') + lines[i]);
    }
    return newArr.join('\n');
  }

  function specFailureDetails(index, result) {
    printNewline();
    print((index + 1) + ') ');
    print(result.fullName);

    for (var i = 0; i < result.failedExpectations.length; i++) {
      printNewline();
      print(indent((index + 1) + '.' + (i + 1) + ') ', 0));
      var failedExpectation = result.failedExpectations[i];
      print(colored('red', failedExpectation.message));
      if (includeStackTrace) {
        printNewline();
        print(indent(stackFilter(failedExpectation.stack), 4));
      }
    }

    printNewline();
  }
};
