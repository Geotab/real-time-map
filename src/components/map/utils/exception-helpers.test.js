import {
  getActiveExceptionsForTime,
  getExceptionsForTimeRange,
  getAllExceptions,
  createPolylineExceptionLatLngs
} from "./exception-helpers";

import {
  time2018,
  time2019,
  time2020,
  latLng2018,
  latLng2019,
  latLng2020,
  exceptionData,
  getDeviceData
} from "../../../../tests/utils/mock-device";

import storage from "../../../dataStore";

const deviceData = getDeviceData();

let oldDate;
let oldRange;

beforeAll(() => {
  oldDate = storage.currentTime;
  oldRange = storage.timeRangeStart;

  storage.currentTime = time2020 + 18000;
  storage.timeRangeStart = time2018 - 6000;
  storage.selectedExceptions.hasOwnPropertyBackup = storage.selectedExceptions.hasOwnProperty;
  storage.selectedExceptions.hasOwnProperty = () => true;
});

afterAll(() => {
  storage.selectedExceptions.hasOwnProperty = storage.selectedExceptions.hasOwnPropertyBackup;
  storage.currentTime = oldDate;
  storage.timeRangeStart = oldRange;
});


const allExceptions = {
  exception1:
  {
    [time2018 - 3000]: { end: (time2020 + 3000).toString() },
    [time2019 + 3000]: { end: (time2019 + 6000).toString() },
    [time2020]: { end: (time2020 + 6000).toString() }
  },
  exception2:
  {
    [time2018]: { end: time2019.toString() },
    [time2019 + 3000]: { end: (time2019 + 6000).toString() },
    [time2020 + 6000]: {
      end: (time2020 + 12000).toString()
    }
  },
  exception3: {
    [time2019]: {
      end: (time2019 + 6000).toString()
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
    expect(getActiveExceptionsForTime(time2018 - 6000, exceptionData))
      .toBeFalsy();
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2020 + 18000, exceptionData))
      .toBeFalsy();
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2018 - 1000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2018, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2018, time2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2018 + 3000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2018, time2018 - 3000])
      );
  });


  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2019, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2019, time2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2019 + 3000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2019, time2019 + 3000, time2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2019 + 6000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2018 - 3000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2020, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2018 - 3000, time2020])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2020 + 3000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2020])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2020 + 6000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2020 + 6000])
      );
  });

  test("Test getActiveExceptionsForTime", () => {
    expect(getActiveExceptionsForTime(time2020 + 9000, exceptionData))
      .toEqual(
        createCorrectExceptionForTimeResult([time2020 + 6000])
      );
  });
});

describe("getExceptionsForTimeRange tests", () => {

  test("Test getExceptionsForTimeRange", () => {
    expect(getExceptionsForTimeRange(time2018 - 6000, time2020 + 18000, exceptionData))
      .toEqual(allExceptions);
  });

  test("Test getExceptionsForTimeRange", () => {
    expect(getExceptionsForTimeRange(time2019 - 1, time2020 + 6001, exceptionData))
      .toEqual(allExceptions);
  });

  test("Test getExceptionsForTimeRange", () => {
    const {
      [time2020 + 6000]: remove,
      ...exception2
    } = allExceptions.exception2;

    const result = {
      ...allExceptions,
      ...{ exception2 }
    };

    expect(getExceptionsForTimeRange(time2018 - 6000, time2020 + 6000, exceptionData))
      .toEqual(result);
  });

  test("Test getExceptionsForTimeRange", () => {
    const {
      [time2018]: remove,
      ...exception2
    } = allExceptions.exception2;

    const result = {
      ...allExceptions,
      ...{ exception2 }
    };

    expect(getExceptionsForTimeRange(time2019, time2020 + 18000, exceptionData))
      .toEqual(result);
  });

  test.skip("Test getExceptionsForTimeRange", () => {
    const {
      exception2,
      ...result
    } = allExceptions;

    expect(getExceptionsForTimeRange(time2019, time2020 + 6000, exceptionData))
      .toEqual(result);
  });

  test.skip("Test getExceptionsForTimeRange", () => {

    const {
      [time2020]: remove,
      ...exception1
    } = allExceptions.exception1;

    const {
      exception2,
      ...result
    } = allExceptions;

    result.exception1 = exception1;

    expect(getExceptionsForTimeRange(time2019 + 3000, time2019 + 6000, exceptionData))
      .toEqual(result);
  });

  test.skip("Test getExceptionsForTimeRange", () => {

    const {
      [time2018]: remove,
      ...exception2
    } = allExceptions.exception2;

    const {
      exception1,
      exception3,
      ...result
    } = allExceptions;

    result.exception2 = exception2;

    expect(getExceptionsForTimeRange(time2020 + 6001, time2020 + 10000, exceptionData))
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
      [2.0000000857338844, 5.000000085733885],
      [2.000000171467769, 5.000000171467769]
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
      [2.0000000857338844, 5.000000085733885,],
      [2.000000171467769, 5.000000171467769,],
    ],
    [latLng2020]
  ],
  "exception3": [
    [
      latLng2019,
      [2.000000171467769, 5.000000171467769]
    ]
  ]
};

describe("createPolylineExceptionLatLngs tests", () => {
  test("Test createPolylineExceptionLatLngs", () => {
    expect(createPolylineExceptionLatLngs(exceptionData, deviceData))
      .toEqual(exceptionLatLngs);
  });
});

