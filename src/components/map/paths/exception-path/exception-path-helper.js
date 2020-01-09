import L from "leaflet";
import storage from "../../../../dataStore";
import {
  createPolylineExceptionLatLngs
} from "../../utils/exception-helpers";

import { getExceptionColor } from "../../../../utils/helper";
import layersModel from "../../layers";
import { bindExceptionPopUp } from "../../popups/path-popups";

export function createExceptionPaths(exceptionData, deviceData, deviceID, isMoving, startingWeight = 3.5) {

  const polylines = {};
  let weight = startingWeight;

  const exceptionLatLngs = createPolylineExceptionLatLngs(exceptionData, deviceData);
  const ruleIDList = Object.keys(exceptionLatLngs);

  if (ruleIDList.length <= 0) {
    return polylines;
  }

  ruleIDList.forEach(ruleID => {

    //Check if exception is chosen
    if (storage.selectedExceptions.hasOwnProperty(ruleID) && !polylines.hasOwnProperty(ruleID)) {

      const polylineLatLngs = exceptionLatLngs[ruleID];
      polylines[ruleID] = createNewExceptionPolyLine(polylineLatLngs, deviceID, ruleID, isMoving, weight);
      weight = weight < 6 ? weight + 1 : weight;

    }
  });

  return polylines;
}

export function createNewExceptionPolyLine(polylineLatLngs, deviceID, ruleID, isMoving, weight = 3.5) {

  const exceptionPolyLine = L.polyline(polylineLatLngs, {
    smoothFactor: 1,
    weight,
    color: getExceptionColor(ruleID),
    // dashArray: '36 6',
    // className: deviceID + dateTimeStamp
  });

  Object.assign(exceptionPolyLine, { ruleID, deviceID, isActive: false });

  layersModel.addToAllLayer(exceptionPolyLine);
  layersModel.addToLayer("exceptionLayer", exceptionPolyLine);
  if (storage.selectedDevices.hasOwnProperty(deviceID)) {
    layersModel.addToLayer("Filter", exceptionPolyLine);
  }

  exceptionPolyLine.bringToFront();
  bindExceptionPopUp(exceptionPolyLine);
  return exceptionPolyLine;
}

export function addLatlngToExeptionPath(path, latlng, addToEndOfMultiPolyline) {

  if (latlng.length < 1) {
    return;
  }

  const oldLatLngs = path.getLatLngs();

  const newLatlngs = buildNewExceptionPathLatlngs(oldLatLngs, latlng, addToEndOfMultiPolyline);

  path.setLatLngs(newLatlngs);
};

export function buildNewExceptionPathLatlngs(oldLatLngs, latlng, addToEndOfMultiPolyline) {

  let newLatlngs;
  const isMultiPolyLine = Array.isArray(oldLatLngs[0]);

  if (isMultiPolyLine) {
    if (addToEndOfMultiPolyline) {
      return addToLastRing(oldLatLngs, latlng);
    }
    newLatlngs = oldLatLngs;

  } else {
    // Put old latlngs in a multi ring polyline;
    newLatlngs = [oldLatLngs];
  }

  newLatlngs.push([latlng]);
  return newLatlngs;
}

export function addToLastRing(oldLatLngs, newLatlng) {
  const lastIndex = oldLatLngs.length - 1;
  oldLatLngs[lastIndex].push(newLatlng);
  return oldLatLngs;
}