import { initLivePath } from "./live-path";
import { getTestMarker } from "../../../../../tests/utils/mock-device";

import {
  spyOnFunction,
  mockMap,
  mockDateKeeper
} from "../../../../../tests/utils/test-helpers";

import storage from "../../../../dataStore";
import * as pathHelpers from "../../utils/path-helpers";

describe("Live Path Tests", () => {

  let testLivePath;
  const testMarker = getTestMarker();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    testLivePath = initLivePath(testMarker);
  });

  test("Construction", () => {

    const { lastLatLng } = testLivePath;
    const markerLatlng = testMarker.mapMarker.getLatLng();

    expect(lastLatLng.lat).toEqual(markerLatlng.lat);
    expect(lastLatLng.lng).toEqual(markerLatlng.lng);
  });

  test("updateRealLatLng", () => {
    spyOnFunction(testLivePath, "addNewLatLngToPath");

    const testLatLng = [-1, -2];
    testLivePath.updateRealLatLng(testLatLng);

    expect(testLivePath.lastLatLng).toBe(testLatLng);
    expect(testLivePath.addNewLatLngToPath).toHaveBeenCalled();
  });

  test("updateInterpolatedLatLng", () => {
    spyOnFunction(testLivePath, "addNewLatLngToPath");

    const testLatLng = [-1, -2];
    testLivePath.updateInterpolatedLatLng(testLatLng);

    expect(testLivePath.lastLatLng).toBe(testLatLng);
    expect(testLivePath.addNewLatLngToPath).toHaveBeenCalled();
  });

  test("addNewLatLngToPath invalid", () => {

    const functionsToCheck = [
      [testLivePath.polyline, "setLatLngs"],
      [testLivePath.polyline, "addLatLng"],
      [testLivePath, "animatePath"],
    ];

    functionsToCheck.forEach(funcObj => spyOnFunction(funcObj[0], funcObj[1]));

    const lastLatLng = [-1, -2];
    const nextLatLng = [-1, -2];
    const isRealLatLng = true;

    testLivePath.addNewLatLngToPath(lastLatLng, nextLatLng, isRealLatLng);

    functionsToCheck.forEach(funcObj =>
      expect(funcObj[0][funcObj[1]]).not.toHaveBeenCalled()
    );

  });

  test("addNewLatLngToPath setLatLngs", () => {

    mockMap(storage, 12, true);
    spyOnFunction(testLivePath.polyline, "setLatLngs");

    const lastLatLng = [-1, -2];
    const nextLatLng = [-2, -3];
    const isRealLatLng = true;

    testLivePath.addNewLatLngToPath(lastLatLng, nextLatLng, isRealLatLng);

    expect(testLivePath.polyline.setLatLngs).toHaveBeenCalledWith([nextLatLng]);
  });

  test("addNewLatLngToPath addLatLng", () => {

    mockMap(storage, 15, false);
    spyOnFunction(testLivePath.polyline, "addLatLng");

    const lastLatLng = [-1, -2];
    const nextLatLng = [-2, -3];

    testLivePath.addNewLatLngToPath(lastLatLng, nextLatLng);

    expect(testLivePath.polyline.addLatLng).toHaveBeenCalledWith(nextLatLng);
  });

  test("addNewLatLngToPath shouldAnimate", () => {

    mockMap(storage, 15, true);
    spyOnFunction(testLivePath, "animatePath");

    const lastLatLng = [-1, -2];
    const nextLatLng = [-2, -3];
    const isRealLatLng = false;

    testLivePath.addNewLatLngToPath(lastLatLng, nextLatLng, isRealLatLng);

    expect(testLivePath.animatePath).toHaveBeenCalledWith(lastLatLng, nextLatLng, isRealLatLng);
  });

  test("animatePath", () => {

    mockDateKeeper(storage, 1000);
    // spyOnFunction(pathHelpers, "calculateAnimationFrames", () => 6);

    const lastLatLng = [-1, -2];
    const nextLatLng = [-2, -3];
    const isRealLatLng = false;

    testLivePath.animatePath(lastLatLng, nextLatLng, isRealLatLng);
    jest.runAllTimers();

  });

  test("animatePath", () => {

    mockDateKeeper(storage, 1000);
    spyOnFunction(testLivePath.polyline, "addLatLng");
    spyOnFunction(testLivePath.polyline, "setLatLngs");
    // spyOnFunction(pathHelpers, "calculateAnimationFrames", () => 6);

    const lastLatLng = [-1, -2];
    const nextLatLng = [-2, -3];
    const isRealLatLng = true;

    testLivePath.animatePath(lastLatLng, nextLatLng, isRealLatLng);
    jest.runAllTimers();

    expect(testLivePath.polyline.addLatLng).toHaveBeenCalledWith(nextLatLng);
    expect(testLivePath.polyline.setLatLngs).toHaveBeenCalledWith([nextLatLng]);
  });

  test("setActiveException", () => {
    spyOnFunction(testLivePath, "setPolyLineColor");

    const testRuleID = "testID";
    testLivePath.setActiveException(testRuleID, {});
    expect(testLivePath.setPolyLineColor).toHaveBeenCalledWith(testRuleID);
  });

  test("setActiveException", () => {
    const testRuleID = "testRuleID";

    spyOnFunction(testLivePath, "setPolyLineColor");
    spyOnFunction(pathHelpers, "findActiveExceptionRuleID", () => testRuleID);

    testLivePath.setActiveException(false, {});
    expect(testLivePath.setPolyLineColor).toHaveBeenCalledWith(testRuleID);
  });

  test("timeChangedUpdate", () => {

    spyOnFunction(testLivePath, "setActiveException");
    spyOnFunction(testLivePath, "clearanimationIntervals");
    spyOnFunction(testLivePath.polyline, "setLatLngs");

    const newLatlng = [-1, -2];
    testLivePath.timeChangedUpdate(newLatlng, {});

    expect(testLivePath.lastLatLng).toBe(newLatlng);
    expect(testLivePath.setActiveException).toHaveBeenCalled();
    expect(testLivePath.clearanimationIntervals).toHaveBeenCalled();
    expect(testLivePath.polyline.setLatLngs).toHaveBeenCalledWith([newLatlng]);

  });

  test("clearanimationIntervals", () => {

    testLivePath.clearanimationIntervals();
    const { length } = Object.entries(testLivePath.animationIntervalIDs);
    expect(length).toBe(0);
  });

});