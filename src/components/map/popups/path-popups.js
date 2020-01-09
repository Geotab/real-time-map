
import storage from "../../../dataStore";

import {
  retrieveDeviceInfo,
  filterMarkerButton,
  getStrongText,
  escapeQuotes,
  getDefaultPopupText
} from "./popup-helpers";

import { getExceptionColor } from "../../../utils/helper";

export function bindDeviceNamePopup(deviceID, polyline) {

  polyline.bindPopup(getDefaultPopupText(deviceID));

  polyline.on("popupopen", () => {
    retrieveDeviceInfo(deviceID).then(deviceData => {
      const { name } = deviceData;
      const cleanedName = escapeQuotes(name);
      const popupText = filterMarkerButton(deviceID, cleanedName) + getStrongText(cleanedName);

      polyline.setPopupContent(popupText);
    });
  });
}

export function bindExceptionPopUp(exceptionPolyLine) {

  const {
    deviceID,
    ruleID,
  } = exceptionPolyLine;

  exceptionPolyLine.bindPopup(getDefaultPopupText(deviceID));

  exceptionPolyLine.on("popupopen", () => {

    retrieveDeviceInfo(deviceID).then(deviceData => {

      const popupText = createExceptionPopUp(deviceID, deviceData, ruleID);
      exceptionPolyLine.setPopupContent(popupText);

    });
  });
}

function createExceptionPopUp(deviceID, deviceData, ruleID) {

  const popTextFactory = [];

  const { name } = deviceData;
  const cleanedName = escapeQuotes(name);
  popTextFactory.push(filterMarkerButton(deviceID, cleanedName));
  popTextFactory.push(getStrongText(cleanedName));

  if (storage.selectedExceptions.hasOwnProperty(ruleID)) {

    const {
      name,
    } = storage.selectedExceptions[ruleID];

    popTextFactory.push(`<p class="popupRuleName" style="border-top: 1px solid ${getExceptionColor(ruleID)}">`);
    popTextFactory.push(`Rule Name: ${name ? name : ruleID}`);
  }

  popTextFactory.push("</p>");
  return popTextFactory.filter(Boolean).join("");
}