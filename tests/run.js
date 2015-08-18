/// <reference path="../unittest.ts" />
/// <reference path="test_unittest.ts" />
var UnitTest = require('../unittest');
var UnitTestTests = require('./test_unittest');
var runner = new UnitTest.TestRunner(UnitTestTests, { verbose: true });
runner.run();
