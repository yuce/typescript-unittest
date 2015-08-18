var UnittestError = (function () {
    function UnittestError(cause) {
        this._cause = cause;
    }
    Object.defineProperty(UnittestError.prototype, "cause", {
        get: function () {
            return this._cause;
        },
        enumerable: true,
        configurable: true
    });
    return UnittestError;
})();
(function (TestStatus) {
    TestStatus[TestStatus["SUCCESS"] = 0] = "SUCCESS";
    TestStatus[TestStatus["FAILURE"] = 1] = "FAILURE";
    TestStatus[TestStatus["ERROR"] = 2] = "ERROR";
})(exports.TestStatus || (exports.TestStatus = {}));
var TestStatus = exports.TestStatus;
var TestCase = (function () {
    function TestCase() {
    }
    Object.defineProperty(TestCase.prototype, "name", {
        // Override
        get: function () {
            return 'TestCase';
        },
        enumerable: true,
        configurable: true
    });
    // Override
    TestCase.prototype.setUp = function () { };
    // Override
    TestCase.prototype.tearDown = function () { };
    TestCase.prototype.run = function () {
        var results = [];
        for (var k in this) {
            if (k.substr(0, 5) === 'test_') {
                var testName = k.substr(5);
                try {
                    this.setUp();
                    var ok = this[k]();
                    this.tearDown();
                    results.push({ name: testName,
                        msg: 'OK',
                        status: TestStatus.SUCCESS });
                }
                catch (e) {
                    if (e instanceof UnittestError) {
                        var ue = e;
                        results.push({ name: testName,
                            msg: ue.cause,
                            status: TestStatus.FAILURE });
                    }
                    else {
                        results.push({ name: testName,
                            msg: '' + e,
                            status: TestStatus.ERROR });
                    }
                }
            }
        }
        return results;
    };
    TestCase.prototype.assertEqual = function (target, value, failureText) {
        var msg = failureText || this.makeMsg(target, '===', value);
        this.test(target === value, msg);
    };
    TestCase.prototype.assertNotEqual = function (target, value, failureText) {
        var msg = failureText || this.makeMsg(target, '!==', value);
        this.test(target !== value, msg);
    };
    TestCase.prototype.assertEquivalent = function (target, value, failureText) {
        var msg = failureText || this.makeMsg(target, "==", value);
        this.assertEqual(typeof target, typeof value, msg);
        // this.test(typeof target === typeof value, msg);
        if (target === undefined || target === null) {
            return;
        }
        if (typeof target === 'object') {
            if (target === null) {
                this.assertEqual(null, value, msg);
            }
            if (target.length !== undefined) {
                // This is an array
                this.assertEqual(target.length, value.length, msg);
                for (var i = 0; i < target.length; i++) {
                    this.assertEquivalent(target[i], value[i]);
                }
            }
            else {
                var targetKeys = new Array();
                var valueKeys = new Array();
                for (var k in target) {
                    this.assertEquivalent(target[k], value[k]);
                    targetKeys.push(k);
                    valueKeys.push(k);
                }
                this.assertEquivalent(targetKeys, valueKeys, msg);
            }
        }
        else {
            this.assertEqual(target, value, msg);
        }
    };
    TestCase.prototype.assertNotEquivalent = function (target, value, failureText) {
        var msg = failureText || this.makeMsg(target, '!==', value);
        var equiv = true;
        try {
            this.assertEqual(target, value);
        }
        catch (e) {
            if (e instanceof UnittestError) {
                equiv = false;
            }
        }
        this.assertEqual(false, equiv, msg);
    };
    TestCase.prototype.test = function (p, failureText) {
        if (!p) {
            throw new UnittestError(failureText);
        }
    };
    TestCase.prototype.makeMsg = function (target, op, value) {
        var msgArr = ['Target:', '' + target, '(' + typeof target + ')',
            op,
            'Value:', '' + value, '(' + typeof value + ')'];
        return msgArr.join(' ');
    };
    return TestCase;
})();
exports.TestCase = TestCase;
var TestRunner = (function () {
    function TestRunner(_module, _opts) {
        this._module = _module;
        this._opts = _opts;
    }
    TestRunner.prototype.run = function () {
        var opts = this._opts || {};
        var allResults = [];
        var results = null;
        for (var k in this._module) {
            var obj = this._module[k];
            var test = new obj();
            var results_1 = test.run();
            allResults.push({ name: test.name, results: results_1 });
        }
        if (opts.verbose) {
            for (var _i = 0; _i < allResults.length; _i++) {
                var testCaseResult = allResults[_i];
                console.log(testCaseResult.name);
                for (var _a = 0, _b = testCaseResult.results; _a < _b.length; _a++) {
                    var testResult = _b[_a];
                    var status_1 = TestStatus[testResult.status];
                    console.log('    ', status_1, testResult.name, testResult.msg);
                }
            }
        }
    };
    return TestRunner;
})();
exports.TestRunner = TestRunner;