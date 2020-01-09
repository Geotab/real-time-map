import layers from "../../components/map/layers";
import { checkSameDay, } from "../../utils/helper";
import { playBackSpeedModel } from "../../components/controls/speed-control/playback-speed";
import storage from "../../dataStore";
import {
  initHistoricalFeedRunner,
  initRealTimeFeedRunner
} from "../../services/data-feed/data-feed-getter";
import {
  resetMapData,
  markerList
} from "../../dataStore/map-data";

export function updateTimeChangeFunctions(newTime) {
  Object.values(markerList).forEach(marker => marker ? marker.timeChangedUpdate(newTime) : undefined);
}

export function updatePeriodChangeFunctions(newPeriod) {
  Object.values(markerList).forEach(marker => marker.periodChangedUpdate(newPeriod));
  playBackSpeedModel.updateSpeed(newPeriod);
}

export function setupTimeObjects(startTime, rangeDiff = 0) {
  storage.startDate = startTime;

  storage.startDate.setMilliseconds(0);
  storage.isLiveDay = checkSameDay(storage.startDate, new Date());

  storage.dayStart = new Date(storage.startDate);
  storage.dayStart.setHours(0, 0, 0, 0);
  storage.dayEnd = new Date(storage.dayStart.getTime() + 86399999);

  storage.currentTime = storage.startDate.getTime();
  storage.timeRangeStart = storage.currentTime - rangeDiff;
}

export function differentDateSet(selectedTime) {

  layers.reset();
  resetMapData();

  const rangeDiff = storage.currentTime - storage.timeRangeStart;
  setupTimeObjects(new Date(selectedTime), rangeDiff);
  storage.historicalComplete = false;

  if (storage.realTimeFeedDataGetter) {
    storage.realTimeFeedDataGetter.cancelRunner();
    delete storage.realTimeFeedDataGetter;
  }
  initRealTimeFeedRunner();

  if (storage.HistoricalFeedDataGetter) {
    storage.HistoricalFeedDataGetter.cancelRunner();
    delete storage.HistoricalFeedDataGetter;
  }
  initHistoricalFeedRunner();
}