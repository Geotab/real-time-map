import { apiConfig, userInfo } from "../../dataStore/api-config";
import storage from "../../dataStore";
import { getLiveTime } from "../../utils/helper";

export function makeAPICall(call, parameters) {
  return new Promise((resolve, reject) => {
    apiConfig.api.call(
      call,
      parameters,
      result => resolve(result),
      e => reject(e)
    );
  });
};

export function makeAPIMultiCall(calls) {
  return new Promise((resolve, reject) => {
    apiConfig.api.multiCall(
      calls,
      result => resolve(result),
      e => reject(e)
    );
  });
};

export function getAllActiveDevices(fromDate = new Date()) {

  const parameters = {
    "typeName": "Device",
    "search": {
      fromDate
    }
  };

  return makeAPICall("Get", parameters);
};

export function getGroups() {
  return makeAPICall("Get", {
    "typeName": "Group"
  });
};

export function getRules() {

  return makeAPICall("Get", {
    "typeName": "Rule"
  });
};

export function getDiagnosticByName(diagnosticName, resultsLimit = 36) {

  return makeAPICall("Get", {
    "typeName": "Diagnostic",
    resultsLimit,
    search: {
      name: `%${diagnosticName}%`,
      sourceSearch: { id: "SourceGeotabGoId" }
    }
  });
}

export function getRulesByName(ruleName, resultsLimit = 36) {

  return makeAPICall("Get", {
    "typeName": "Rule",
    resultsLimit,
    search: {
      name: `${ruleName}%`
    }
  });
}

export function getDeviceByName(deviceName, resultsLimit = 36) {

  return makeAPICall("Get", {
    "typeName": "Device",
    resultsLimit,
    search: {
      name: `%${deviceName}%`
    }
  });
}

export function createDeviceByNameCall(deviceName, resultsLimit = 36) {

  return ["Get", {
    "typeName": "Device",
    resultsLimit,
    search: {
      name: `%${deviceName}%`
    }
  }];
}

export function getGroupsByName(groupName, resultsLimit = 36) {
  return makeAPICall("Get", {
    "typeName": "Group",
    resultsLimit,
    search: {
      name: `${groupName}%`
    }
  });
}


export function createGroupsByNameCall(groupName, resultsLimit = 36) {
  return ["Get", {
    "typeName": "Group",
    resultsLimit,
    search: {
      name: `${groupName}%`
    }
  }];
}

export function getDevicesInGroups(groups = [{ id: "GroupCompanyId" }], fromDate = new Date()) {
  return makeAPICall("Get", {
    typeName: "Device",
    search: {
      groups,
      fromDate
    }
  });
}

export function getDeviceByID(id, resultsLimit = 12) {

  const call = createDeviceByIDCall(id);

  return makeAPICall(call[0], call[1]);
}

export function createDeviceByIDCall(id, resultsLimit = 12) {

  return ["Get", {
    "typeName": "Device",
    resultsLimit,
    search: {
      id
    }
  }];
}

export function getGroupByID(id, resultsLimit = 6) {

  const call = createGroupByIDCall(id, resultsLimit);

  return makeAPICall(call[0], call[1]);
}

export function createGroupByIDCall(id, resultsLimit = 6) {

  return ["Get", {
    "typeName": "Group",
    resultsLimit,
    search: {
      id
    }
  }];
}

export function createStatusDataCall(deviceID, diagnosticID, resultsLimit = 6, fromDate = new Date(storage.currentTime), toDate = new Date(storage.currentTime)) {
  return ["Get", {
    "typeName": "StatusData",
    resultsLimit,
    search: {
      deviceSearch: { id: deviceID },
      diagnosticSearch: { id: diagnosticID },
      fromDate,
      toDate
    }
  }];
}

export function saveBlobStorage(type, data) {
  const parameters = {
    "typeName": "AddInData",
    "entity": {
      "addInId": "aehms3LkXvUGOegveoI8aaA",
      "data": JSON.stringify({
        "userName": userInfo.userName,
        "date": getLiveTime(),
        "configData": {
          "type": type,
          "typeData": data
        }
      })
    }
  };

  return makeAPICall("Add", parameters);
}

export function getBlobStorage() {
  const parameters = {
    "typeName": "AddInData",
    "search": {
      "addInId": "aehms3LkXvUGOegveoI8aaA",
      "whereClause": `userName = "${userInfo.userName}"`,
    }
  };

  return makeAPICall("Get", parameters);
}
