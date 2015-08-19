var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UnitTest = require('../unittest');
var TestCaseTestCase = (function (_super) {
    __extends(TestCaseTestCase, _super);
    function TestCaseTestCase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(TestCaseTestCase.prototype, "name", {
        get: function () {
            return "TestCaseTestCase";
        },
        enumerable: true,
        configurable: true
    });
    TestCaseTestCase.prototype.test_assertIs = function () {
        var thing = {};
        this.assertIs(thing, thing);
        this.assertRaises(UnitTest.UnitTestError, this.assertIs, this, [thing, {}]);
    };
    TestCaseTestCase.prototype.test_assertIsNot = function () {
        var thing = {};
        this.assertIsNot(thing, {});
        this.assertRaises(UnitTest.UnitTestError, this.assertIsNot, this, [thing, thing]);
    };
    TestCaseTestCase.prototype.test_assertIn = function () {
        var animals = { 'monkey': 'banana', 'cow': 'grass', 'seal': 'fish' };
        this.assertIn('a', 'abc');
        this.assertIn(2, [1, 2, 3]);
        this.assertIn('monkey', animals);
        this.assertRaises(UnitTest.UnitTestError, this.assertIn, this, ['x', 'abc']);
        this.assertRaises(UnitTest.UnitTestError, this.assertIn, this, [4, [1, 2, 3]]);
        this.assertRaises(UnitTest.UnitTestError, this.assertIn, this, ['elephant', animals]);
    };
    TestCaseTestCase.prototype.test_assertNotIn = function () {
        var animals = { 'monkey': 'banana', 'cow': 'grass', 'seal': 'fish' };
        this.assertNotIn('d', 'abc');
        this.assertNotIn(0, [1, 2, 3]);
        this.assertNotIn('otter', animals);
        this.assertRaises(UnitTest.UnitTestError, this.assertNotIn, this, ['c', 'abc']);
        this.assertRaises(UnitTest.UnitTestError, this.assertNotIn, this, [1, [1, 2, 3]]);
        this.assertRaises(UnitTest.UnitTestError, this.assertNotIn, this, ['cow', animals]);
    };
    TestCaseTestCase.prototype.test_assertObjectContainsSubset = function () {
        this.assertObjectContainsSubset({}, {});
        this.assertObjectContainsSubset({}, { a: 1 });
        this.assertObjectContainsSubset({ a: 1 }, { a: 1 });
        this.assertObjectContainsSubset({ a: 1 }, { a: 1, b: 2 });
        this.assertObjectContainsSubset({ a: 1, b: 2 }, { a: 1, b: 2 });
        this.assertRaises(UnitTest.UnitTestError, this.assertObjectContainsSubset, this, [{ 1: 'one' }, {}]);
        this.assertRaises(UnitTest.UnitTestError, this.assertObjectContainsSubset, this, [{ a: 2 }, { a: 1 }]);
        this.assertRaises(UnitTest.UnitTestError, this.assertObjectContainsSubset, this, [{ c: 1 }, { a: 1 }]);
        this.assertRaises(UnitTest.UnitTestError, this.assertObjectContainsSubset, this, [{ a: 1, c: 1 }, { a: 1 }]);
    };
    return TestCaseTestCase;
})(UnitTest.TestCase);
exports.TestCaseTestCase = TestCaseTestCase;
