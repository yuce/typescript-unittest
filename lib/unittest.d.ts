declare module Unittest {
    enum TestStatus {
        SUCCESS = 0,
        FAILURE = 1,
        ERROR = 2,
    }
    interface TestResult {
        name: string;
        msg: string;
        status: TestStatus;
    }
    interface TestCaseResult {
        name: string;
        results: Array<TestResult>;
    }
    class TestCase {
        name: string;
        setUp(): void;
        tearDown(): void;
        run(): TestResult[];
        assertEqual(target: any, value: any, failureText?: string): void;
        assertNotEqual(target: any, value: any, failureText?: string): void;
        assertEquivalent(target: any, value: any, failureText?: string): void;
        assertNotEquivalent(target: any, value: any, failureText?: string): void;
        private test(p, failureText);
        private makeMsg(target, op, value);
    }
    interface TestRunnerOptions {
        verbose?: boolean;
    }
    class TestRunner {
        private _module;
        private _opts;
        constructor(_module: Object, _opts?: TestRunnerOptions);
        run(): void;
    }
}
