
class UnittestError {
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
					if (e instanceof UnittestError) {
						let ue: UnittestError = e;
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

	assertEqual(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, '===', value);
		this.test(target === value, msg);
	}

	assertNotEqual(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, '!==', value);
		this.test(target !== value, msg);
	}

	assertEquivalent(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, "==", value);
		this.assertEqual(typeof target, typeof value, msg)
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
			this.assertEqual(target, value, msg);
		}
	}

	assertNotEquivalent(target, value, failureText?: string) {
		let msg = failureText || this.makeMsg(target, '!==', value);
		var equiv: boolean = true;
		try {
			this.assertEqual(target, value);
		}
		catch (e) {
			if (e instanceof UnittestError) {
				equiv = false;
			}
		}
		this.assertEqual(false, equiv, msg);
	}

	private test(p: boolean, failureText) {
		if (!p) {
			throw new UnittestError(failureText);
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
