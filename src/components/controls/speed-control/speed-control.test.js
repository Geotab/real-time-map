import { playBackSpeedModel } from "./playback-speed";

import storage from "../../../dataStore/index";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper,
  createDivsWithID,
  createDivsWithClasses
} from "../../../../tests/utils/test-helpers";

import * as helpers from "../../../utils/helper";

describe("pausePlayModel tests", () => {

  beforeAll(() => {

    jest.useFakeTimers();
    mockDateKeeper(storage, 1000);

    playBackSpeedModel.select = {
      value: 1
    };

  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test newSpeedSelected", () => {

    spyOnFunction(helpers, "checkIfLive");
    playBackSpeedModel.newSpeedSelected();
    expect(helpers.checkIfLive).toHaveBeenCalled();
  });

  test("Test newSpeedSelected", () => {

    playBackSpeedModel.updateSpeed(2000);
  });

});