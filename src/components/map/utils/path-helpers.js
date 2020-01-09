import storage from "../../../dataStore";

export function calculateAnimationFrames(latDelta, lngDelta) {
  // Zoom multiplier for animated frames.
  const approxZoom = (storage.map.getZoom() - 14) / 2;

  //Increase animated frames by 1 roughly every 10m/s.
  const approxDelta = Math.round((Math.abs(latDelta) + Math.abs(lngDelta)) * 10000);

  // Increase animated frames based on play back speed.
  const approxFrames = Math.ceil(approxDelta * approxZoom) / (1000 / storage.dateKeeper$.getPeriod());
  return Math.min(approxFrames, 6) + 1;
}

export function calculateLatLngDeltaPerFrame(latDelta, lngDelta, animateFrames) {

  const latPerFrame = latDelta / animateFrames;
  const lngPerFrame = lngDelta / animateFrames;

  return [latPerFrame, lngPerFrame];
}

export function validateLatLngs(latLngArray) {
  return latLngArray.every(Boolean);
}

export function checkSameLatlng(lastLatLng, nextLatLng) {
  return lastLatLng[0] === nextLatLng[0] && lastLatLng[1] === nextLatLng[1];
}

export function findActiveExceptionRuleID(currentExceptions) {
  const { orderedDateTimes } = currentExceptions;
  if (orderedDateTimes.length <= 0) {
    return undefined;
  }
  const oldestExceptions = currentExceptions[orderedDateTimes[0]];
  const ruleID = Object.keys(oldestExceptions)[0];
  return ruleID;
}

export function calculateLatLngDelta(lastLatLng, nextLatLng) {

  const [lastLat, lastLng] = lastLatLng;
  const [nextLat, nextLng] = nextLatLng;
  const latDelta = nextLat - lastLat;
  const lngDelta = nextLng - lastLng;
  return [latDelta, lngDelta];
}