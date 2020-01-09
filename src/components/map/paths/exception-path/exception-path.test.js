import {
  getTestMarker,
  exceptionData,
  deviceData,
  deviceID
} from "../../../../../tests/utils/mock-device";

import {
  spyOnFunction
} from "../../../../../tests/utils/test-helpers";

import {
  initExceptionPath,
  exceptionPathModel
} from "./exception-path";

import storage from "../../../../dataStore";
import layersModel from "../../layers";
import * as exceptionPathHelpers from "./exception-path-helper";
import * as exceptionHelpers from "../../utils/exception-helpers";
import * as utilsHelpers from "../../../../utils/helper";

describe("Exception path Tests", () => {

  let testExceptionPath;

  const testLatLng = [18, 36];
  const testMarker = getTestMarker();

  const exception1 = "exception1";
  const exception2 = "exception2";

  beforeAll(() => {
    jest.useFakeTimers();

    spyOnFunction(exceptionPathHelpers, "addLatlngToExeptionPath");
    spyOnFunction(exceptionPathHelpers, "createNewExceptionPolyLine", () => new Object());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const polylines = {
      [exception1]: { isActive: true, bringToFront: jest.fn() },
      [exception2]: { isActive: false, bringToFront: jest.fn() }
    };

    const {
      deviceID,
      deviceData,
      exceptionData
    } = testMarker;

    const constructors = {
      deviceID,
      deviceData,
      polylines,
      exceptionData,
      nextLatlng: false,
    };

    testExceptionPath = {
      ...exceptionPathModel,
      ...constructors
    };

    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => true);

  });

  test("Construction", () => {
    testExceptionPath = initExceptionPath(testMarker);
    expect(testExceptionPath.deviceID).toBe(testMarker.deviceID);
  });

  test("timeChangedUpdate", () => {

    spyOnFunction(testExceptionPath, "setActiveExceptions");
    spyOnFunction(testExceptionPath, "deleteAllPolylines");

    const testExceptions = { "test": test };
    const testLatLng = [1, 2];

    testExceptionPath.nextLatlng = true;
    testExceptionPath.timeChangedUpdate(testLatLng, testExceptions);

    expect(testExceptionPath.nextLatlng).toEqual([1, 2]);
    expect(testExceptionPath.deleteAllPolylines).toHaveBeenCalled();
    expect(testExceptionPath.setActiveExceptions).toHaveBeenCalledWith(testLatLng, testExceptions);
  });

  test("updateExceptionPath", () => {

    testExceptionPath.nextLatlng = false;
    testExceptionPath.updateExceptionPath(false);

    expect(testExceptionPath.nextLatlng).toEqual(false);
    expect(exceptionPathHelpers.addLatlngToExeptionPath).not.toHaveBeenCalled();
  });

  test("updateExceptionPath", () => {

    const nextLatlng = [6, 36];
    testExceptionPath.nextLatlng = nextLatlng;

    testExceptionPath.updateExceptionPath(testLatLng);

    expect(testExceptionPath.nextLatlng).toEqual(testLatLng);
    expect(exceptionPathHelpers.addLatlngToExeptionPath).toHaveBeenCalledWith(testExceptionPath.polylines.exception1, nextLatlng, true);
  });

  test("newExceptionStarted", () => {

    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => false);

    testExceptionPath.newExceptionStarted(exception1, testLatLng);

    expect(exceptionPathHelpers.addLatlngToExeptionPath).not.toHaveBeenCalled();
    expect(exceptionPathHelpers.createNewExceptionPolyLine).not.toHaveBeenCalled();
  });

  test("newExceptionStarted", () => {

    const testRule = "SpeedDemonJayZuo";
    testExceptionPath.newExceptionStarted(testRule, testLatLng);
    expect(exceptionPathHelpers.createNewExceptionPolyLine).toHaveBeenCalledWith([testLatLng], testMarker.deviceID, testRule, true);
  });

  test("newExceptionStarted", () => {
    testExceptionPath.newExceptionStarted(exception1, testLatLng);
    expect(exceptionPathHelpers.addLatlngToExeptionPath).toHaveBeenCalledWith(testExceptionPath.polylines.exception1, testLatLng, false);
  });

  test("exceptionEnded", () => {
    testExceptionPath.polylines.exception1.isActive = true;
    testExceptionPath.exceptionEnded(exception1);
    expect(testExceptionPath.polylines.exception1.isActive).toBe(false);
  });

  test("exceptionEnded", () => {
    testExceptionPath.exceptionEnded("BreakingJayZ");
    expect(testExceptionPath.polylines.exception1.isActive).toBe(true);
  });

  test("deleteAllPolylines", () => {
    testExceptionPath.deleteAllPolylines();
    expect(Object.keys(testExceptionPath.polylines).length).toBe(0);
  });



  test("setActiveExceptions", () => {
    testExceptionPath.setActiveExceptions(testLatLng, { orderedDateTimes: [] });
    expect(exceptionPathHelpers.createNewExceptionPolyLine).not.toHaveBeenCalledWith();
  });

  test("setActiveExceptions", () => {

    testExceptionPath.polylines.exception1.isActive = false;

    testExceptionPath.setActiveExceptions(testLatLng, testMarker.currentExceptions);

    expect(exceptionPathHelpers.createNewExceptionPolyLine).toHaveBeenCalledWith([testLatLng], testMarker.deviceID, "exception3", true);
    expect(testExceptionPath.polylines.exception1.isActive).toBe(true);
    expect(testExceptionPath.polylines.exception3.isActive).toBe(true);
  });

});

describe("Exception path helper Tests", () => {

  const testRuleID = "testRuleID";
  const fakeExceptionLatLngs = { testRuleID };
  const fakePath = {
    getLatLngs: jest.fn(() => [[1, 2]]),
    setLatLngs: jest.fn(),
    bringToFront: jest.fn()
  };

  beforeAll(() => {
    jest.useFakeTimers();

    spyOnFunction(layersModel, "addToLayer");
    spyOnFunction(layersModel, "addToAllLayer");
    spyOnFunction(utilsHelpers, "getExceptionColor");
    spyOnFunction(exceptionHelpers, "createPolylineExceptionLatLngs", () => fakeExceptionLatLngs);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    spyOnFunction(storage.selectedDevices, "hasOwnProperty", () => true);
    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => true);
  });

  test("createExceptionPaths", () => {
    spyOnFunction(storage.selectedExceptions, "hasOwnProperty", () => false);

    const polyLines = exceptionPathHelpers.createExceptionPaths(exceptionData, deviceData, deviceID, false);

    expect(polyLines).toMatchObject({});
    expect(utilsHelpers.getExceptionColor).not.toHaveBeenCalled();
  });

  test("createExceptionPaths", () => {

    const polyLines = exceptionPathHelpers.createExceptionPaths(exceptionData, deviceData, deviceID, false, 3);

    expect(polyLines).toMatchObject({});
    expect(utilsHelpers.getExceptionColor).toHaveBeenCalledWith(testRuleID);
  });


  test("createNewExceptionPolyLine", () => {

    spyOnFunction(storage.selectedDevices, "hasOwnProperty", () => false);

    const newPolyLine = exceptionPathHelpers.createNewExceptionPolyLine([], deviceID, testRuleID, false);

    expect(newPolyLine).toBeDefined();
    expect(layersModel.addToLayer).toHaveBeenCalled();
    expect(layersModel.addToAllLayer).toHaveBeenCalled();
  });

  test("createExceptionPaths", () => {

    const polyLines = exceptionPathHelpers.createExceptionPaths(exceptionData, deviceData, deviceID, false, 7);

    expect(polyLines).toMatchObject({});
    expect(utilsHelpers.getExceptionColor).toHaveBeenCalledWith(testRuleID);
  });



  test("addLatlngToExeptionPath", () => {

    exceptionPathHelpers.addLatlngToExeptionPath(fakePath, [], false);
    expect(fakePath.getLatLngs).not.toHaveBeenCalled();
    expect(fakePath.setLatLngs).not.toHaveBeenCalled();
  });

  test("addLatlngToExeptionPath", () => {

    exceptionPathHelpers.addLatlngToExeptionPath(fakePath, [2, 3], true);
    expect(fakePath.getLatLngs).toHaveBeenCalled();
    expect(fakePath.setLatLngs).toHaveBeenCalled();
  });

  test("buildNewExceptionPathLatlngs", () => {
    const oldLatLngs = [1, 2];
    const newLatLng = [5, 6];

    const resultLatLngs = exceptionPathHelpers.buildNewExceptionPathLatlngs([...oldLatLngs], newLatLng, true);

    expect(resultLatLngs).toEqual([oldLatLngs, [newLatLng]]);
  });

  test("buildNewExceptionPathLatlngs", () => {
    const oldLatLngs = [[1, 2], [3, 4]];
    const newLatLng = [5, 6];

    const resultLatLngs = exceptionPathHelpers.buildNewExceptionPathLatlngs([...oldLatLngs], newLatLng, false);

    expect(resultLatLngs).toEqual([...oldLatLngs, [newLatLng]]);
  });

});