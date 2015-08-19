var UnitTest = require('../unittest');
var UnitTestTests = require('./test_unittest');
var runner = new UnitTest.TestRunner(UnitTestTests, { verbose: true });
runner.run();
var TestCaseTestCase = require('./test_testcase');
runner = new UnitTest.TestRunner(TestCaseTestCase, { verbose: true });
runner.run();
