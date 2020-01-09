import L from "leaflet";
import storage from "../../../dataStore";
import layerModel from "../layers";
import { initPaths } from "../paths";
import { initMarkerPopup } from "../popups/marker-popup";
import { getActiveExceptionsForTime } from "../utils/exception-helpers";

import {
  logRecordsData,
  markerList,
  exceptionEventsData
} from "../../../dataStore/map-data";

import {
  insertIntoOrderedArray,
  createObjectKeyIfNotExist,
  calculateHeadingAngle,
  calculateAnimatedAngleDelta
} from "../../../utils/helper";

import {
  getRealLatLng,
  getInterpolatedLatLng
} from "../utils/device-data-helpers";

import { calculateDateTimeIndex, createMapMarker } from "./marker-helper";

export function createDeviceMarker(deviceID) {

  const deviceData = logRecordsData[deviceID];
  const { orderedDateTimes } = deviceData;
  const [dateTimeIndex, prevRealDateTime] = calculateDateTimeIndex(storage.currentTime, orderedDateTimes);

  const currentLatLng = getInterpolatedLatLng(storage.currentTime, deviceData, dateTimeIndex);
  const nextLatLng = getInterpolatedLatLng(storage.currentTime + 1000, deviceData, dateTimeIndex);
  const currentLayers = ["movingLayer"];
  const mapMarker = createMapMarker(currentLatLng);

  const constructors = {
    deviceID,
    deviceData,
    orderedDateTimes,
    dateTimeIndex,
    prevRealDateTime,
    currentLayers,
    currentLatLng,
    mapMarker
  };

  const newDeviceMaker = {
    ...deviceMarkerModel,
    ...constructors
  };

  initDeviceMarkerProperties(newDeviceMaker);
  newDeviceMaker.setHeading(currentLatLng, nextLatLng);

  markerList[deviceID] = newDeviceMaker;
  return newDeviceMaker;
};

export function initDeviceMarkerProperties(newDeviceMaker) {

  initDeviceExceptions(newDeviceMaker);
  initPaths(newDeviceMaker);
  initMarkerPopup(newDeviceMaker);
  initFilterLayer(newDeviceMaker);

  newDeviceMaker.setToMoving();
  newDeviceMaker.setTransitionAnimation();
  newDeviceMaker.subscribeToDateUpdater();
}

export function initDeviceExceptions(newDeviceMaker) {

  const { deviceID } = newDeviceMaker;
  if (storage.exceptionsEnabled) {

    if (!exceptionEventsData.hasOwnProperty(deviceID)) {
      exceptionEventsData[deviceID] = {
        orderedDateTimes: []
      };
    }

    const exceptionData = exceptionEventsData[deviceID];
    newDeviceMaker.exceptionData = exceptionData;
    newDeviceMaker.initExceptions();
  }
}

export const filterLayerName = "Filter";
export function initFilterLayer(newDeviceMaker) {

  const { deviceID } = newDeviceMaker;
  if (storage.selectedDevices.hasOwnProperty(deviceID)) {
    newDeviceMaker.setLayer(filterLayerName);
    newDeviceMaker.currentLayers.push(filterLayerName);
  }
}

//Set fields to undefined so default paramters work
export const deviceMarkerModel = {
  deviceID: undefined,
  deviceData: undefined,
  orderedDateTimes: undefined,
  dateTimeIndex: 0,
  prevRealDateTime: undefined,
  currentlatLng: undefined,
  speed: undefined,
  mapMarker: undefined,
  historicPath: undefined,
  isMoving: false,
  exceptionData: undefined,
  currentExceptions: undefined,
  currentLayers: undefined,
  timeChanged: false,

  periodChangedUpdate(currentPeriod) {
    this.popupModel.resetAnimation();
    this.popupModel.setTransitionAnimation();
    this.resetAnimation();
    this.setTransitionAnimation();
  },

  timeChangedUpdate(currentSecond) {
    this.timeChanged = true;
    this.initExceptions();

    if (this.historicPath) {
      this.historicPath.timeChangedUpdate(currentSecond);
    };

    this.currentlatLng = getInterpolatedLatLng(currentSecond, this.deviceData, this.dateTimeIndex);
    const nextLatLng = getInterpolatedLatLng(currentSecond + 1000, this.deviceData, this.dateTimeIndex);
    this.setHeading(this.currentlatLng, nextLatLng);

    if (this.exceptionPath) {
      this.exceptionPath.timeChangedUpdate(this.nextLatLng, this.currentExceptions);
    };

    if (this.livePath) {
      this.livePath.timeChangedUpdate(this.currentlatLng, this.currentExceptions);
    }
  },

  updateDeviceMarker(currentSecond) {

    if (storage.selectedDevices.hasOwnProperty(this.deviceID) && !this.checkInLayer(filterLayerName)) {
      this.setLayer(filterLayerName);
    }

    const [realLatLng, interpolatedLatLng] = this.updateLatLng(currentSecond);

    const currentLatLng = realLatLng ? realLatLng : interpolatedLatLng;

    if (storage.exceptionsEnabled) {
      this.updateExceptions(currentSecond, currentLatLng);
    }

    this.updatePaths(currentSecond, realLatLng, interpolatedLatLng);
    this.popupModel.updatePopup();

    this.timeChanged = false;
  },

  updateLatLng(currentSecond) {

    let interpolatedLatLng;
    const realLatLng = getRealLatLng(currentSecond, this.deviceData);

    if (realLatLng) {

      this.speed = this.deviceData[currentSecond].speed;
      this.setCurrentDateTime(currentSecond);
      this.moveToLatLng(realLatLng);

      const nextLatLng = getInterpolatedLatLng(currentSecond + 1000, this.deviceData, this.dateTimeIndex);
      this.setHeading(realLatLng, nextLatLng);

    } else {
      interpolatedLatLng = getInterpolatedLatLng(currentSecond, this.deviceData, this.dateTimeIndex);
      this.moveToLatLng(interpolatedLatLng);
    }

    return [realLatLng, interpolatedLatLng];
  },

  updateExceptions(currentSecond, currentLatLng) {
    this.addNewException(currentSecond, currentLatLng);
    const exceptionExpired = this.deleteExpiredExceptions(currentSecond, currentLatLng);

    if (exceptionExpired && this.livePath) {
      this.livePath.setActiveException(false, this.currentExceptions);
    }
  },

  addNewException(currentSecond, currentLatLng) {
    //Add new exceptions
    const newException = this.exceptionData[currentSecond];
    if (this.currentExceptions && newException) {
      // console.log('newException', newException);
      Object.keys(newException).forEach(endTime => {
        const initExceptionStart = createObjectKeyIfNotExist(this.currentExceptions, endTime);
        if (initExceptionStart) {
          insertIntoOrderedArray(this.currentExceptions.orderedDateTimes, endTime);
        };
        Object.keys(newException[endTime]).forEach(ruleID => {
          if (storage.selectedExceptions.hasOwnProperty(ruleID)) {
            this.currentExceptions[endTime][ruleID] = newException[endTime][ruleID];
            if (this.exceptionPath) {
              this.exceptionPath.newExceptionStarted(ruleID, currentLatLng);
            };
            if (this.livePath) {
              this.livePath.setActiveException(ruleID, this.currentExceptions);
            }
          }
        });
      });
    }
  },

  deleteExpiredExceptions(currentSecond) {
    //Delete expired exceptions
    let exceptionExpired = false;
    while (this.currentExceptions && currentSecond >= this.currentExceptions.orderedDateTimes[0]) {

      const exceptionEndTime = this.currentExceptions.orderedDateTimes.shift();
      const exceptions = this.currentExceptions[exceptionEndTime];

      Object.keys(exceptions).forEach(ruleID => {
        if (storage.selectedExceptions.hasOwnProperty(ruleID) && this.exceptionPath) {
          this.exceptionPath.exceptionEnded(ruleID);
        }
      });

      exceptionExpired = true;
      // console.log('excpetion ended', JSON.stringify(exceptions), currentSecond);
      delete this.currentExceptions[exceptionEndTime];
    }

    return exceptionExpired;
  },

  updatePaths(currentSecond, realLatLng, interpolatedLatLng) {

    if (this.historicPath && realLatLng) {
      this.historicPath.updateHistoricPath(currentSecond, realLatLng);
    };

    if (this.livePath) {
      if (realLatLng) {
        this.livePath.updateRealLatLng(realLatLng);
      } else {
        this.livePath.updateInterpolatedLatLng(interpolatedLatLng);
      }
    };

    if (this.exceptionPath) {
      this.exceptionPath.updateExceptionPath(realLatLng);
    };
  },

  setCurrentDateTime(newDateTime, newIndex = this.dateTimeIndex + 1) {
    this.prevRealDateTime = newDateTime;

    if (newIndex < this.orderedDateTimes.length) {
      this.dateTimeIndex = newIndex;
    }

    if (newIndex === 1 && this.orderedDateTimes[0] === newDateTime) {
      this.dateTimeIndex = 0;
    }

    this.veryifyDateTimeIndex();
  },

  moveToLatLng(newLatlng) {
    if (!newLatlng) {
      return false;
    }

    const oldLatlng = this.mapMarker.getLatLng();
    if (!oldLatlng.equals(newLatlng)) {

      this.setTransitionAnimation();
      this.popupModel.setTransitionAnimation();

      this.mapMarker.setLatLng(newLatlng);
      this.currentlatLng = newLatlng;

      return true;
    }
    return false;
  },

  setTransitionAnimation() {
    const element = this.mapMarker.getElement();
    const period = storage.dateKeeper$.getPeriod();
    if (element && !element.style[L.DomUtil.TRANSITION] && period > 150) {
      element.style[L.DomUtil.TRANSITION] = `transform ${period / 1000}s linear`;
    }
  },

  resetAnimation() {
    const element = this.mapMarker.getElement();
    if (element) {
      element.style[L.DomUtil.TRANSITION] = "";
    }
  },

  setToMoving() {
    if (!this.isMoving) {
      this.isMoving = true;
      this.setLayer("movingLayer");
    }
  },

  setLayer(layerName) {

    layerModel.addToLayer(layerName, this.mapMarker);
    if (this.livePath) {
      layerModel.addToLayer(layerName, this.livePath.polyline);
    }
    if (this.historicPath) {
      layerModel.addToLayer(layerName, this.historicPath.polyline);
    }
    if (this.exceptionPath) {
      Object.values(this.exceptionPath.polylines).forEach(path => {
        layerModel.addToLayer(layerName, path);
      });
    }
  },

  checkInLayer(layerName) {

    const mapMarkerInLayer = layerModel.isInLayer(layerName, this.mapMarker);
    const livePathInLayer = !this.livePath || layerModel.isInLayer(layerName, this.livePath.polyline);
    const historicPathInLayer = !this.historicPath || layerModel.isInLayer(layerName, this.historicPath.polyline);
    const exceptionPathInLayer = !this.exceptionPath || Object.values(this.exceptionPath.polylines).every(path => layerModel.isInLayer(layerName, path));

    return mapMarkerInLayer && livePathInLayer && historicPathInLayer && exceptionPathInLayer;
  },

  veryifyDateTimeIndex() {
    if (this.orderedDateTimes[this.dateTimeIndex] != this.prevRealDateTime) {
      // console.log('Index mismatch!', this.dateTimeIndex, this.prevRealDateTime, this.orderedDateTimes);
      this.dateTimeIndex = this.orderedDateTimes.indexOf(this.prevRealDateTime);
    }
  },

  initExceptions() {
    if (storage.historicalComplete && storage.exceptionsEnabled) {
      this.currentExceptions = getActiveExceptionsForTime(storage.currentTime, this.exceptionData);
      if (!this.currentExceptions) {
        this.currentExceptions = {
          orderedDateTimes: []
        };
      }
    }
  },

  subscribeToDateUpdater() {
    this.subscription = storage.dateKeeper$.subscribe(this.updateDeviceMarker.bind(this));
  },

  unsubscribe() {
    this.subscription.unsubscribe();
  },

  setHeading(currentLatLng, nextLatLng) {

    if (currentLatLng[0] === nextLatLng[0] && currentLatLng[1] === nextLatLng[1]) {
      // console.warn('139 same heading');
      return;
    }

    const currentAngle = this.mapMarker.options.rotationAngle;
    const newAngle = calculateHeadingAngle(currentLatLng, nextLatLng);
    const rotationAngle = calculateAnimatedAngleDelta(currentAngle, newAngle);

    if (rotationAngle) {
      this.mapMarker.setRotationAngle(currentAngle + rotationAngle);
    }
  },

};
