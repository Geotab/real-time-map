import { arrayBinaryIndexSearch, insertIntoOrderedArray, createObjectKeyIfNotExist } from "../../../utils/helper";
import storage from "../../../dataStore";
import { getLatLngsForTimeRange, getInterpolatedLatLng } from "./device-data-helpers";

export function getActiveExceptionsForTime(dateTime, exceptionData) {

  const firstDateTime = exceptionData.orderedDateTimes[0];
  if (dateTime < firstDateTime) {
    return false;
  }

  const result = {
    orderedDateTimes: [],
  };

  let orderedIndex = 0;
  let exceptionStartTime = exceptionData.orderedDateTimes[0];

  while (exceptionStartTime <= dateTime) {
    const exceptionStart = exceptionData[exceptionStartTime];

    Object.keys(exceptionStart).forEach(endTime => {

      if (dateTime < endTime) {

        const initExceptionStart = createObjectKeyIfNotExist(result, endTime);

        Object.keys(exceptionStart[endTime]).forEach(ruleID => {
          // console.log(JSON.stringify(exceptionStart[endTime]));
          if (storage.selectedExceptions.hasOwnProperty(ruleID)) {
            result[endTime][ruleID] = exceptionStart[endTime][ruleID];
          }
        });

        if (Object.keys(result[endTime]).length > 0) {
          if (initExceptionStart) {
            insertIntoOrderedArray(result.orderedDateTimes, endTime);
          };
        } else {
          delete result[endTime];
        }
      }
    });


    orderedIndex++;
    exceptionStartTime = exceptionData.orderedDateTimes[orderedIndex];
  }

  if (result.orderedDateTimes.length === 0) {
    return false;
  }
  return result;
};

export function getExceptionsForTimeRange(start, end, exceptionData) {

  const result = {};
  exceptionData.orderedDateTimes.forEach(startTime => {

    if (startTime < end) {
      const exceptionStart = exceptionData[startTime];
      Object.keys(exceptionStart).forEach(endTime => {

        const exceptions = exceptionStart[endTime];
        if (start < endTime) {

          Object.keys(exceptions).forEach(ruleID => {
            if (storage.selectedExceptions.hasOwnProperty(ruleID)) {
              createObjectKeyIfNotExist(result, ruleID);
              result[ruleID][startTime] = { ...exceptions[ruleID] };
              result[ruleID][startTime].end = endTime;
            }
          });
        }
      });
    }
  });

  return result;
};

export function getAllExceptions(exceptionData) {
  return getExceptionsForTimeRange(0, Number.MAX_SAFE_INTEGER, exceptionData);
}

export function getExceptionLatLngs(exception, deviceData) {
  return Object.keys(exception).map(start => {

    const { end } = exception[start];
    const startTime = start > storage.timeRangeStart ? start : storage.timeRangeStart;
    const endTime = end < storage.currentTime ? end : storage.currentTime;
    const latLngs = getLatLngsForTimeRange(startTime, endTime, deviceData);
    if (latLngs.length <= 0) {
      latLngs.push(getInterpolatedLatLng(start, deviceData));
    }
    return latLngs;
  });
}

export function createPolylineExceptionLatLngs(exceptionData, deviceData) {

  const result = {};
  const historicalExceptions = getExceptionsForTimeRange(storage.timeRangeStart, storage.currentTime, exceptionData);

  const ruleIDList = Object.keys(historicalExceptions);
  if (ruleIDList.length <= 0) {
    return false;
  }

  ruleIDList.forEach(ruleID => {
    if (storage.selectedExceptions.hasOwnProperty(ruleID)) {
      const exception = historicalExceptions[ruleID];
      result[ruleID] = getExceptionLatLngs(exception, deviceData);
    }
  });

  return result;
}