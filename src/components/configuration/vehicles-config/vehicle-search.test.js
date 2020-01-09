import storage from "../../../dataStore";

import {
  spyOnFunction,
  mockAPI,
  mockDateKeeper,
  createDivsWithID,
  createDivsWithClasses,
  spyOnAccessorFunction
}
  from "../../../../tests/utils/test-helpers";

import { time2019, time2018 } from "../../../../tests/utils/mock-device";
import { deviceSearch } from "./vehicle-search";
import * as apiHelpers from "../../../services/api/helpers";
import layersModel from "../../map/layers";
import { apiConfig } from "../../../dataStore/api-config";

const testDeviceID = "testDeviceID";
const testDeviceName = "testDeviceName";
const addInId = "testAddInId";

const fakeData = {
  "date": time2018,
  "userName": "yujiezuo@geotab.com",
  "configData": {
    "type": "Vehicle",
    "typeData": {
      "testDeviceID": {
        "id": testDeviceID,
        "name": testDeviceName,
        "groups": [{ "a": 255 }],
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

describe("device search Tests", () => {
  const mockProps = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
    mockAPI(apiConfig);
    mockDateKeeper(storage, 1000);
    spyOnFunction(layersModel, "hideAllLayers");
    spyOnFunction(layersModel, "createNewLayer");
    spyOnFunction(layersModel, "showLayer");
    createDivsWithID(["RTM-device-search-bar", "RTM-VehicleTitle"]);
    createDivsWithClasses(["collapsible"]);

    layersModel.layerList["Filter"] = {
      clearLayers: jest.fn()
    };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    mockProps.mockClear();
  });

  test("Construction", () => {
    deviceSearch.init(mockProps);
  });

  test("loadSavedDeviceConfig1", () => {
    spyOnFunction(apiHelpers, "getBlobStorage", () => Promise.resolve([]));
    deviceSearch.selectedIDS = undefined;

    return deviceSearch.loadSavedDeviceConfig(mockProps).then(() => {
      expect(deviceSearch.selectedIDS).not.toBeDefined();
    });
  });

  test("loadSavedExceptionConfig2", () => {
    spyOnFunction(apiHelpers, "getBlobStorage", () => Promise.resolve(fakeBlobData));
    deviceSearch.selectedIDS = undefined;

    return deviceSearch.loadSavedDeviceConfig(mockProps).then(() => {
      expect(deviceSearch.selectedIDS).toBeDefined();
    });

  });

  // test("loadSavedExceptionConfig2 fail", () => {
  //   spyOnFunction(apiHelpers, "getBlobStorage", () => Promise.reject(fakeBlobData));
  //   deviceSearch.selectedIDS = undefined;

  //   return deviceSearch.loadSavedDeviceConfig(mockProps).then(() => {
  //     // expect(deviceSearch.selectedIDS).toBeDefined();
  //   });

  // });

  test("buildSearchList", () => {

    const testSearchInput = "Test";
    const fakeDeviceResults = [
      [{
        groups: { "a": 255 },
        name: testDeviceName,
        id: testDeviceID,
      }],
      [{
        color: { "a": 255, "b": 0, "g": 0, "r": 255 },
        name: testDeviceName,
        id: testDeviceID,
      }]
    ];
    spyOnFunction(apiHelpers, "makeAPIMultiCall", () => Promise.resolve(fakeDeviceResults));
    spyOnFunction(apiHelpers, "createDeviceByNameCall", () => Promise.resolve(fakeDeviceResults));
    spyOnFunction(apiHelpers, "createGroupsByNameCall", () => Promise.resolve(fakeDeviceResults));
    deviceSearch.deviceResultsCache = {
      testDeviceName: undefined
    };

    return deviceSearch.buildSearchList(testSearchInput, mockProps).then(() => {
      expect(mockProps).toHaveBeenCalled();
      expect(deviceSearch.deviceResultsCache.testDeviceName).toBeDefined();
      expect(apiHelpers.createDeviceByNameCall).toHaveBeenCalledWith(testSearchInput);
      expect(apiHelpers.createGroupsByNameCall).toHaveBeenCalledWith(testSearchInput);
    });
  });

  test("handleItemSelected", () => {

    const fakeEvent = {
      preventDefault: jest.fn()
    };
    spyOnFunction(deviceSearch, "saveSelectedValue");

    deviceSearch.handleItemSelected(fakeEvent, mockProps);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(deviceSearch.saveSelectedValue).toHaveBeenCalledWith(mockProps);
    deviceSearch.saveSelectedValue.mockRestore();
  });

  test("saveSelectedValue", () => {
    const fakeValue = {
      value: testDeviceName
    };
    deviceSearch.deviceResultsCache = {
      testDeviceName: {
        id: testDeviceID
      }
    };
    spyOnFunction(deviceSearch, "saveConfig");
    spyOnAccessorFunction(deviceSearch, "searchInput", "get", () => fakeValue);
    deviceSearch.selectedIDS = {
      testDeviceID: 1
    };
    deviceSearch.saveSelectedValue(mockProps);

    expect(deviceSearch.saveConfig).toHaveBeenCalledWith(mockProps);
    deviceSearch.saveConfig.mockRestore();
  });

  test("saveSelectedValue", () => {
    const fakeValue = {
      value: testDeviceName
    };
    deviceSearch.exceptionResultsCache = {};
    spyOnFunction(deviceSearch, "saveConfig");
    spyOnAccessorFunction(deviceSearch, "searchInput", "get", () => fakeValue);

    deviceSearch.saveSelectedValue(mockProps);

    expect(deviceSearch.saveConfig).toHaveBeenCalledWith(mockProps);
    deviceSearch.saveConfig.mockRestore();
  });

  test("deleteItemFromDeviceList", () => {
    deviceSearch.selectedIDS = {
      testDeviceID: 1
    };

    deviceSearch.deleteItemFromdeviceList(testDeviceID, mockProps);

    expect(deviceSearch.selectedIDS.testDeviceID).not.toBeDefined();
  });

  test("toggleDeviceVisibility", () => {
    deviceSearch.selectedIDS = {
      testDeviceID: {
        visible: false
      }
    };
    deviceSearch.toggleDeviceVisibility(testDeviceID, mockProps);

    expect(deviceSearch.selectedIDS.testDeviceID.visible).toBe(true);
  });

  test("deleteAllItems", () => {
    deviceSearch.selectedIDS = {
      testDeviceID: {
        visible: false
      }
    };
    deviceSearch.deleteAllItems(mockProps);

    expect(deviceSearch.selectedIDS).toMatchObject({});
  });

  test("showAllItems", () => {
    deviceSearch.selectedIDS = {
      testDeviceID: {
        visible: false
      }
    };
    deviceSearch.showAll(mockProps);

    expect(deviceSearch.selectedIDS.testDeviceID.visible).toBe(true);
  });

  test("hideAllItems", () => {
    deviceSearch.selectedIDS = {
      testDeviceID: {
        visible: true
      }
    };
    deviceSearch.hideAll(mockProps);

    expect(deviceSearch.selectedIDS.testDeviceID.visible).toBe(false);
  });

  test("window add device to Filter", () => {
    deviceSearch.selectedIDS = {
      testDeviceID: {
        visible: false
      }
    };
    window.addDeviceToFilter(testDeviceID);

    expect(deviceSearch.selectedIDS.testDeviceID.visible).toBe(true);
  });

});
