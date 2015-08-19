
export class UnitTestError {
	constructor(cause: string) {
		this._cause = cause;
	}

	get cause() {
		return this._cause;
	}

	private _cause: string;
}

export enum TestStatus {
	SUCCESS,
	FAILURE,
	ERROR
}

export interface TestResult {
	name: string;
	msg: string;
	status: TestStatus
}

export interface TestCaseResult {
	name: string;
	results: Array<TestResult>;
}

export class TestCase {
	// Override
	get name() {
		return 'TestCase';
	}

	// Override
	setUp() {}

	// Override
	tearDown() {}

	run() {
		let results: Array<TestResult> = [];

		for (let k in this) {
			if (k.substr(0, 5) === 'test_') {
				let testName = k.substr(5);
				try {
					this.setUp();
					let ok = this[k]();
					this.tearDown();
					results.push({name: testName,
									msg: 'OK',
									status: TestStatus.SUCCESS});
				}
				catch (e) {
					if (e instanceof UnitTestError) {
						let ue: UnitTestError = e;
						results.push({name: testName,
										msg: ue.cause,
										status: TestStatus.FAILURE});
					}
					else {
						results.push({name: testName,
										msg: '' + e,
										status: TestStatus.ERROR});
					}
				}
			}
		}

		return results;
	}

	assertIs(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, '===', value);
		this.test(target === value, msg);
	}

	assertIsNot(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, '!==', value);
		this.test(target !== value, msg);
	}

	assertRaises(exceptionType: any, fun: Function, self: Object,
				 params: Array<any>, failureText?: string) {
		let raised = false;
		try {
			fun.apply(self, params);
		}
		catch (e) {
			if (e instanceof exceptionType) {
				raised = true;
			}
		}
		if (!raised) {
			failureText = failureText || ['Exception was not raised.'].join(' ');
			throw new UnitTestError(failureText);
		}
	}

	assertIn(elem: any, container: any, failureText?: string) {
		failureText = failureText || ['' + elem, 'is not in', '' + container].join(' ');
		if (typeof container === 'string' && typeof elem === 'string') {
			if ((<string>container).indexOf(elem) < 0) {
				throw new UnitTestError(failureText);
			}
		}
		else if (typeof container === 'object') {
			if (container instanceof Array) {
				let ac = <Array<any>>container;
				if (ac.indexOf(elem) < 0) {
					throw new UnitTestError(failureText);
				}
			}
			else {
				let oc = <Object>container;
				let found = false;
				for (let k in <Object>container) {
					if (k === elem) {
						found = true;
						break;
					}
				}
				if (!found) {
					throw new UnitTestError(failureText);
				}
			}
		}
		else {
			throw new UnitTestError(failureText);
		}
	}

	assertNotIn(elem: any, container: any, failureText?: string) {
		failureText = failureText || ['' + elem, 'is in', '' + container].join(' ');
		this.assertRaises(UnitTestError, this.assertIn, this, [elem, container], failureText);
	}

	assertObjectContainsSubset(subset: Object, container: Object, failureText?: string) {
		failureText = failureText ||
			['' + container, 'does not contain', '' + subset].join(' ');
		for (let k in subset) {
			if (container[k] !== subset[k]) {
				throw new UnitTestError(failureText);
			}
		}
	}

	assertEqual(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, '==', value);
		this.test(target === value, msg);
	}

	assertNotEqual(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, '!=', value);
		this.test(target !== value, msg);
	}

	assertEquivalent(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, "==", value);
		this.assertIs(typeof target, typeof value, msg)
		// this.test(typeof target === typeof value, msg);
		if (target === undefined || target === null) {
			return;
		}
		if (typeof target === 'object') {
			if (target === null) {
				this.assertIs(null, value, msg);
			}
			if (target.length !== undefined) {
				// This is an array
				this.assertIs(target.length, value.length, msg);
				for (let i = 0; i < target.length; i++) {
					this.assertEquivalent(target[i], value[i]);
				}
			}
			else {
				let targetKeys = new Array<string>();
				let valueKeys = new Array<string>();
				for (let k in target) {
					this.assertEquivalent(target[k], value[k]);
					targetKeys.push(k);
					valueKeys.push(k);
				}
				this.assertEquivalent(targetKeys, valueKeys, msg);
			}
		}
		else {
			this.assertIs(target, value, msg);
		}
	}

	assertNotEquivalent(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, '!=', value);
		var equiv: boolean = true;
		try {
			this.assertIs(target, value);
		}
		catch (e) {
			if (e instanceof UnitTestError) {
				equiv = false;
			}
		}
		this.assertIs(false, equiv, msg);
	}

	assertGreater(op1, op2) {
		this.test(op1 > op2, this.makeMsg(op1, '>', op2));
	}

	private test(p: boolean, failureText) {
		if (!p) {
			throw new UnitTestError(failureText);
		}
	}

	private makeMsg(target, op: string, value) {
		let msgArr = ['Target:', '' + target, '(' + typeof target + ')',
						op,
						'Value:', '' + value, '(' + typeof value + ')'];
		return msgArr.join(' ');
	}
}

export interface TestRunnerOptions {
	verbose?: boolean
}

export class TestRunner {
	constructor(private _module:Object, private _opts?: TestRunnerOptions) {}

	run() {
		let opts = this._opts || {};
		let allResults: Array<TestCaseResult> = [];

		var results = null;
		for (let k in this._module) {
			let obj = this._module[k];
			let test: TestCase = new obj();
			let results = test.run();
			allResults.push({name: test.name, results: results});
		}

		if (opts.verbose) {
			for (let testCaseResult of allResults ) {
				console.log(testCaseResult.name);
				for (let testResult of testCaseResult.results) {
					let status = TestStatus[testResult.status];
					console.log('    ', status, testResult.name, testResult.msg);
				}
			}
		}
	}

}
