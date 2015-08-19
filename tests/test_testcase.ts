import UnitTest = require('../unittest');

export class TestCaseTestCase extends UnitTest.TestCase {
	get name() {
		return "TestCaseTestCase";
	}

	test_assertIs() {
		let thing = {};
		this.assertIs(thing, thing);
		this.assertRaises(UnitTest.UnitTestError, this.assertIs, this,
						  [thing, {}]);
	}

	test_assertIsNot() {
		let thing = {};
		this.assertIsNot(thing, {});
		this.assertRaises(UnitTest.UnitTestError, this.assertIsNot, this,
						  [thing, thing]);
	}

	test_assertIn() {
		let animals = {'monkey': 'banana', 'cow': 'grass', 'seal': 'fish'};

		this.assertIn('a', 'abc');
		this.assertIn(2, [1, 2, 3]);
		this.assertIn('monkey', animals);

		this.assertRaises(UnitTest.UnitTestError, this.assertIn, this, ['x', 'abc']);
		this.assertRaises(UnitTest.UnitTestError, this.assertIn, this, [4, [1, 2, 3]]);
		this.assertRaises(UnitTest.UnitTestError, this.assertIn, this, ['elephant', animals]);
	}

	test_assertNotIn() {
		let animals = {'monkey': 'banana', 'cow': 'grass', 'seal': 'fish'};

		this.assertNotIn('d', 'abc');
		this.assertNotIn(0, [1, 2, 3]);
		this.assertNotIn('otter', animals);

		this.assertRaises(UnitTest.UnitTestError, this.assertNotIn, this, ['c', 'abc']);
		this.assertRaises(UnitTest.UnitTestError, this.assertNotIn, this, [1, [1, 2, 3]]);
		this.assertRaises(UnitTest.UnitTestError, this.assertNotIn, this, ['cow', animals]);
	}

	test_assertObjectContainsSubset() {
		this.assertObjectContainsSubset({}, {});
		this.assertObjectContainsSubset({}, {a: 1});
		this.assertObjectContainsSubset({a: 1}, {a: 1});
		this.assertObjectContainsSubset({a: 1}, {a: 1, b: 2});
		this.assertObjectContainsSubset({a: 1, b: 2}, {a: 1, b: 2});

		this.assertRaises(UnitTest.UnitTestError, this.assertObjectContainsSubset, this,
						  [{1: 'one'}, {}]);
		this.assertRaises(UnitTest.UnitTestError, this.assertObjectContainsSubset, this,
			  			  [{a: 2}, {a: 1}]);
		this.assertRaises(UnitTest.UnitTestError, this.assertObjectContainsSubset, this,
			  			  [{c: 1}, {a: 1}]);
		this.assertRaises(UnitTest.UnitTestError, this.assertObjectContainsSubset, this,
			  			  [{a: 1, c: 1}, {a: 1}]);

	}

	test_assertGreater() {
		this.assertGreater(2, 1);
	}
}