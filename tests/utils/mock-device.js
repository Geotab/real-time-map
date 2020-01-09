export const time2018 = Date.parse("2018-05-01T06:12:18");   //1525169538000
export const time2019 = Date.parse("2019-05-15T00:00:00");   //1557892800000
export const time2020 = Date.parse("2020-06-22T23:59:59");   //1592884799000

export const latLng2018 = [1, 4];
export const latLng2019 = [2, 5];
export const latLng2020 = [3, 6];

export const deviceID = "testDevice";

export const deviceData = {
  orderedDateTimes: [
    time2018,
    time2019,
    time2020
  ],

  [time2018]: {
    latLng: latLng2018,
    speed: 18
  },
  [time2019]: {
    latLng: latLng2019,
    speed: 36
  },
  [time2020]: {
    latLng: latLng2020,
    speed: 60
  }
};

export function getDeviceData() {
  return {
    orderedDateTimes: [
      time2018,
      time2019,
      time2020
    ],

    [time2018]: {
      latLng: latLng2018,
      speed: 18
    },
    [time2019]: {
      latLng: latLng2019,
      speed: 36
    },
    [time2020]: {
      latLng: latLng2020,
      speed: 60
    }
  }
}

export const exceptionData = {
  orderedDateTimes: [
    time2018 - 3000,
    time2018,
    time2019,
    time2019 + 3000,
    time2020,
    time2020 + 6000
  ],
  [time2018 - 3000]: {
    [time2020 + 3000]: {
      exception1: {}
    }
  },
  [time2018]: {
    [time2019]: {
      exception2: {}
    }
  },
  [time2019]: {
    [time2019 + 6000]: {
      exception3: {}
    }
  },
  [time2019 + 3000]: {
    [time2019 + 6000]: {
      exception1: {},
      exception2: {}
    }
  },
  [time2020]: {
    [time2020 + 6000]: {
      exception1: {}
    }
  },
  [time2020 + 6000]: {
    [time2020 + 12000]: {
      exception2: {}
    }
  }
};

export const currentExceptions = {
  orderedDateTimes: [time2019 + 6000, time2020 + 3000],
  [time2020 + 3000]: {
    exception1: {}
  },
  [time2019 + 6000]: {
    exception3: {}
  }
};

export const mapMarker = {
  on: jest.fn(),
  bindPopup: jest.fn(),
  setLatLng: jest.fn(),
  setRotationAngle: jest.fn(),
  isPopupOpen: jest.fn(() => true),
  options: {
    rotationAngle: 60
  },
  getElement() {
    return {
      style: {}
    };
  },
  getLatLng() {
    return {
      lat: latLng2019[0],
      lng: latLng2019[1],
      equals: () => false
    };
  },
};

export const popupModel = {
  resetAnimation: jest.fn(),
  setTransitionAnimation: jest.fn(),
  updatePopup: jest.fn(),
};

export const livePath = {
  timeChangedUpdate: jest.fn(),
  setActiveException: jest.fn(),
  updateRealLatLng: jest.fn(),
  updateInterpolatedLatLng: jest.fn(),
};
export const historicPath = {
  timeChangedUpdate: jest.fn(),
  updateHistoricPath: jest.fn(),
};
export const exceptionPath = {
  polylines: {
    exception1: {}
  },
  timeChangedUpdate: jest.fn(),
  newExceptionStarted: jest.fn(),
  updateExceptionPath: jest.fn(),
  exceptionEnded: jest.fn(),
};

export const testPaths = {
  livePath,
  historicPath,
  exceptionPath,
};

export const testDeviceMarker = {
  deviceID,

  deviceData,
  orderedDateTimes: deviceData.orderedDateTimes,

  exceptionData,
  currentExceptions,

  speed: 36,
  isMoving: true,
  dateTimeIndex: 1,
  timeChanged: false,

  currentlatLng: latLng2019,
  prevRealDateTime: time2019,
  currentLayers: ["movingLayer"],

  livePath,
  historicPath,
  exceptionPath,

  mapMarker,
  popupModel,

  subscription: {
    unsubscribe: jest.fn(),
  },

  checkInLayer: jest.fn(),
  initExceptions: jest.fn(),
  moveToLatLng: jest.fn(),
  periodChangedUpdate: jest.fn(),
  resetAnimation: jest.fn(),

  setCurrentDateTime: jest.fn(),
  setHeading: jest.fn(),
  setLayer: jest.fn(),
  setToMoving: jest.fn(),
  setToStopped: jest.fn(),
  setTransitionAnimation: jest.fn(),

  subscribeToDateUpdater: jest.fn(),
  timeChangedUpdate: jest.fn(),
  unsubscribe: jest.fn(),
  updateDeviceMarker: jest.fn(),
  updateExceptions: jest.fn(),
  updateLatLng: jest.fn(),
  updatePaths: jest.fn(),
  veryifyDateTimeIndex: jest.fn(),

};

export function getTestMarker() {
  return { ...testDeviceMarker };
}
