import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap
} from "../../../../tests/utils/test-helpers";

import {
  retrieveDeviceInfo,
  retrieveGroupsInfo,
  retrieveStatusInfo,
  filterMarkerButton,
  flytoMarkerButton,
  escapeQuotes,
  getDefaultPopupText,
  getStrongText,
  getGroupsForDeviceID,
  processStatusData,
  fixMyGeotabInterpolation
} from "./popup-helpers";

import {
  groupsPropertyData,
  devicesPropertyData,
  markerList
} from "../../../dataStore/map-data";

import * as apiHelpers from "../../../services/api/helpers";

import storage from "../../../dataStore";

describe("popup helpers tests", () => {

  const testDeviceID = "testID";
  const testDeviceData = {
    "id": testDeviceID,
    "name": "testName",
    "groups": []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("retrieveDeviceInfo tests", () => {

    beforeAll(() => {
      spyOnFunction(apiHelpers, "getDeviceByID", () =>
        Promise.resolve([testDeviceData])
      );
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeEach(() => {
      jest.clearAllMocks();
      delete devicesPropertyData[testDeviceID];
    });

    test("retrieveDeviceInfo", () => {

      devicesPropertyData[testDeviceID] = testDeviceData;
      const result = retrieveDeviceInfo(testDeviceID);
      return expect(result).resolves.toBe(testDeviceData);

    });

    test("retrieveDeviceInfo", () => {
      const result = retrieveDeviceInfo(testDeviceID);
      return expect(result).resolves.toEqual(testDeviceData);

    });

    test("retrieveDeviceInfo", () => {

      spyOnFunction(apiHelpers, "getDeviceByID", () => Promise.resolve([]));

      const result = retrieveDeviceInfo(testDeviceID);
      const expectedResult = {
        ...testDeviceData,
        name: testDeviceID
      };
      return expect(result).resolves.toEqual(expectedResult);

    });

  });

  describe("retrieveGroupsInfo tests", () => {

    const testGroupID = "testGroupID";
    const mockGroupResults = [
      {
        id: testGroupID,
        name: "testGroupName",
        color: "blue"
      }
    ];

    mockGroupResults.flat = () => mockGroupResults;

    beforeAll(() => {
      spyOnFunction(apiHelpers, "makeAPIMultiCall", () =>
        Promise.resolve(mockGroupResults)
      );
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeEach(() => {
      jest.clearAllMocks();
      delete groupsPropertyData[testGroupID];
    });

    test("retrieveGroupsInfo", () => {

      const groupPromise = retrieveGroupsInfo([]);
      return groupPromise.then(result =>
        expect(Object.keys(result).length).toBe(0)
      );

    });

    test("retrieveGroupsInfo", () => {

      groupsPropertyData[testGroupID] = mockGroupResults;

      const groupPromise = retrieveGroupsInfo([testGroupID]);
      return groupPromise.then(result =>
        expect(Object.keys(result)).toEqual([testGroupID])
      );

    });

    test("retrieveGroupsInfo", () => {
      const groupPromise = retrieveGroupsInfo([testGroupID]);

      expect(apiHelpers.makeAPIMultiCall).toHaveBeenCalled();
      return groupPromise.then(result =>
        expect(Object.keys(result)).toEqual([testGroupID])
      );

    });


    test("retrieveGroupsInfo", () => {

      const testResult = [{
        ...mockGroupResults[0],
        name: false
      }];
      testResult.flat = () => testResult;
      spyOnFunction(apiHelpers, "makeAPIMultiCall", () =>
        Promise.resolve(testResult)
      );

      const groupPromise = retrieveGroupsInfo([testGroupID]);

      expect(apiHelpers.makeAPIMultiCall).toHaveBeenCalled();
      return groupPromise.then(result =>
        expect(Object.keys(result)).toEqual([testGroupID])
      );

    });
  });

  describe("retrieveStatusInfo tests", () => {

    const testStatusID = "testStatusID";
    const mockStatusResults = [
      [
        {
          data: 6,
          dateTime: new Date(),
          diagnostic: {
            id: testStatusID
          }
        }
      ]
    ];

    const mockSelectedStatuses = {
      testStatusID: {
        id: testStatusID,
        name: "testStatusName",
        unitOfMeasure: "UnitOfMeasureMetersId"
      }
    };

    beforeAll(() => {

    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeEach(() => {
      storage.selectedStatuses = mockSelectedStatuses;

      spyOnFunction(apiHelpers, "makeAPIMultiCall", () =>
        Promise.resolve(mockStatusResults)
      );

      jest.clearAllMocks();
    });

    test("retrieveStatusInfo", () => {

      storage.selectedStatuses = {};

      const statusPromise = retrieveStatusInfo(testDeviceID);

      expect(apiHelpers.makeAPIMultiCall).not.toHaveBeenCalled();
      return statusPromise.then(result =>
        expect(Object.keys(result).length).toEqual(0)
      );

    });

    test("retrieveStatusInfo", () => {

      spyOnFunction(apiHelpers, "makeAPIMultiCall", () =>
        Promise.resolve([[]])
      );

      const statusPromise = retrieveStatusInfo(testDeviceID);

      expect(apiHelpers.makeAPIMultiCall).toHaveBeenCalled();

      return statusPromise.then(result =>
        expect(Object.keys(result)).toEqual([testStatusID])
      );

    });

    test("retrieveStatusInfo", () => {

      const statusPromise = retrieveStatusInfo(testDeviceID);

      expect(apiHelpers.makeAPIMultiCall).toHaveBeenCalled();

      return statusPromise.then(result =>
        expect(Object.keys(result)).toEqual([testStatusID])
      );

    });

    test("processStatusData", () => {

      const mockResult = [[
        {
          diagnostic: {
            id: "DiagnosticIgnitionId"
          }
        }
      ]];

      const statusResult = processStatusData(mockResult, {});
      expect(statusResult).toEqual({});

    });

    test("processStatusData", () => {

      const mockResult = [[
        {
          diagnostic: {
            id: "DiagnosticEngineSpeedId"
          }
        }
      ]];

      const mockStatusData = {
        "DiagnosticEngineSpeedId": {
          data: "Jay Zuo"
        }
      };

      const statusResult = processStatusData(mockResult, mockStatusData);
      expect(statusResult).toEqual({
        "DiagnosticEngineSpeedId": {
          data: "N/A",
        }
      });

    });

    test("fixMyGeotabInterpolation", () => {

      const mockStatusData = {
        "DiagnosticEngineSpeedId": {
          data: "Jay Zuo"
        }
      };

      fixMyGeotabInterpolation(mockStatusData, false);

      expect(mockStatusData.DiagnosticEngineSpeedId.data).toEqual("N/A");

    });

  });

  test("flyToDevice", () => {
    markerList[testDeviceID] = {
      latLng: [1, 2]
    };
    mockMap(storage, 12, true);
    flyToDevice(testDeviceID);
  });

  test("filterMarkerButton", () => {
    const result = filterMarkerButton(testDeviceID);
    expect(result).toBe(
      `<button class="RTM-FocusMarkerButton" onclick="addDeviceToFilter('${testDeviceID}','Go Device')" type="button" title="Add Device to Vehicle Filter"></button>`
    );
  });

  test("filterMarkerButton", () => {
    const result = filterMarkerButton(testDeviceID, "testName");
    expect(result).toBe(
      `<button class="RTM-FocusMarkerButton" onclick="addDeviceToFilter('${testDeviceID}','testName')" type="button" title="Add Device to Vehicle Filter"></button>`
    );
  });

  test("flytoMarkerButton", () => {
    const result = flytoMarkerButton(testDeviceID);
    expect(result).toBe(
      `<button class="RTM-FocusMarkerButton" onclick="flyToDevice('${testDeviceID}')" type="button" title="Add Device to Vehicle Filter"></button>`
    );
  });

  test("escapeQuotes", () => {
    const result = escapeQuotes("test's");
    expect(result).toBe("test\\'s");
  });

  test("getDefaultPopupText", () => {
    const result = getDefaultPopupText(testDeviceID);
    expect(result).toBe("<button class=\"RTM-FocusMarkerButton\" onclick=\"flyToDevice('testID')\" type=\"button\" title=\"Add Device to Vehicle Filter\"></button><strong>testID</strong>");
  });

  test("getStrongText", () => {
    const result = getStrongText(testDeviceID);
    expect(result).toBe("<strong>testID</strong>");
  });

  test("getGroupsForDeviceID", () => {

    const result = getGroupsForDeviceID(testDeviceID);
    return result.then(data => expect(data).toEqual({}));
  });

  test("getGroupsForDeviceID", () => {

    delete devicesPropertyData[testDeviceID];

    const mockDeviceData = {
      ...testDeviceData,
      groups: ["test"]
    };

    spyOnFunction(apiHelpers, "getDeviceByID", () =>
      Promise.resolve([mockDeviceData])
    );

    spyOnFunction(apiHelpers, "makeAPIMultiCall", () =>
      Promise.resolve({ flat: () => [] })
    );

    const result = getGroupsForDeviceID(testDeviceID);

    // expect(apiHelpers.makeAPIMultiCall).toHaveBeenCalled();
    expect(apiHelpers.getDeviceByID).toHaveBeenCalledWith(testDeviceID);
    return result.then(data => expect(data).toEqual({}));

  });
});
