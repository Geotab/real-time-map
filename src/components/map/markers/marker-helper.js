

import L from "leaflet";
import layerModel from "../layers";
import "leaflet-rotatedmarker";
import { arrayBinaryIndexSearch } from "../../../utils/helper";

export function calculateDateTimeIndex(prevRealDateTime, orderedDateTimes) {

  //First Date Time
  if (prevRealDateTime <= orderedDateTimes[0]) {
    return [0, orderedDateTimes[0]];
  }

  //Last Date Time
  const lastRealDateTime = orderedDateTimes[orderedDateTimes.length - 1];
  if (prevRealDateTime >= lastRealDateTime) {
    return [orderedDateTimes.length - 1, lastRealDateTime];
  }

  let dateTimeIndex = orderedDateTimes.indexOf(prevRealDateTime);
  // Not real date time
  if (dateTimeIndex == -1) {
    dateTimeIndex = arrayBinaryIndexSearch(orderedDateTimes, prevRealDateTime) - 1;
  }
  return [dateTimeIndex, orderedDateTimes[dateTimeIndex]];
}

export function createMapMarker(latLng) {
  const newMapMarker = L.marker(latLng, {
    icon: L.divIcon({
      className: "car-icon",
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    }),
    // title: String([deviceID])
    riseOnHover: true,
    rotationOrigin: "center center"
  });

  const element = newMapMarker.getElement();
  if (element) {
    element.style[L.DomUtil.TRANSITION] = "";
  }
  layerModel.addToStopppedLayer(newMapMarker);

  return newMapMarker;
};