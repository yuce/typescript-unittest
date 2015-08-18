/// <reference path="../unittest.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var UnitTest = require('../unittest');
var UnittestTestCase = (function (_super) {
    __extends(UnittestTestCase, _super);
    function UnittestTestCase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(UnittestTestCase.prototype, "name", {
        get: function () {
            return "UnittestTestCase";
        },
        enumerable: true,
        configurable: true
    });
    UnittestTestCase.prototype.test_assertEquivalent_number = function () {
        this.assertEquivalent(1, 1);
        this.assertNotEquivalent(1, 2);
    };
    UnittestTestCase.prototype.test_assertEquivalent_array = function () {
        var a1 = [1, 2, 3];
        var a2 = [1, 2, 3];
        var a3 = [5, 6, 7];
        var a4 = [1, 2, 3, 4];
        this.assertEquivalent(a1, a2);
        this.assertNotEquivalent(a1, a3);
        this.assertNotEquivalent(a1, a4);
    };
    return UnittestTestCase;
})(UnitTest.TestCase);
exports.UnittestTestCase = UnittestTestCase;
