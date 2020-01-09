import {
  getActiveExceptionsForTime,
  getExceptionsForTimeRange,
  getAllExceptions,
  createPolylineExceptionLatLngs
} from "./exception-helpers";

import storage from "../../../dataStore";

const date2018 = Date.parse("2018-05-01T06:12:18");   //1525169538000
const date2019 = Date.parse("2019-05-15T12:18:36");   //1557937116000
const date2020 = Date.parse("2020-06-22T18:36:06");   //1592865366000

const latLng2018 = [43.4, -79.7];
const latLng2019 = [43.5, -79.6];
const latLng2020 = [43.6, -79.5];

const orderedDateTimes = [
  date2018,
  date2019,
  date2020
];

const deviceData = {
  orderedDateTimes,
  [date2018]: {
    latLng: latLng2018,
    speed: 18
  },
  [date2019]: {
    latLng: latLng2019,
    speed: 36
  },
  [date2020]: {
    latLng: latLng2020,
    speed: 60
  }
};

let oldDate;
let oldRange;

beforeAll(() => {
  oldDate = storage.currentTime;
  oldRange = storage.timeRangeStart;

  storage.currentTime = date2020 + 18000;
  storage.timeRangeStart = date2018 - 6000;
  storage.selectedExceptions.hasOwnPropertyBackup = storage.selectedExceptions.hasOwnProperty;
  storage.selectedExceptions.hasOwnProperty = () => true;
});

afterAll(() => {
  storage.selectedExceptions.hasOwnProperty = storage.selectedExceptions.hasOwnPropertyBackup;
  storage.currentTime = oldDate;
  storage.timeRangeStart = oldRange;
});

const exceptionData = {
  orderedDateTimes: [
    date2018 - 3000,
    date2018,
    date2019,
    date2019 + 3000,
    date2020,
    date2020 + 6000
  ],
  [date2018 - 3000]: {
    [date2020 + 3000]: {
      exception1: {}
    }
  },
  [date2018]: {
    [date2019]: {
      exception2: {}
    }
  },
  [date2019]: {
    [date2019 + 6000]: {
      exception3: {}
    }
  },
  [date2019 + 3000]: {
    [date2019 + 6000]: {
      exception1: {}
    }
  },
  [date2020]: {
    [date2020 + 6000]: {
      exception1: {}
    }
  },
  [date2020 + 6000]: {
    [date2020 + 12000]: {
      exception2: {}
    }
  },
};

const allExceptions = {
  exception1:
  {
    "1525169535000": { end: "1592865369000" },
    "1557937119000": { end: "1557937122000" },
    "1592865366000": { end: "1592865372000" }
  },
  exception2:
  {
    "1525169538000": { end: "1557937116000" },
    [date2020 + 6000]: {
      end: (date2020 + 12000).toString()
    }
  },
  exception3: {
    [date2019]: {
      end: (date2019 + 6000).toString()
    }
  }
};

function createCorrectExceptionForTimeResult(solution) {

  const result = {
    orderedDateTimes: [],
  };

  solution.forEach(startTime => {
    Object.keys(exceptionData[startTime]).forEach(endTime => {
      if (result.orderedDateTimes.indexOf(endTime) === -1) {
        result.orderedDateTimes.push(endTime);
      }
      if (!result[endTime]) {
        result[endTime] = {};
      }
      result[endTime] = { ...result[endTime], ...exceptionData[startTime][endTime] };
    });
  });

  return result;
}

describe("getActiveExceptionsForTime tests", () => {

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2018 - 6000, exceptionData))
      .toBeFalsy();
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2020 + 18000, exceptionData))
      .toBeFalsy();
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2018 - 1000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2018, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2018, date2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2018 + 3000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2018, date2018 - 3000])
      );
  });


  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2019, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2019, date2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2019 + 3000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2019, date2019 + 3000, date2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2019 + 6000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2020, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2018 - 3000, date2020])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2020 + 3000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2020])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2020 + 6000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2020 + 6000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(date2020 + 9000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([date2020 + 6000])
      );
  });
});

describe("getExceptionsForTimeRange tests", () => {

  test("Test getExceptionsForTimeRange", () => {
    expect(getExceptionsForTimeRange(date2018 - 6000, date2020 + 18000, exceptionData))
      .toEqual(allExceptions);
  });

  test("Test getExceptionsForTimeRange", () => {
    expect(getExceptionsForTimeRange(date2019 - 1, date2020 + 6001, exceptionData))
      .toEqual(allExceptions);
  });

  test("Test getExceptionsForTimeRange", () => {
    const {
      [date2020 + 6000]: remove,
      ...exception2
    } = allExceptions.exception2;

    const result = {
      ...allExceptions,
      ...{ exception2 }
    };

    expect(getExceptionsForTimeRange(date2018 - 6000, date2020 + 6000, exceptionData))
      .toEqual(result);
  });

  test("Test getExceptionsForTimeRange", () => {
    const {
      [date2018]: remove,
      ...exception2
    } = allExceptions.exception2;

    const result = {
      ...allExceptions,
      ...{ exception2 }
    };

    expect(getExceptionsForTimeRange(date2019, date2020 + 18000, exceptionData))
      .toEqual(result);
  });

  test("Test getExceptionsForTimeRange", () => {
    const {
      exception2,
      ...result
    } = allExceptions;

    expect(getExceptionsForTimeRange(date2019, date2020 + 6000, exceptionData))
      .toEqual(result);
  });

  test("Test getExceptionsForTimeRange", () => {

    const {
      [date2020]: remove,
      ...exception1
    } = allExceptions.exception1;

    const {
      exception2,
      ...result
    } = allExceptions;

    result.exception1 = exception1;

    expect(getExceptionsForTimeRange(date2019 + 3000, date2019 + 6000, exceptionData))
      .toEqual(result);
  });

  test("Test getExceptionsForTimeRange", () => {

    const {
      [date2018]: remove,
      ...exception2
    } = allExceptions.exception2;

    const {
      exception1,
      exception3,
      ...result
    } = allExceptions;

    result.exception2 = exception2;

    expect(getExceptionsForTimeRange(date2020 + 6001, date2020 + 10000, exceptionData))
      .toEqual(result);
  });

});

describe("getAllExceptions tests", () => {

  test("Test getAllExceptions", () => {
    expect(getAllExceptions(exceptionData))
      .toEqual(allExceptions);
  });

});


const exceptionLatLngs = {
  "exception1": [
    [
      latLng2018,
      latLng2019,
      latLng2020
    ],
    [
      [43.50000000858903, -79.59999999141095],
      [43.500000017178074, -79.59999998282193]
    ],
    [
      latLng2020
    ]
  ],
  "exception2": [
    [
      latLng2018,
      latLng2019
    ],
    [
      latLng2020
    ],
  ],
  "exception3": [
    [
      latLng2019,
      [43.500000017178074, -79.59999998282193]
    ]
  ]
};

describe("createPolylineExceptionLatLngs tests", () => {
  test("Test createPolylineExceptionLatLngs", () => {
    expect(createPolylineExceptionLatLngs(exceptionData, deviceData))
      .toEqual(exceptionLatLngs);
  });

});

