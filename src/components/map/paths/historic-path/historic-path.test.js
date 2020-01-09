import {
  initHistoricPath,
  historicPathModel
} from "./historic-path";

import {
  getTestMarker,
  latLng2018,
  latLng2019
} from "../../../../../tests/utils/mock-device";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper
} from "../../../../../tests/utils/test-helpers";

import storage from "../../../../dataStore";
import * as deviceDataHelpers from "../../utils/device-data-helpers";

describe("Historic Path Tests", () => {
  let testHistoricPath;
  const testMarker = getTestMarker();

  beforeAll(() => {
    mockDateKeeper(storage, 1000);
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const polyline = {
      setLatLngs: jest.fn(),
      addLatLng: jest.fn()
    };

    testHistoricPath = { ...historicPathModel, polyline };

    spyOnFunction(deviceDataHelpers, "getLatLngsForTimeRange", () => [latLng2018, latLng2019]);
  });

  test("Construction", () => {
    testHistoricPath = initHistoricPath(testMarker);
    expect(testHistoricPath.deviceID).toBe(testMarker.deviceID);
  });

  test("timeChangedUpdate", () => {

    testHistoricPath.delayedInterval = true;
    testHistoricPath.timeChangedUpdate(1);

    expect(testHistoricPath.polyline.setLatLngs).toBeCalledWith([latLng2018, latLng2019]);
    expect(testHistoricPath.delayedInterval).toBeNull();

  });

  test("updateHistoricPath", () => {

    const testLatlng = [3, 6];
    testHistoricPath.delayedInterval = false;

    testHistoricPath.updateHistoricPath(1, testLatlng);
    jest.runAllTimers();

    expect(testHistoricPath.polyline.addLatLng).toBeCalledWith(testLatlng);
    expect(testHistoricPath.delayedInterval).toBeTruthy();

  });

});