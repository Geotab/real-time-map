import { spyOnFunction } from "../../../tests/utils/test-helpers";
import { updatePeriodChangeFunctions, updateTimeChangeFunctions, differentDateSet } from "./date-keeper-helpers";
import * as mapData from "../../dataStore/map-data";
import { playBackSpeedModel } from "../../components/controls/speed-control/playback-speed";
import * as dateKeeper from "../../services/data-feed/data-feed-getter";
import storage from "../../dataStore";

describe("DateKeeper helper Tests", () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("updateTimeChangeFunctions", () => {

    const { markerList } = mapData;
    const newTime = 36000;
    markerList.marker1 = {
      timeChangedUpdate: jest.fn()
    };
    markerList.marker2 = false;

    updateTimeChangeFunctions(newTime);

    expect(markerList.marker1.timeChangedUpdate).toHaveBeenCalledWith(newTime);

    delete markerList.marker2;
  });

  test("updatePeriodChangeFunctions", () => {

    const { markerList } = mapData;
    const newPeriod = 36000;
    markerList.marker1 = {
      periodChangedUpdate: jest.fn()
    };
    spyOnFunction(playBackSpeedModel, "updateSpeed");

    updatePeriodChangeFunctions(newPeriod);

    expect(markerList.marker1.periodChangedUpdate).toHaveBeenCalledWith(newPeriod);
    expect(playBackSpeedModel.updateSpeed).toHaveBeenCalledWith(newPeriod);
  });


  test("differentDateSet", () => {

    const newTime = 36000;
    spyOnFunction(mapData, "resetMapData");
    spyOnFunction(dateKeeper, "initHistoricalFeedRunner");
    spyOnFunction(dateKeeper, "initRealTimeFeedRunner");
    storage.historicalComplete = true;

    differentDateSet(newTime);

    expect(storage.historicalComplete).toBe(false);
    expect(mapData.resetMapData).toHaveBeenCalled();
    expect(dateKeeper.initRealTimeFeedRunner).toHaveBeenCalled();
    expect(dateKeeper.initHistoricalFeedRunner).toHaveBeenCalled();
  });

  test("differentDateSet", () => {

    const newTime = 36000;
    spyOnFunction(mapData, "resetMapData");
    spyOnFunction(dateKeeper, "initHistoricalFeedRunner");
    spyOnFunction(dateKeeper, "initRealTimeFeedRunner");
    storage.realTimeFeedDataGetter = {
      cancelRunner: jest.fn()
    };
    storage.HistoricalFeedDataGetter = {
      cancelRunner: jest.fn()
    };

    differentDateSet(newTime);

  });
});