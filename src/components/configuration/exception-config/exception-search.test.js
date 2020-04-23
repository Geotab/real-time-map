import storage from "../../../dataStore";
import { apiConfig } from "../../../dataStore/api-config";
import { exceptionSearch } from "./exception-search";
import * as apiHelpers from "../../../services/api/helpers";
// import * as configHelpers from "../utils/config-helpers";
import {
	spyOnFunction,
	mockAPI,
	mockDateKeeper,
	createDivsWithID,
	spyOnAccessorFunction
}
from "../../../../tests/utils/test-helpers";
import { time2019, time2018 } from "../../../../tests/utils/mock-device";

const testExceptionID = "testExceptionID";
const testRuleName = "testRuleName";
const addInId = "testAddInId";

const fakeData = {
	"date": time2018,
	"userName": "yujiezuo@geotab.com",
	"configData": {
		"type": "Exception",
		"typeData": {
			"testRuleID": {
				"id": testExceptionID,
				"name": testRuleName,
				"color": { "a": 255, "b": 0, "g": 0, "r": 255 },
				"visible": true
			}
		}
	}
};

const fakeBlobData = [{
		addInId,
		data: JSON.stringify(fakeData),
		groups: [],
		id: "testID"
	},
	{
		addInId,
		data: JSON.stringify({ ...fakeData, "date": time2019 }),
		groups: [],
		id: "testID"
	}
];

describe("exception search Tests", () => {
	const mockProps = jest.fn();

	beforeAll(() => {
		jest.useFakeTimers();
		mockDateKeeper(storage, 1000);
		// spyOnFunction(configHelpers, "filterByVisibility");
		createDivsWithID(["RTM-exception-search-bar"]);
		mockAPI(apiConfig);
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		mockProps.mockClear();
	});

	test("Construction", () => {
		exceptionSearch.init(mockProps);
	});

	test.skip("loadSavedExceptionConfig1", () => {
		spyOnFunction(apiHelpers, "getBlobStorage", () => Promise.resolve([]));
		exceptionSearch.displayList = undefined;

		return exceptionSearch.loadSavedExceptionConfig(mockProps).then(() => {
			expect(exceptionSearch.displayList).not.toBeDefined();
		});
	});

	test.skip("loadSavedExceptionConfig2", () => {
		spyOnFunction(apiHelpers, "getBlobStorage", () => Promise.resolve(fakeBlobData));
		exceptionSearch.displayList = undefined;

		return exceptionSearch.loadSavedExceptionConfig(mockProps).then(() => {
			expect(exceptionSearch.displayList).toBeDefined();
		});

	});

	test("loadSavedExceptionConfig2 fail", () => {
		spyOnFunction(apiHelpers, "getBlobStorage", () => Promise.reject(fakeBlobData));
		exceptionSearch.displayList = undefined;

		return exceptionSearch.loadSavedExceptionConfig(mockProps).then(() => {
			// expect(exceptionSearch.displayList).toBeDefined();
		});

	});

	test("buildSearchList", () => {

		const testSearchInput = "Test";
		const fakeRuleResults = [{
			color: { "a": 255, "b": 0, "g": 0, "r": 255 },
			name: testRuleName,
			id: testExceptionID,
			basetype: "Custom",
		}];
		spyOnFunction(apiHelpers, "getRulesByName", () => Promise.resolve(fakeRuleResults));

		exceptionSearch.exceptionResultsCache = {
			testRuleName: undefined
		};

		return exceptionSearch.buildSearchList(testSearchInput, mockProps).then(() => {
			expect(mockProps).toHaveBeenCalled();
			expect(exceptionSearch.exceptionResultsCache.testRuleName).toBeDefined();
			expect(apiHelpers.getRulesByName).toHaveBeenCalledWith(testSearchInput);
		});
	});

	test("handleItemSelected", () => {

		const fakeEvent = {
			preventDefault: jest.fn()
		};
		spyOnFunction(exceptionSearch, "saveSelectedValue");

		exceptionSearch.handleItemSelected(fakeEvent, mockProps);

		expect(fakeEvent.preventDefault).toHaveBeenCalled();
		expect(exceptionSearch.saveSelectedValue).toHaveBeenCalledWith(mockProps);
		exceptionSearch.saveSelectedValue.mockRestore();
	});

	test("saveSelectedValue", () => {
		const fakeValue = {
			value: testRuleName
		};
		exceptionSearch.exceptionResultsCache = {
			testRuleName: {
				id: testExceptionID
			}
		};
		spyOnFunction(exceptionSearch, "saveConfig");
		spyOnAccessorFunction(exceptionSearch, "searchInput", "get", () => fakeValue);
		exceptionSearch.displayList = {
			testExceptionID: 1
		};
		exceptionSearch.saveSelectedValue(mockProps);

		expect(exceptionSearch.saveConfig).toHaveBeenCalledWith(mockProps);
		exceptionSearch.saveConfig.mockRestore();
	});

	test("saveSelectedValue", () => {
		const fakeValue = {
			value: testRuleName
		};
		exceptionSearch.exceptionResultsCache = {};
		spyOnFunction(exceptionSearch, "saveConfig");
		spyOnAccessorFunction(exceptionSearch, "searchInput", "get", () => fakeValue);

		exceptionSearch.saveSelectedValue(mockProps);

		expect(exceptionSearch.saveConfig).not.toHaveBeenCalledWith(mockProps);
		exceptionSearch.saveConfig.mockRestore();
	});

	test("deleteItemFromExceptionList", () => {
		exceptionSearch.displayList = {
			testExceptionID: 1
		};

		exceptionSearch.deleteItemFromExceptionList(testExceptionID, mockProps);

		expect(exceptionSearch.displayList.testExceptionID).not.toBeDefined();
	});

	test("toggleExceptionVisibility", () => {
		exceptionSearch.displayList = {
			testExceptionID: {
				visible: false
			}
		};
		exceptionSearch.toggleExceptionVisibility(testExceptionID, mockProps);

		expect(exceptionSearch.displayList.testExceptionID.visible).toBe(true);
	});

	test("deleteAllItems", () => {
		exceptionSearch.displayList = {
			testExceptionID: {
				visible: false
			}
		};
		exceptionSearch.deleteAllItems(mockProps);

		expect(exceptionSearch.displayList).toMatchObject({});
	});

	test("showAllItems", () => {
		exceptionSearch.displayList = {
			testExceptionID: {
				visible: false
			}
		};
		exceptionSearch.setVisibilityForAllItems(true, mockProps);

		expect(exceptionSearch.displayList.testExceptionID.visible).toBe(true);
	});

	test("hideAllItems", () => {
		exceptionSearch.displayList = {
			testExceptionID: {
				visible: true
			}
		};
		exceptionSearch.setVisibilityForAllItems(false, mockProps);

		expect(exceptionSearch.displayList.testExceptionID.visible).toBe(false);
	});

});
