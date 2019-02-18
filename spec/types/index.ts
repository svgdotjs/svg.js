// run all test
declare var require: any;

const testsContext = require.context(".", true, /\.spec.ts$/);
testsContext.keys().forEach(testsContext);