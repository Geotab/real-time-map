import {
  spyOnFunction,
  mockMap,
  mockDateKeeper,
  mockAPI
} from "../../../../tests/utils/test-helpers";

import {
  deviceID,
  testDeviceMarker
} from "../../../../tests/utils/mock-device";

import {
  initMarkerPopup,
  markerPopupModel,
  createGroupNamesDiv,
  createStatusDataDiv,
  createSpeedRow
} from "./marker-popup";

import {
  devicesPropertyData,
} from "../../../dataStore/map-data";

import { apiConfig } from "../../../dataStore/api-config";

import L from "leaflet";
import * as popupHelpers from "./popup-helpers";
import storage from "../../../dataStore";

describe("marker popup tests", () => {

  let testPopupModel;

  beforeAll(() => {
    mockDateKeeper(storage, 1000);
    mockMap(storage, 12, true);
    mockAPI(apiConfig);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const constructors = {
      deviceID,
      popup: {
        getElement: jest.fn(),
        setContent: jest.fn(),
      },
      mapMarker: {
        isPopupOpen: jest.fn(() => true),
        getLatLng: jest.fn(() => testDeviceMarker.currentlatLng)
      },
    };

    testPopupModel = {
      ...markerPopupModel,
      ...constructors
    };
  });

  test("initMarkerPopup", () => {
    const mockMarker = { ...testDeviceMarker };
    spyOnFunction(mockMarker.mapMarker, "on", (event, callBack) => callBack());

    initMarkerPopup(mockMarker);
    expect(mockMarker.popupModel).toHaveProperty("updatePopup");
  });

  test("updatePopup", () => {
    spyOnFunction(testPopupModel.mapMarker, "isPopupOpen", () => false);
    testPopupModel.updatePopup(6);
    expect(testPopupModel.mapMarker.isPopupOpen).toHaveBeenCalled();
  });

  test("updatePopup", () => {
    spyOnFunction(popupHelpers, "getGroupsForDeviceID", () =>
      Promise.resolve(["testGroups"])
    );
    spyOnFunction(popupHelpers, "retrieveStatusInfo", () =>
      Promise.resolve(["testStatus"])
    );
    spyOnFunction(testPopupModel, "keepPopupCentered");

    devicesPropertyData[deviceID] = {
      name: "Test"
    };

    testPopupModel.updatePopup(6);

    expect(testPopupModel.mapMarker.isPopupOpen).toHaveBeenCalled();
    expect(popupHelpers.getGroupsForDeviceID).toHaveBeenCalled();
    expect(popupHelpers.retrieveStatusInfo).toHaveBeenCalled();
  });

  test("updatePopup", () => {
    spyOnFunction(popupHelpers, "getGroupsForDeviceID", () =>
      Promise.resolve(["testGroups"])
    );
    spyOnFunction(popupHelpers, "retrieveStatusInfo", () =>
      Promise.resolve(["testStatus"])
    );
    spyOnFunction(testPopupModel, "keepPopupCentered");

    devicesPropertyData[deviceID] = {
      name: "Test"
    };

    testPopupModel.nextUpdateTick = 0;
    testPopupModel.updatePopup(6);

    expect(testPopupModel.mapMarker.isPopupOpen).toHaveBeenCalled();
    expect(popupHelpers.getGroupsForDeviceID).not.toHaveBeenCalled();
    expect(popupHelpers.retrieveStatusInfo).not.toHaveBeenCalled();
  });


  test("setTransitionAnimation", () => {

    const element = {
      style: {}
    };
    spyOnFunction(testPopupModel.popup, "getElement", () => element);

    testPopupModel.setTransitionAnimation();

    expect(element.style[L.DomUtil.TRANSITION]).toEqual("transform 1s linear");
    expect(testPopupModel.popup.getElement).toHaveBeenCalled();
  });

  test("resetAnimation", () => {

    const element = {
      style: {}
    };

    testPopupModel.popup.getElement = () => element;
    testPopupModel.resetAnimation();

    expect(element.style[L.DomUtil.TRANSITION]).toEqual("");
  });

  test("resetAnimation", () => {

    spyOnFunction(testPopupModel.popup, "getElement", () => undefined);

    testPopupModel.resetAnimation();

    expect(testPopupModel.popup.getElement).toHaveBeenCalled();

  });

  test("keepPopupCentered", () => {

    testPopupModel.keepPopupCentered();
    expect(testPopupModel.mapMarker.getLatLng).toHaveBeenCalled();

  });

  test("createGroupNamesDiv", () => {

    const result = createGroupNamesDiv(undefined);
    expect(result).toBeUndefined();
  });

  test("createGroupNamesDiv", () => {

    const group1 = "group1";
    const group2 = "group2";

    const testGroups = {
      [group1]: {},
      [group2]: {}
    };
    const result = createGroupNamesDiv(testGroups);
    expect(result).toBeUndefined();
  });

  test("createGroupNamesDiv", () => {

    const group1 = "group1";
    const group2 = "group2";

    const testGroups = {
      [group1]: {
        name: group1
      },
      [group2]: {
        name: group2
      }
    };
    const result = createGroupNamesDiv(testGroups);
    expect(result).toBe("<p class=\"RTM-popupGrouped\"> group1,group2 </p>");
  });

  test("createStatusDataDiv", () => {

    const result = createStatusDataDiv(undefined);
    expect(result).toBe("");

  });

  test("createSpeedRow", () => {

    const result = createSpeedRow(undefined);
    expect(result).toBeUndefined();

  });

});
