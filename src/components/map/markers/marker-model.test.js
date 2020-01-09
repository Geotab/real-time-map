
import {
  deviceID,
  deviceData,
  exceptionData,
  currentExceptions,
  mapMarker,
  popupModel,
  time2019,
  time2020,
  testPaths
} from "../../../../tests/utils/mock-device";

import {
  spyOnFunction,
  mockMap,
  mockDateKeeper
} from "../../../../tests/utils/test-helpers";

import {
  createDeviceMarker,
  deviceMarkerModel,
  initDeviceExceptions,
  initFilterLayer,
  filterLayerName
} from "./marker-model";

import storage from "../../../dataStore";
import layerModel from "../layers";
import * as markerHelper from "./marker-helper";
import * as helper from "../../../utils/helper";
import * as exceptionHelpers from "../utils/exception-helpers";

import {
  logRecordsData,
  markerList,
  exceptionEventsData
} from "../../../dataStore/map-data";

describe("Device Marker Tests", () => {

  let testDeviceMarker;

  beforeAll(() => {
    jest.useFakeTimers();
    mockDateKeeper(storage, 1000);
    spyOnFunction(markerHelper, "createMapMarker", () => mapMarker);
    spyOnFunction(layerModel, "createNewLayer");
    spyOnFunction(layerModel, "addToLayer");
    spyOnFunction(layerModel, "isInLayer", () => true);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const { orderedDateTimes } = deviceData;

    const constructors = {
      deviceID,
      deviceData,
      orderedDateTimes,
      exceptionData,
      mapMarker,
      popupModel,
      currentLayers: ["movingLayer"],
    };

    testDeviceMarker = {
      ...deviceMarkerModel,
      ...constructors,
      ...testPaths,
      currentExceptions: { ...currentExceptions },
    };
  });

  test("Construction", () => {
    logRecordsData[deviceID] = deviceData;
    createDeviceMarker(deviceID);
    expect(markerList.hasOwnProperty(deviceID));
  });

  test("initDeviceExceptions", () => {

    storage.exceptionsEnabled = false;
    spyOnFunction(testDeviceMarker, "initExceptions");

    initDeviceExceptions(testDeviceMarker);

    expect(testDeviceMarker.initExceptions).not.toHaveBeenCalled();
  });


  test("initDeviceExceptions", () => {
    storage.exceptionsEnabled = true;
    exceptionEventsData[deviceID] = exceptionData;
    spyOnFunction(testDeviceMarker, "initExceptions");

    initDeviceExceptions(testDeviceMarker);

    expect(testDeviceMarker.exceptionData).toBe(exceptionData);
    expect(testDeviceMarker.initExceptions).toHaveBeenCalled();
  });

  test("initFilterLayer", () => {
    storage.selectedDevices[deviceID] = "test";
    spyOnFunction(testDeviceMarker, "setLayer");

    initFilterLayer(testDeviceMarker);

    expect(testDeviceMarker.setLayer).toHaveBeenCalledWith(filterLayerName);
  });


  test("periodChangedUpdate", () => {
    spyOnFunction(testDeviceMarker, "resetAnimation");
    spyOnFunction(testDeviceMarker, "setTransitionAnimation");

    testDeviceMarker.periodChangedUpdate(2000);

    expect(testDeviceMarker.resetAnimation).toHaveBeenCalled();
    expect(testDeviceMarker.setTransitionAnimation).toHaveBeenCalled();
  });

  test("timeChangedUpdate", () => {

    spyOnFunction(testDeviceMarker, "initExceptions");
    delete testDeviceMarker.livePath;
    delete testDeviceMarker.historicPath;
    delete testDeviceMarker.exceptionPath;

    testDeviceMarker.timeChangedUpdate(36000);

    expect(testDeviceMarker.initExceptions).toHaveBeenCalled();
  });

  test("timeChangedUpdate", () => {

    spyOnFunction(testDeviceMarker, "initExceptions");

    testDeviceMarker.timeChangedUpdate(36000);

    expect(testDeviceMarker.initExceptions).toHaveBeenCalled();
    expect(testDeviceMarker.livePath.timeChangedUpdate).toHaveBeenCalled();
    expect(testDeviceMarker.historicPath.timeChangedUpdate).toHaveBeenCalled();
    expect(testDeviceMarker.exceptionPath.timeChangedUpdate).toHaveBeenCalled();
  });

  test("updateDeviceMarker", () => {
    spyOnFunction(testDeviceMarker, "checkInLayer", () => false);
    spyOnFunction(testDeviceMarker, "setLayer");
    spyOnFunction(testDeviceMarker, "updateExceptions");

    testDeviceMarker.updateDeviceMarker(36000);

    expect(testDeviceMarker.timeChanged).toBe(false);
    expect(testDeviceMarker.popupModel.updatePopup).toHaveBeenCalled();
    expect(testDeviceMarker.checkInLayer).toHaveBeenCalled();
    expect(testDeviceMarker.setLayer).toHaveBeenCalled();
    expect(testDeviceMarker.updateExceptions).toHaveBeenCalled();
  });

  test("updateDeviceMarker", () => {

    storage.exceptionsEnabled = false;
    spyOnFunction(testDeviceMarker, "checkInLayer", () => true);
    spyOnFunction(testDeviceMarker, "setLayer");
    spyOnFunction(testDeviceMarker, "updateExceptions");
    spyOnFunction(testDeviceMarker, "updateLatLng", () => [[1, 2], false]);

    testDeviceMarker.updateDeviceMarker(36000);

    expect(testDeviceMarker.checkInLayer).toHaveBeenCalled();
    expect(testDeviceMarker.setLayer).not.toHaveBeenCalled();
    expect(testDeviceMarker.updateExceptions).not.toHaveBeenCalled();
  });

  test("updateDeviceMarker", () => {

    storage.exceptionsEnabled = false;
    spyOnFunction(testDeviceMarker, "checkInLayer", () => true);
    spyOnFunction(testDeviceMarker, "setLayer");
    spyOnFunction(testDeviceMarker, "updateExceptions");
    spyOnFunction(testDeviceMarker, "updateLatLng", () => [[1, 2], false]);

    testDeviceMarker.updateDeviceMarker(36000);

    expect(testDeviceMarker.checkInLayer).toHaveBeenCalled();
    expect(testDeviceMarker.setLayer).not.toHaveBeenCalled();
    expect(testDeviceMarker.updateExceptions).not.toHaveBeenCalled();
  });

  test("updateLatLng", () => {

    spyOnFunction(testDeviceMarker, "setHeading");

    testDeviceMarker.updateLatLng(time2019);

    expect(testDeviceMarker.setHeading).toHaveBeenCalled();

  });

  test("updateExceptions", () => {

    spyOnFunction(testDeviceMarker, "addNewException", () => true);
    spyOnFunction(testDeviceMarker, "deleteExpiredExceptions", () => true);

    testDeviceMarker.updateExceptions(time2019, [3, 6]);

    expect(testDeviceMarker.addNewException).toHaveBeenCalled();
    expect(testDeviceMarker.deleteExpiredExceptions).toHaveBeenCalled();
    expect(testDeviceMarker.livePath.setActiveException).toHaveBeenCalled();
  });

  test("updateExceptions", () => {

    spyOnFunction(testDeviceMarker, "addNewException", () => true);
    spyOnFunction(testDeviceMarker, "deleteExpiredExceptions", () => false);

    testDeviceMarker.updateExceptions(time2019, [3, 6]);

    expect(testDeviceMarker.addNewException).toHaveBeenCalled();
    expect(testDeviceMarker.deleteExpiredExceptions).toHaveBeenCalled();
    expect(testDeviceMarker.livePath.setActiveException).not.toHaveBeenCalled();
  });

  test("addNewException", () => {

    spyOnFunction(helper, "createObjectKeyIfNotExist", () => true);
    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => true);

    testDeviceMarker.addNewException(time2019, [3, 6]);

    expect(testDeviceMarker.exceptionPath.newExceptionStarted).toHaveBeenCalled();
    expect(testDeviceMarker.livePath.setActiveException).toHaveBeenCalled();

  });

  test("addNewException", () => {

    spyOnFunction(helper, "createObjectKeyIfNotExist");
    testDeviceMarker.currentExceptions = undefined;

    testDeviceMarker.addNewException(time2019 + 3000, [3, 6]);

    expect(helper.createObjectKeyIfNotExist).not.toHaveBeenCalled();

  });

  test("addNewException", () => {

    spyOnFunction(helper, "createObjectKeyIfNotExist", () => true);
    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => true);
    delete testDeviceMarker.livePath;
    delete testDeviceMarker.exceptionPath;

    testDeviceMarker.addNewException(time2019, [3, 6]);

    expect(testDeviceMarker.currentExceptions.orderedDateTimes.length).toBe(2);

  });

  test("addNewException", () => {

    spyOnFunction(helper, "createObjectKeyIfNotExist", () => false);
    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => false);

    testDeviceMarker.addNewException(time2019, [3, 6]);

    expect(testDeviceMarker.livePath.setActiveException).not.toHaveBeenCalled();
    expect(testDeviceMarker.exceptionPath.newExceptionStarted).not.toHaveBeenCalled();

  });

  test("deleteExpiredExceptions", () => {

    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => true);
    testDeviceMarker.currentExceptions = { ...currentExceptions };
    const exceptionExpired = testDeviceMarker.deleteExpiredExceptions(time2020);
    expect(exceptionExpired).toBe(true);

  });

  test("deleteExpiredExceptions", () => {

    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => false);
    testDeviceMarker.currentExceptions = {
      orderedDateTimes: [time2020 - 1000],
      [time2020 - 1000]: {
        exception1: {}
      }
    };
    const exceptionExpired = testDeviceMarker.deleteExpiredExceptions(time2020);
    expect(exceptionExpired).toBe(true);

  });

  test("updatePaths", () => {

    delete testDeviceMarker.livePath;
    delete testDeviceMarker.exceptionPath;

    testDeviceMarker.updatePaths(1, [1, 2]);

    expect(testDeviceMarker.historicPath.updateHistoricPath).toHaveBeenCalled();
  });

  test("setCurrentDateTime", () => {
    const newDateTime = 18000;
    testDeviceMarker.setCurrentDateTime(newDateTime, 36);
    expect(testDeviceMarker.prevRealDateTime).toBe(newDateTime);
  });


  test("setCurrentDateTime", () => {

    const newDateTime = testDeviceMarker.orderedDateTimes[0];
    testDeviceMarker.setCurrentDateTime(newDateTime, 1);
    expect(testDeviceMarker.prevRealDateTime).toBe(newDateTime);

  });

  test("moveToLatLng", () => {
    const moved = testDeviceMarker.moveToLatLng(false);
    expect(moved).toBe(false);
  });

  test("moveToLatLng", () => {

    const fakeLatLng = {
      equals: jest.fn(() => true)
    };
    spyOnFunction(testDeviceMarker.mapMarker, "getLatLng", () => fakeLatLng);

    const moved = testDeviceMarker.moveToLatLng(true);
    expect(moved).toBe(false);
  });

  test("setTransitionAnimation", () => {
    spyOnFunction(testDeviceMarker.mapMarker, "getElement", () => false);
    testDeviceMarker.setTransitionAnimation();
    expect(testDeviceMarker.mapMarker.getElement).toHaveBeenCalled();
  });

  test("resetAnimation", () => {
    testDeviceMarker.resetAnimation();
    expect(testDeviceMarker.mapMarker.getElement).toHaveBeenCalled();
  });

  test("resetAnimation", () => {
    const fakeElement = {
      style: {}
    };

    spyOnFunction(testDeviceMarker.mapMarker, "getElement", () => fakeElement);
    testDeviceMarker.resetAnimation();
    expect(testDeviceMarker.mapMarker.getElement).toHaveBeenCalled();
  });

  test("setToMoving", () => {
    testDeviceMarker.isMoving = true;
    testDeviceMarker.setToMoving();
    expect(testDeviceMarker.isMoving).toBe(true);
  });

  test("setLayer", () => {
    testDeviceMarker.setLayer(filterLayerName);
    expect(layerModel.addToLayer).toHaveBeenCalled();
  });

  test("checkInLayer", () => {
    testDeviceMarker.checkInLayer(filterLayerName);
    expect(layerModel.isInLayer).toHaveBeenCalledTimes(4);
  });

  test("initExceptions", () => {
    storage.historicalComplete = true;
    storage.exceptionsEnabled = true;
    spyOnFunction(exceptionHelpers, "getActiveExceptionsForTime", () => currentExceptions);

    testDeviceMarker.initExceptions();

    expect(testDeviceMarker.currentExceptions).toBe(currentExceptions);
  });

  test("initExceptions", () => {
    storage.historicalComplete = true;
    storage.exceptionsEnabled = true;
    spyOnFunction(exceptionHelpers, "getActiveExceptionsForTime", () => false);

    testDeviceMarker.initExceptions();

    expect(testDeviceMarker.currentExceptions.orderedDateTimes.length).toBe(0);
  });

  test("unsubscribe", () => {
    testDeviceMarker.subscription = {
      unsubscribe: jest.fn(),
    };
    testDeviceMarker.unsubscribe();
    expect(testDeviceMarker.subscription.unsubscribe).toHaveBeenCalled();
  });

  test("setHeading", () => {

    spyOnFunction(helper, "calculateAnimatedAngleDelta", () => 360);
    testDeviceMarker.setHeading([1, 2], [3, 4]);
  });
});