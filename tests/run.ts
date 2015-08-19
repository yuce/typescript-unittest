
import UnitTest = require('../unittest');

import UnitTestTests = require('./test_unittest');
let runner = new UnitTest.TestRunner(UnitTestTests, {verbose: true});
runner.run();

import TestCaseTestCase = require('./test_testcase');
runner = new UnitTest.TestRunner(TestCaseTestCase, {verbose: true});
runner.run();
