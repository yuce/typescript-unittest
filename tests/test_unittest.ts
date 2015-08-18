/// <reference path="../unittest.ts" />

import UnitTest = require('../unittest');

export class UnittestTestCase extends UnitTest.TestCase {
	get name() {
		return "UnittestTestCase";
	}

	test_assertEquivalent_number() {
		this.assertEquivalent(1, 1);
		this.assertNotEquivalent(1, 2);
	}

	test_assertEquivalent_array() {
		let a1 = [1, 2, 3];
		let a2 = [1, 2, 3];
		let a3 = [5, 6, 7];
		let a4 = [1, 2, 3, 4];
		this.assertEquivalent(a1, a2);
		this.assertNotEquivalent(a1, a3);
		this.assertNotEquivalent(a1, a4);
	}
}