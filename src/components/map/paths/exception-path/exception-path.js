import storage from "../../../../dataStore";
import layersModel from "../../layers";
import {
  createExceptionPaths,
  createNewExceptionPolyLine,
  addLatlngToExeptionPath
} from "./exception-path-helper";

export function initExceptionPath(deviceMarker) {
  const {
    deviceID,
    deviceData,
    exceptionData,
    isMoving,
    currentExceptions,
    currentLatLng
  } = deviceMarker;

  const polylines = createExceptionPaths(exceptionData, deviceData, deviceID, isMoving);

  const exceptionPathConstructors = {
    deviceID,
    deviceData,
    exceptionData,
    polylines,
  };

  const newExceptionPath = {
    ...exceptionPathModel,
    ...exceptionPathConstructors
  };

  newExceptionPath.setActiveExceptions(currentLatLng, currentExceptions);
  return newExceptionPath;
}

export const exceptionPathModel = {
  deviceID: undefined,
  deviceData: undefined,
  polylines: undefined,
  exceptionData: undefined,
  nextLatlng: false,

  timeChangedUpdate(latLng, currentExceptions) {

    this.deleteAllPolylines();
    this.polylines = createExceptionPaths(this.exceptionData, this.deviceData, this.deviceID, true);
    this.nextLatlng = latLng;
    this.setActiveExceptions(latLng, currentExceptions);
  },

  updateExceptionPath(realLatLng) {

    if (this.nextLatlng) {

      Object.values(this.polylines)
        // .map(path => {
        //   path.bringToFront();
        //   return path;
        // })
        .filter(path => path.isActive)
        .filter(path => storage.selectedExceptions.hasOwnProperty(path.ruleID))
        .forEach(path => {
          addLatlngToExeptionPath(path, this.nextLatlng, true);
        });

      this.nextLatlng = false;

    }

    if (realLatLng) {
      this.nextLatlng = realLatLng;
    }
  },

  newExceptionStarted(ruleID, latlng) {

    if (!storage.selectedExceptions.hasOwnProperty(ruleID)) {
      return;
    }

    if (this.polylines.hasOwnProperty(ruleID)) {
      addLatlngToExeptionPath(this.polylines[ruleID], latlng, false);

    } else {
      this.polylines[ruleID] = createNewExceptionPolyLine([latlng], this.deviceID, ruleID, true);
    }

    this.polylines[ruleID].isActive = true;
  },

  exceptionEnded(ruleID) {
    if (this.polylines.hasOwnProperty(ruleID)) {
      this.polylines[ruleID].isActive = false;
    }
  },

  deleteAllPolylines() {
    for (const [ruleID, exceptionPolyLine] of Object.entries(this.polylines)) {
      layersModel.removeFromAllLayers(exceptionPolyLine);
      delete this.polylines[ruleID];
    }
  },

  setActiveExceptions(currentLatLng, currentExceptions) {

    const { orderedDateTimes } = currentExceptions;
    if (orderedDateTimes.length <= 0) {
      return;
    }

    orderedDateTimes.forEach(endTime => {

      const activeExceptions = currentExceptions[endTime];
      Object.keys(activeExceptions).forEach(ruleID => {

        if (!this.polylines.hasOwnProperty(ruleID)) {
          this.polylines[ruleID] = createNewExceptionPolyLine([currentLatLng], this.deviceID, ruleID, true);
        }
        this.polylines[ruleID].isActive = true;
      });
    });
  }
};

