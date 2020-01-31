import { apiConfig } from "../../../dataStore/api-config";
import { LOGRECORD, EXCEPTIONEVENT } from "../../../constants/feed-type-names";
import { processFeedData, dataProcessingFunctions } from "./process-feed-data";

import { getTestFeedData } from "../../../../tests/utils/mock-feed";

describe("processFeedData Tests", () => {
	let testFeedData;
	let sampleLogRecordsData;
	let sampleExceptionEventData;

	beforeAll(() => {
		jest.useFakeTimers();

		Object.keys(dataProcessingFunctions).forEach(feedType =>
			dataProcessingFunctions[feedType] = jest.fn()
		);

	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	beforeEach(() => {

		testFeedData = getTestFeedData();
		sampleLogRecordsData = testFeedData[0];
		sampleExceptionEventData = testFeedData[1];
		apiConfig.feedTypesToGet = [LOGRECORD, EXCEPTIONEVENT];

	});

	test("processFeedData", () => {
		processFeedData(testFeedData);

		expect(dataProcessingFunctions[LOGRECORD]).toHaveBeenCalledWith(sampleLogRecordsData.data);
		expect(dataProcessingFunctions[EXCEPTIONEVENT]).toHaveBeenCalledWith(sampleExceptionEventData.data);
	});

	test("processFeedData", () => {
		apiConfig.feedTypesToGet[0] = "testName";

		processFeedData(testFeedData);

		expect(dataProcessingFunctions[LOGRECORD]).not.toHaveBeenCalledWith();
		expect(dataProcessingFunctions[EXCEPTIONEVENT]).toHaveBeenCalledWith(sampleExceptionEventData.data);
	});

});
