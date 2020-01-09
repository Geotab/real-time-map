import storage from "../../../dataStore";
import { cleanUnitOfMeasure } from "../../../constants/unit-of-measures";

import {
  getDeviceByID,
  createGroupByIDCall,
  makeAPIMultiCall,
  createStatusDataCall
} from "../../../services/api/helpers";

import {
  groupsPropertyData,
  devicesPropertyData,
  markerList
} from "../../../dataStore/map-data";

import {
  DiagnosticIgnitionId,
  DiagnosticEngineSpeedId
} from "../../../constants/diagnostic-ids";

export function retrieveDeviceInfo(deviceID) {

  if (devicesPropertyData.hasOwnProperty(deviceID)) {
    return Promise.resolve(devicesPropertyData[deviceID]);
  }

  return getDeviceByID(deviceID).then(deviceData => {

    if (Object.keys(deviceData).length === 0) {
      deviceData.push(populateEmptyDeviceData(deviceID));
    }

    devicesPropertyData[deviceID] = {};
    [
      "id",
      "name",
      "groups",
      // "licensePlate",
      // "licenseState",
      // "serialNumber",
      // "vehicleIdentificationNumber",
      // "comment"
    ].forEach(prop => devicesPropertyData[deviceID][prop] = deviceData[0][prop]);

    return devicesPropertyData[deviceID];
  });
}

function populateEmptyDeviceData(deviceID) {
  const defaultDeviceData = {
    id: deviceID,
    name: deviceID,
    groups: []
  };

  return defaultDeviceData;
}

export function retrieveGroupsInfo(groupIDs) {

  const groups = {};
  const groupSearchCalls = [];

  groupIDs.forEach(groupID => {
    if (groupsPropertyData.hasOwnProperty(groupID)) {
      groups[groupID] = groupsPropertyData[groupID];
    } else {
      groupSearchCalls.push(createGroupByIDCall(groupID));
    }
  });

  if (!groupSearchCalls.length) {
    return Promise.resolve(groups);
  }

  return makeAPIMultiCall(groupSearchCalls).then(groupResults => {

    groupResults.flat().forEach(group => {

      const {
        id,
        name,
        color
      } = group;

      groupsPropertyData[id] = {
        id,
        color,
        name: name ? name : id
      };
      groups[id] = groupsPropertyData[id];
    });

    return groups;
  });
}

export function retrieveStatusInfo(deviceID) {

  const statusData = {};
  const statuses = Object.values(storage.selectedStatuses);

  if (statuses.length < 1) {
    return Promise.resolve({});
  }

  const statusDataCalls = createStatusDataCalls(deviceID, statuses, statusData);

  return makeAPIMultiCall(statusDataCalls).then(result =>
    processStatusData(result, statusData)
  );

}

export function processStatusData(result, statusData) {

  let isIgnitionOn = 0;
  result.forEach(statusResultsArray => {

    if (!statusResultsArray.length) {
      return;
    }

    let {
      data,
      dateTime,
      diagnostic: {
        id
      }
    } = statusResultsArray[0];

    if (id === DiagnosticIgnitionId) {
      const ignitionData = getLastIgnitionData(statusResultsArray);
      ({ data, dateTime } = ignitionData);
      isIgnitionOn = data;
    }

    if (statusData.hasOwnProperty(id)) {
      statusData[id].data = isNaN(data) ? data : parseFloat(data).toFixed(2);
      statusData[id].dateTime = dateTime;
    }

  });

  fixMyGeotabInterpolation(statusData, isIgnitionOn);

  return statusData;
}

export function fixMyGeotabInterpolation(statusData, isIgnitionOn) {
  const myGeotabInterpolationFixIDs = [DiagnosticEngineSpeedId];

  const myGeotabInterpolationFix = myGeotabInterpolationFixIDs
    .map(id => statusData.hasOwnProperty(id) ? id : false)
    .filter(Boolean);

  if (!isIgnitionOn && myGeotabInterpolationFix.length > 0) {
    myGeotabInterpolationFix.forEach(id => {
      statusData[id].data = "N/A";
    });
  }
}

export function getLastIgnitionData(status) {
  const { length } = status;
  return status[length - 1];
}

function createStatusDataCalls(deviceID, statuses, statusData) {

  const statusDataCalls = statuses.map(status => {

    const {
      id,
      name,
      unitOfMeasure
    } = status;

    statusData[id] = {
      name,
      data: "N/A",
      cleanedUnitOfMeasure: cleanUnitOfMeasure(unitOfMeasure)
    };

    return createStatusDataCall(deviceID, id);
  });

  const ignitionStatusCall = createStatusDataCall(deviceID, DiagnosticIgnitionId, 36000, storage.dayStart);
  statusDataCalls.push(ignitionStatusCall);

  return statusDataCalls;
}

window.flyToDevice = id => {
  const deviceMarker = markerList[id];
  const newZoomLevel = Math.max(Math.min(storage.map.getZoom() + 1, 18), 15);
  storage.map.flyTo(deviceMarker.currentlatLng, newZoomLevel);
};

export function filterMarkerButton(deviceID, cleanedName = "Go Device") {
  return `<button class="RTM-FocusMarkerButton" onclick="addDeviceToFilter('${deviceID}','${cleanedName}')" type="button" title="Add Device to Vehicle Filter"></button>`;
}

export function flytoMarkerButton(deviceID) {
  return `<button class="RTM-FocusMarkerButton" onclick="flyToDevice('${deviceID}')" type="button" title="Add Device to Vehicle Filter"></button>`;
}

export function escapeQuotes(text) {
  return text.replace("'", "\\'");
}

export function getDefaultPopupText(deviceID) {
  return flytoMarkerButton(deviceID) + getStrongText(deviceID);
}

export function getStrongText(text) {
  return `<strong>${text}</strong>`;
}

export function getGroupsForDeviceID(deviceID) {
  const groupsDataPromise = retrieveDeviceInfo(deviceID).then(deviceData => {
    if (deviceData.hasOwnProperty("groups") && deviceData.groups.length > 0) {

      const groupIDS = deviceData.groups.map(group => group.id);
      return retrieveGroupsInfo(groupIDS);
    }
    return Promise.resolve({});
  });

  return groupsDataPromise;
}
