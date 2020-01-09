import L from "leaflet";
import storage from "../../../../dataStore";
import layersModel from "../../layers";
import { getExceptionColor } from "../../../../utils/helper";
import { bindDeviceNamePopup } from "../../popups/path-popups";
import { geotabBlue } from "../../../../constants/color-hex-codes";

import {
  calculateAnimationFrames,
  calculateLatLngDeltaPerFrame,
  validateLatLngs,
  checkSameLatlng,
  findActiveExceptionRuleID,
  calculateLatLngDelta
} from "../../utils/path-helpers";

export function initLivePath(deviceMarker) {

  const {
    deviceID,
    currentExceptions,
    mapMarker
  } = deviceMarker;

  const lastLatLng = mapMarker.getLatLng();

  const polyline = L.polyline([lastLatLng], {
    smoothFactor: 6,
    weight: 3,
    color: geotabBlue,
    // className: deviceID + dateTimeStamp
  });

  const newLivePath = {
    ...livePathModel,
    lastLatLng,
    polyline
  };

  const ruleID = findActiveExceptionRuleID(currentExceptions);
  newLivePath.init(deviceID, ruleID);

  return newLivePath;
}

export const livePathModel = {
  polyline: undefined,
  lastLatLng: undefined,
  animationIntervalIDs: {},

  init(deviceID, ruleID) {
    bindDeviceNamePopup(deviceID, this.polyline);
    layersModel.addToAllLayer(this.polyline);
    this.setPolyLineColor(ruleID);
  },

  updateRealLatLng(realLatLng) {
    this.addNewLatLngToPath(this.lastLatLng, realLatLng, true);
    this.lastLatLng = realLatLng;
  },

  updateInterpolatedLatLng(interpolatedLatLng) {
    this.addNewLatLngToPath(this.lastLatLng, interpolatedLatLng, false);
    this.lastLatLng = interpolatedLatLng;
  },

  addNewLatLngToPath(lastLatLng, nextLatLng, isRealLatLng = false) {
    const validLatlngs = validateLatLngs([lastLatLng, nextLatLng]) && !checkSameLatlng(lastLatLng, nextLatLng);

    if (validLatlngs) {

      const zoom = storage.map.getZoom();
      const latLngOnMap = storage.map.getBounds().contains(nextLatLng);
      const shouldAnimate = zoom >= 15 && latLngOnMap;

      if (shouldAnimate) {

        this.animatePath(lastLatLng, nextLatLng, isRealLatLng);

      } else {

        // No animation required, just add or set new latlng.
        if (isRealLatLng) {
          this.polyline.setLatLngs([nextLatLng]);
        } else {
          this.polyline.addLatLng(nextLatLng);
        }
      }
    }
  },

  animatePath(lastLatLng, nextLatLng, isRealLatLng) {

    const [lastLat, lastLng] = lastLatLng;
    const [latDelta, lngDelta] = calculateLatLngDelta(lastLatLng, nextLatLng);

    // Animated frame number is based on current zoom level, car speed, and playback speed.
    const animateFrames = calculateAnimationFrames(latDelta, lngDelta);
    const frequency = storage.dateKeeper$.getPeriod() / animateFrames;
    const [latDeltaPerFrame, lngDeltaPerFrame] = calculateLatLngDeltaPerFrame(latDelta, lngDelta, animateFrames);

    let framesLeft = animateFrames;

    const intervalID = setInterval(() => {
      framesLeft--;

      //Animate the next frame every interval.
      const animatedLat = lastLat + latDeltaPerFrame * (animateFrames - framesLeft);
      const animatedLng = lastLng + lngDeltaPerFrame * (animateFrames - framesLeft);

      this.polyline.addLatLng([animatedLat, animatedLng]);

      if (framesLeft <= 0) {
        // Remove old latlngs if real data point reached.
        if (isRealLatLng) {
          this.polyline.setLatLngs([nextLatLng]);
        }
        this.animationIntervalIDs[intervalID]();
      }

    }, frequency);

    this.animationIntervalIDs[intervalID] = () => {
      clearInterval(intervalID);
      delete this.animationIntervalIDs[intervalID];
    };

  },

  setActiveException(activeException, currentExceptions) {
    const ruleID = activeException ? activeException : findActiveExceptionRuleID(currentExceptions);
    this.setPolyLineColor(ruleID);
  },

  setPolyLineColor(ruleID) {
    this.polyline.setStyle({
      weight: 3,
      color: getExceptionColor(ruleID)
    });
  },

  timeChangedUpdate(newLatlng, currentExceptions) {
    this.clearanimationIntervals();
    this.lastLatLng = newLatlng;
    this.polyline.setLatLngs([newLatlng]);
    this.setActiveException(false, currentExceptions);
  },

  clearanimationIntervals() {
    Object.keys(this.animationIntervalIDs).forEach(clearInterval);
    this.animationIntervalIDs = {};
  },

};