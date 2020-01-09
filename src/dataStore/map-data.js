
export function resetMapData() {
  logRecordsData = {};

  devicesPropertyData = {};
  exceptionEventsData = {};
  groupsPropertyData = {};

  for (const deviceID of Object.keys(markerList)) {

    const deviceMarker = markerList[deviceID];
    deviceMarker.unsubscribe();

    for (const prop of Object.keys(deviceMarker)) {
      delete deviceMarker[prop];
    }

    // delete markerList[deviceID];
  }
  markerList = {};
}

export let logRecordsData = {
  // 'testDevice': {
  //   orderedDateTimes: [
  //     date2018,
  //     date2019,
  //     date2020
  //   ],

  //   [date2018]: {
  //     latLng: [latLng2018.lat, latLng2018.lng],
  //     speed: 18
  //   },
  //   [date2019]: {
  //     latLng: [latLng2019.lat, latLng2019.lng],
  //     speed: 36
  //   },
  //   [date2020]: {
  //     latLng: [latLng2020.lat, latLng2020.lng],
  //     speed: 60
  //   }
  // }
};

export let markerList = {
  // 'testDevice': deviceMarkerObject
};


export let exceptionEventsData = {
  // 'testDevice': {
  //   orderedDateTimes: [
  //     date2018,
  //     date2019,
  //     date2020
  //   ],

  //   [date2018]: {
  //     diagnostic: "NoDiagnosticId",
  //     distance: 0,
  //     driver: "UnknownDriverId",
  //     duration: "06:00:00",
  //     end: 1567789200000,
  //     id: "testID",
  //     ruleID: "RuleLongLunchId",
  //   },
  //   [date2019]: {
  //     latLng: [latLng2019.lat, latLng2019.lng],
  //     speed: 36
  //   },
  //   [date2020]: {
  //     latLng: [latLng2020.lat, latLng2020.lng],
  //     speed: 60
  //   }
  // }
};


export let devicesPropertyData = {
  // "b1234":{
  //   name:'test',
  //   groups:'etc'
  // }
};

export let groupsPropertyData = {
};
