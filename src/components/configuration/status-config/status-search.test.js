import storage from "../../../dataStore";
import { apiConfig } from "../../../dataStore/api-config";
import { time2019, time2018 } from "../../../../tests/utils/mock-device";
import { diagnosticSearch } from "./status-search";
import {
  spyOnFunction,
  mockAPI,
  mockDateKeeper,
  createDivsWithID,
  spyOnAccessorFunction
} from "../../../../tests/utils/test-helpers";
import * as apiHelpers from "../../../services/api/helpers";
// import * as configHelpers from "../utils/config-helpers";

const testDiagID = "testDiagID";
const testDiagName = "testDiagName";
const addInId = "testAddInId";

const fakeData = {
  "date": time2018,
  "userName": "yujiezuo@geotab.com",
  "configData": {
    "type": "Status",
    "typeData": {
      "testDiagID": {
        "id": testDiagID,
        "name": testDiagName,
        "color": { "a": 255, "b": 0, "g": 0, "r": 255 },
        "visible": true
      }
    }
  }
};

const fakeBlobData = [
  {
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

describe("Status search Tests", () => {
  const mockProps = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
    mockDateKeeper(storage, 1000);
    mockAPI(apiConfig);
    // spyOnFunction(configHelpers, "filterByVisibility");
    createDivsWithID(["RTM-status-search-bar"]);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockProps.mockClear();
  });

  test("Construction", () => {
    diagnosticSearch.init(mockProps);
  });

  test("loadSavedStatusConfig", () => {
    spyOnFunction(apiHelpers, "getBlobStorage", () => Promise.resolve([]));
    diagnosticSearch.displayList = undefined;

    return diagnosticSearch.loadSavedStatusConfig(mockProps).then(() => {
      // expect(configHelpers.filterByVisibility).not.toHaveBeenCalled();
      expect(diagnosticSearch.displayList).not.toBeDefined();
    });
  });

  test("loadSavedStatusConfig", () => {
    spyOnFunction(apiHelpers, "getBlobStorage", () => Promise.resolve(fakeBlobData));
    diagnosticSearch.displayList = undefined;

    return diagnosticSearch.loadSavedStatusConfig(mockProps).then(() => {
      // expect(configHelpers.filterByVisibility).toHaveBeenCalled();
      expect(diagnosticSearch.displayList).toBeDefined();
    });

  });

  test("buildSearchList", () => {

    const testSearchInput = "Test";
    const fakeDiagnosticResults = [{
      id: testDiagID,
      name: testDiagName,
      unitOfMeasure: "testUnit"
    }];
    spyOnFunction(apiHelpers, "getDiagnosticByName", () => Promise.resolve(fakeDiagnosticResults));

    diagnosticSearch.resultsCache = {
      testDiagName: undefined
    };

    return diagnosticSearch.buildSearchList(testSearchInput, mockProps).then(() => {
      expect(mockProps).toHaveBeenCalled();
      expect(diagnosticSearch.resultsCache.testDiagName).toBeDefined();
      expect(apiHelpers.getDiagnosticByName).toHaveBeenCalledWith(testSearchInput);
    });
  });

  test("handleItemSelected", () => {

    const fakeEvent = {
      preventDefault: jest.fn()
    };
    spyOnFunction(diagnosticSearch, "saveSelectedValue");

    diagnosticSearch.handleItemSelected(fakeEvent, mockProps);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(diagnosticSearch.saveSelectedValue).toHaveBeenCalledWith(mockProps);
    diagnosticSearch.saveSelectedValue.mockRestore();
  });

  test("saveSelectedValue", () => {
    const fakeValue = {
      value: testDiagName
    };
    diagnosticSearch.resultsCache = {
      testDiagName: {
        id: testDiagID
      }
    };
    spyOnFunction(diagnosticSearch, "saveConfig");
    spyOnAccessorFunction(diagnosticSearch, "searchInput", "get", () => fakeValue);

    diagnosticSearch.saveSelectedValue(mockProps);

    expect(diagnosticSearch.saveConfig).toHaveBeenCalledWith(mockProps);
    diagnosticSearch.saveConfig.mockRestore();
  });

  test("saveSelectedValue", () => {
    const fakeValue = {
      value: testDiagName
    };
    diagnosticSearch.resultsCache = {};
    spyOnFunction(diagnosticSearch, "saveConfig");
    spyOnAccessorFunction(diagnosticSearch, "searchInput", "get", () => fakeValue);

    diagnosticSearch.saveSelectedValue(mockProps);

    expect(diagnosticSearch.saveConfig).not.toHaveBeenCalledWith(mockProps);
    diagnosticSearch.saveConfig.mockRestore();
  });

  test("deleteItemFromStatusList", () => {
    diagnosticSearch.displayList = {
      testDiagID: 1
    };

    diagnosticSearch.deleteItemFromStatusList(testDiagID, mockProps);

    expect(diagnosticSearch.displayList.testDiagID).not.toBeDefined();
  });

  test("toggleStatusVisibility", () => {
    diagnosticSearch.displayList = {
      testDiagID: {
        visible: false
      }
    };
    diagnosticSearch.toggleStatusVisibility(testDiagID, mockProps);

    expect(diagnosticSearch.displayList.testDiagID.visible).toBe(true);
  });

  test("deleteAllItems", () => {
    diagnosticSearch.displayList = {
      testDiagID: {
        visible: false
      }
    };
    diagnosticSearch.deleteAllItems(mockProps);

    expect(diagnosticSearch.displayList).toMatchObject({});
  });

  test("showAllItems", () => {
    diagnosticSearch.displayList = {
      testDiagID: {
        visible: false
      }
    };
    diagnosticSearch.showAllItems(mockProps);

    expect(diagnosticSearch.displayList.testDiagID.visible).toBe(true);
  });

  test("hideAllItems", () => {
    diagnosticSearch.displayList = {
      testDiagID: {
        visible: true
      }
    };
    diagnosticSearch.hideAllItems(mockProps);

    expect(diagnosticSearch.displayList.testDiagID.visible).toBe(false);
  });

});