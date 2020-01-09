import { liveButtonModel } from "./live-button-model";

import storage from "../../../dataStore/index";
import * as helpers from "../../../utils/helper";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper,
  createDivsWithID,
  createDivsWithClasses
} from "../../../../tests/utils/test-helpers";

import { time2019 } from "../../../../tests/utils/mock-device";

describe("dateTimeModel tests", () => {

  beforeAll(() => {

    jest.useFakeTimers();

    // storage.currentTime = time2019;
    mockDateKeeper(storage, 1000);
    createDivsWithID(["RTM-LiveDot", "RTM-LiveButton"]);
    createDivsWithClasses(["mdc-select__native-control"]);

    spyOnFunction(helpers, "checkIfLive", () => false);
    spyOnFunction(helpers, "getLiveTime", () => time2019);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test constructor", () => {
    spyOnFunction(liveButtonModel, "setLiveBackground");
    liveButtonModel.initLiveButton();
    expect(liveButtonModel.setLiveBackground).toHaveBeenCalled();
  });

  test("Test checkIfLive", () => {
    spyOnFunction(liveButtonModel, "setLiveBackground");
    liveButtonModel.islive = true;
    liveButtonModel.checkIfLive(time2019);
    expect(helpers.checkIfLive).toHaveBeenCalled();
  });

  test("Test checkIfLive", () => {
    spyOnFunction(liveButtonModel, "setLiveBackground");
    liveButtonModel.checkIfLive(time2019);
    expect(helpers.checkIfLive).toHaveBeenCalled();
  });

  test("Test checkIfLive", () => {
    spyOnFunction(helpers, "checkIfLive", () => 1200);
    liveButtonModel.checkIfLive(time2019);
    expect(helpers.checkIfLive).toHaveBeenCalled();
  });

  test("Test checkIfLive", () => {
    spyOnFunction(helpers, "checkIfLive", () => 1200);
    liveButtonModel.islive = true;
    liveButtonModel.checkIfLive(time2019);
    expect(helpers.checkIfLive).toHaveBeenCalled();
  });

  test("Test checkIfLive", () => {
    spyOnFunction(helpers, "checkIfLive", () => 3600);
    liveButtonModel.checkIfLive(time2019);
    expect(helpers.checkIfLive).toHaveBeenCalled();
  });

  test("Test setLiveBackground", () => {
    liveButtonModel.setLiveBackground.mockRestore();
    liveButtonModel.setLiveBackground();
  });


});