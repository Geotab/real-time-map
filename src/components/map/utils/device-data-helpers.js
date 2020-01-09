import { arrayBinaryIndexSearch } from "../../../utils/helper";

export function getFirstLatLng(deviceData) {
  const firstDateTime = deviceData.orderedDateTimes[0];
  return deviceData[firstDateTime].latLng;
}

export function getLastLatLng(deviceData) {
  const { orderedDateTimes } = deviceData;
  const lastDateTime = orderedDateTimes[orderedDateTimes.length - 1];
  return deviceData[lastDateTime].latLng;
}

export function getRealLatLng(dateTime, deviceData) {
  if (deviceData.hasOwnProperty(dateTime) && deviceData[dateTime].hasOwnProperty('latLng')) {
    return deviceData[dateTime].latLng;
  }
  return false;
}

export function getAllLatLngs(deviceData) {
  return deviceData.orderedDateTimes.map(dateTime =>
    deviceData[dateTime].latLng
  );
}

export function getLatLngUpToIndex(index, deviceData) {
  return deviceData.orderedDateTimes.slice(0, index + 1).map(dateTime =>
    deviceData[dateTime].latLng
  );
}

export function getLatLngsForTimeRange(start, end, deviceData) {

  if (start > end) {
    return [];
  }

  const { orderedDateTimes } = deviceData;
  const firstDateTime = orderedDateTimes[0];
  const lastDateTime = orderedDateTimes[orderedDateTimes.length - 1];

  if (start == lastDateTime) {
    return [deviceData[lastDateTime].latLng];
  }

  if (end == firstDateTime) {
    return [deviceData[firstDateTime].latLng];
  }

  if (end < firstDateTime || lastDateTime < start) {
    return [];
  }

  if (start <= firstDateTime && lastDateTime <= end) {
    return getAllLatLngs(deviceData);
  }

  let startLatLng = getRealLatLng(start, deviceData);
  let lastDateTimeIndex = arrayBinaryIndexSearch(orderedDateTimes, start);

  if (startLatLng) {
    lastDateTimeIndex++;
  } else {
    startLatLng = getInterpolatedLatLng(start, deviceData, lastDateTimeIndex);
  }
  const latLngList = [startLatLng];

  if (start === end) {
    return latLngList;
  }

  let currentDateTime = orderedDateTimes[lastDateTimeIndex];

  while (currentDateTime < end) {
    lastDateTimeIndex++;
    const latLng = getRealLatLng(currentDateTime, deviceData);
    if (latLng) {
      latLngList.push(latLng);
    }
    currentDateTime = orderedDateTimes[lastDateTimeIndex];
  }
  // console.log(lastDateTimeIndex, currentDateTime, latLngList);

  let endLatLng = getRealLatLng(end, deviceData);
  if (!endLatLng) {
    endLatLng = getInterpolatedLatLng(end, deviceData);
  }
  latLngList.push(endLatLng);

  return latLngList;
}

export function interpolateCurrentLatLng(currDateTime, prevDateTime, nextDateTime, prevLatLng, nextLatLng) {

  if (prevLatLng[0] === nextLatLng[0] && prevLatLng[1] === nextLatLng[1]) {
    // console.warn('139', dateTimeIndex);
    return prevLatLng;
  }

  const timeDiff = nextDateTime - prevDateTime;
  const currentDiff = currDateTime - prevDateTime;
  const elapsedTimePercent = currentDiff / timeDiff;

  const latDiff = nextLatLng[0] - prevLatLng[0];
  const lngDiff = nextLatLng[1] - prevLatLng[1];
  // console.log(latDiff, lngDiff, timeDiff, currDateTime, prevDateTime);

  const newLat = prevLatLng[0] + latDiff * elapsedTimePercent;
  const newLng = prevLatLng[1] + lngDiff * elapsedTimePercent;

  return [newLat, newLng];
}

export function getInterpolatedLatLng(dateTime, deviceData, dateTimeIndex = null) {
  const { orderedDateTimes } = deviceData;
  //Only 1 date or if date time is earlier than any data.
  if (orderedDateTimes.length == 1 || dateTime < orderedDateTimes[0]) {
    return getFirstLatLng(deviceData);
  }

  //If current time later than any available data;
  if (orderedDateTimes[orderedDateTimes.length - 1] < dateTime) {
    return getLastLatLng(deviceData);
  }

  //Return real date if available.
  const realLatLng = getRealLatLng(dateTime, deviceData);
  if (realLatLng) {
    return realLatLng;
  }

  let closestRealDateTimeIndex = dateTimeIndex;
  //Only search if date time is NOT within current range.
  if (dateTimeIndex === null || dateTime < orderedDateTimes[dateTimeIndex] || orderedDateTimes[dateTimeIndex + 1] < dateTime) {
    closestRealDateTimeIndex = arrayBinaryIndexSearch(orderedDateTimes, dateTime);
    if (closestRealDateTimeIndex === 0) {
      return getFirstLatLng(deviceData);
    }
    if (closestRealDateTimeIndex === orderedDateTimes.length) {
      return getLastLatLng(deviceData);
    }
    closestRealDateTimeIndex--;
  }

  const previousRealDateTime = orderedDateTimes[closestRealDateTimeIndex];
  const nextRealDateTime = orderedDateTimes[closestRealDateTimeIndex + 1];

  const previousLatLng = getRealLatLng(previousRealDateTime, deviceData);
  const nextLatLng = getRealLatLng(nextRealDateTime, deviceData);

  if (previousLatLng[0] === nextLatLng[0] && previousLatLng[1] === nextLatLng[1]) {
    return previousLatLng;
  }

  return interpolateCurrentLatLng(dateTime,
    previousRealDateTime,
    nextRealDateTime,
    previousLatLng,
    nextLatLng
  );
}