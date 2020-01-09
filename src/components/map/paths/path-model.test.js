import {
  initPaths
} from "./path-model";

import {
  testDeviceMarker
} from "../../../../tests/utils/mock-device";
import storage from "../../../dataStore";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper
} from "../../../../tests/utils/test-helpers";

import * as  ExceptionPath from "./exception-path/exception-path";
import * as initHistoricPath from "./historic-path/historic-path";
import * as LivePath from "./live-path/live-path";

describe("dateTimeModel tests", () => {

  beforeAll(() => {

    jest.useFakeTimers();
    storage.historicalComplete = true;
    spyOnFunction(LivePath, "initLivePath");
    spyOnFunction(initHistoricPath, "initHistoricPath");
    spyOnFunction(ExceptionPath, "initExceptionPath");
  });

  test("Test initPaths", () => {
    storage.historicalComplete = false;
    initPaths(testDeviceMarker);
    storage.historicalComplete = true;
  });

  test("Test initPaths", () => {

    initPaths(testDeviceMarker);
  });

  test("Test initPaths", () => {

    delete testDeviceMarker.exceptionPath;
    delete testDeviceMarker.historicPath;
    delete testDeviceMarker.livePath;
    initPaths(testDeviceMarker);
  });

});