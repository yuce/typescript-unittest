/// <reference path="../unittest.ts" />
/// <reference path="test_unittest.ts" />

import UnitTest = require('../unittest');
import UnitTestTests = require('./test_unittest');

let runner = new UnitTest.TestRunner(UnitTestTests, {verbose: true});
runner.run();
