import {
  spyOnFunction,
  spyOnAccessorFunction
} from "../../../../tests/utils/test-helpers";

import {
  bindDeviceNamePopup,
  bindExceptionPopUp
} from "./path-popups";

import storage from "../../../dataStore";
import * as popupHelpers from "./popup-helpers";
import * as helper from "../../../utils/helper";

describe("path popups tests", () => {

  const testDeviceID = "test";
  const testRuleID = "testRule";

  const mockPolyLine = {
    deviceID: testDeviceID,
    ruleID: testRuleID,
    bindPopup: jest.fn(),
    on: jest.fn((event, func) => func()),
    setPopupContent: jest.fn(),
  };

  beforeAll(() => {

    spyOnFunction(popupHelpers, "retrieveDeviceInfo", () =>
      Promise.resolve({ name: "test" })
    );

    spyOnFunction(helper, "getExceptionColor", () =>
      Promise.resolve("blue")
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("bindDeviceNamePopup", () => {
    bindDeviceNamePopup(testDeviceID, mockPolyLine);
    expect(mockPolyLine.bindPopup).toHaveBeenCalled();
    expect(mockPolyLine.on).toHaveBeenCalled();
  });

  test("bindExceptionPopUp", () => {
    storage.selectedExceptions = {
      nope: {}
    };
    bindExceptionPopUp(mockPolyLine);
    expect(mockPolyLine.bindPopup).toHaveBeenCalled();
    expect(mockPolyLine.on).toHaveBeenCalled();
  });

  test("bindExceptionPopUp", () => {
    storage.selectedExceptions = {
      [testRuleID]: {}
    };
    bindExceptionPopUp(mockPolyLine);
    expect(mockPolyLine.bindPopup).toHaveBeenCalled();
    expect(mockPolyLine.on).toHaveBeenCalled();
  });

  test("bindExceptionPopUp", () => {
    storage.selectedExceptions = {
      [testRuleID]: { name: "testR" }
    };
    bindExceptionPopUp(mockPolyLine);
    expect(mockPolyLine.bindPopup).toHaveBeenCalled();
    expect(mockPolyLine.on).toHaveBeenCalled();
  });

});
