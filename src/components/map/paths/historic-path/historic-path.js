import L from "leaflet";
import storage from "../../../../dataStore";
import layersModel from "../../layers";
import {
  getLatLngsForTimeRange
} from "../../utils/device-data-helpers";
import {
  bindDeviceNamePopup
} from "../../popups/path-popups";

//create new path, every path must belong to a marker.
export function initHistoricPath(deviceMarker) {
  const {
    deviceID,
    deviceData,
  } = deviceMarker;

  const latLngList = getLatLngsForTimeRange(storage.timeRangeStart, storage.currentTime, deviceData);
  const polyline = L.polyline(latLngList, {
    smoothFactor: 1,
    weight: 3,
    color: "#00AEEF"
    // className: deviceID + dateTimeStamp
  });

  const historicPathConstructors = {
    deviceID,
    deviceData,
    polyline
  };

  const newHistoricPath = {
    ...historicPathModel,
    ...historicPathConstructors
  };

  layersModel.addToAllLayer(polyline);
  bindDeviceNamePopup(deviceID, polyline);
  return newHistoricPath;
}

export const historicPathModel = {
  deviceID: undefined,
  deviceData: undefined,
  polyline: undefined,
  delayedInterval: undefined,

  timeChangedUpdate(currentSecond) {
    clearTimeout(this.delayedInterval);
    this.delayedInterval = null;
    const latLngs = getLatLngsForTimeRange(storage.timeRangeStart, currentSecond, this.deviceData);
    this.polyline.setLatLngs(latLngs);
  },

  updateHistoricPath(currentSecond, realLatLng) {
    this.delayedInterval = setTimeout(() => {
      this.polyline.addLatLng(realLatLng);
    }, storage.dateKeeper$.getPeriod() * 0.75);
  },
};