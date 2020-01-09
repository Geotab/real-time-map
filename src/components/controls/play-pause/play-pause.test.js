
import { pausePlayModel } from "./play-pause-model";
import storage from "../../../dataStore/index";
import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper,
  createDivsWithID,
  createDivsWithClasses
} from "../../../../tests/utils/test-helpers";
import { time2019 } from "../../../../tests/utils/mock-device";

describe("pausePlayModel tests", () => {
  let classList;
  const playIconID = "RTM-playIcon";
  const pauseIconID = "RTM-pauseIcon";

  beforeAll(() => {
    jest.useFakeTimers();
    mockDateKeeper(storage, 1000);
    createDivsWithID(["RTMControlButton"]);

    pausePlayModel.initPausePlay();

    classList = pausePlayModel.pausePlayIcon.classList;

    spyOnFunction(classList, "add");
    spyOnFunction(classList, "remove");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test updatePausePlay", () => {

    pausePlayModel.playing = true;
    pausePlayModel.updatePausePlay();

    expect(pausePlayModel.playing).toBe(true);

    expect(classList.add).not.toHaveBeenCalled();
    expect(classList.remove).not.toHaveBeenCalled();
  });

  test("Test updatePausePlay paused datekeeper", () => {

    pausePlayModel.playing = false;
    pausePlayModel.updatePausePlay();

    expect(pausePlayModel.playing).toBe(true);
    expect(classList.add).toHaveBeenCalledWith(pauseIconID);
    expect(classList.remove).toHaveBeenCalledWith(playIconID);
  });

  test("Test updatePausePlay paused datekeeper", () => {
    mockDateKeeper(storage, 1000, true);

    pausePlayModel.playing = true;
    pausePlayModel.updatePausePlay();

    expect(pausePlayModel.playing).toBe(false);

    expect(classList.add).toHaveBeenCalledWith(playIconID);
    expect(classList.remove).toHaveBeenCalledWith(pauseIconID);
  });

  test("Test togglePausePlay", () => {

    const fakeDateKeeper = mockDateKeeper(storage, 1000, true);
    pausePlayModel.playing = true;

    pausePlayModel.togglePausePlay();

    expect(pausePlayModel.playing).toBe(false);
    expect(fakeDateKeeper.pause).toHaveBeenCalled();
    expect(classList.add).toHaveBeenCalledWith(playIconID);
    expect(classList.remove).toHaveBeenCalledWith(pauseIconID);
  });


  test("Test togglePausePlay", () => {

    const fakeDateKeeper = mockDateKeeper(storage, 1000, true);
    pausePlayModel.playing = false;

    pausePlayModel.togglePausePlay();

    expect(pausePlayModel.playing).toBe(true);
    expect(fakeDateKeeper.resume).toHaveBeenCalled();
    expect(classList.add).toHaveBeenCalledWith(pauseIconID);
    expect(classList.remove).toHaveBeenCalledWith(playIconID);
  });


});