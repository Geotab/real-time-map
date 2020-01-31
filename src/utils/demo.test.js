import {
	geotab,
	api,

	typeNameHandlers,
	callNameHandlers,

	fakeSession,
	fakeUserData,
}
from "./demo";

describe("Demo Tests", () => {

	const GET = "Get";

	let resolvedData;
	let rejectedData;

	const reject = jest.fn(err => rejectedData = EvalError);
	const resolve = jest.fn(result => resolvedData = result);

	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		resolvedData = null;
		rejectedData = null;
		jest.clearAllMocks();
	});

	describe("basic Tests", () => {

		test("geotab Construction", () => {

			const testAddin = {
				initialize: jest.fn((api, state, callback) => callback()),
				focus() {},
				blur() {}
			};

			geotab.addin.realTimeMap = () => testAddin;

			expect(testAddin.initialize).toHaveBeenCalled();

		});

		test("api.getSession", () => {
			api.getSession(resolve);
			expect(resolvedData).toMatchObject(fakeSession);
		});

		test("api.call.get.User", () => {
			api.call(GET, createGetParameters("User"), resolve, reject);
			expect(resolvedData).toMatchObject([fakeUserData]);
		});

	});

	describe.skip("GETFEED Tests", () => {

		const GETFEED = "GetFeed";

		test("api.call.GETFEED.LogRecord", () => {
			const fromDate = new Date();
			const params = createGetFeedParameters("LogRecord", { fromDate });

			api.call(GETFEED, params, resolve, reject);

			const feedResult = resolvedData;
			validateFeedResult(feedResult, new Date(fromDate).getTime() + 1);

			const { data: logRecordData } = feedResult;
			validateLogRecord(logRecordData, fromDate);
		});

		test("api.call.GETFEED.LogRecord", () => {
			const fromDate = new Date();
			const fromVersion = 2;
			const params = createGetFeedParameters("LogRecord", { fromDate }, fromVersion);

			api.call(GETFEED, params, resolve, reject);

			const feedResult = resolvedData;
			validateFeedResult(feedResult, fromVersion + 1);

			const { data: logRecordData } = feedResult;
			validateLogRecord(logRecordData, fromDate);
		});

	});

});

function createGetParameters(typeName, search) {
	return {
		typeName,
		search
	};
}

function createGetFeedParameters(typeName, search, fromVersion) {
	return {
		typeName,
		search,
		fromVersion,
	};
}

function validateFeedResult(feedResult, fromVersion = 1) {
	expect(feedResult).toHaveProperty("fromVersion", fromVersion);
}

function validateLogRecord(logRecordData, fromDate = new Date()) {

	expect(logRecordData.length).toBeGreaterThanOrEqual(0);

	logRecordData.forEach(logRecord => {
		expect(logRecord).toHaveProperty("device");
		expect(logRecord).toHaveProperty("device.id");
		expect(logRecord).toHaveProperty("id");
		expect(logRecord).toHaveProperty("latitude");
		expect(logRecord).toHaveProperty("longitude");
		expect(logRecord).toHaveProperty("speed");
		expect(logRecord).toHaveProperty("dateTime");

		expect(new Date(logRecord.dateTime) >= fromDate).toBe(true);
	});

};
