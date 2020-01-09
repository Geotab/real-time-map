import {
  getLatLngsForTimeRange,
  interpolateCurrentLatLng,
  getInterpolatedLatLng,
  getAllLatLngs,
  getLatLngUpToIndex
} from "./device-data-helpers";

import {
  spyOnFunction
} from "../../../../tests/utils/test-helpers";

import {
  getDeviceData,
  time2018,
  time2019,
  time2020,
  latLng2018,
  latLng2019,
  latLng2020
} from "../../../../tests/utils/mock-device";

import * as utilsHelpers from "../../../utils/helper";

describe("Device Data Helper Tests", () => {

  test("Test getLatLngUpToIndex.", () => {
    expect(getLatLngUpToIndex(1, getDeviceData()))
      .toEqual([latLng2018, latLng2019]);
  });

  test("Test interpolateCurrentLatLng.", () => {

    const testLatlng = [1, 2];
    const interpolatedLatlng = interpolateCurrentLatLng(time2019, time2018, time2020, testLatlng, testLatlng);
    expect(interpolatedLatlng).toEqual(testLatlng);
  });
});

describe("getLatLngsForTimeRange tests", () => {

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2019, time2019, getDeviceData()))
      .toEqual([latLng2019]);
  });

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2018, time2018 - 6000, getDeviceData()))
      .toEqual([]);
  });

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2018 - 1000, time2018 - 100, getDeviceData()))
      .toEqual([]);
  });

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2020 + 100, time2020 + 1001, getDeviceData()))
      .toEqual([]);
  });

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2018 - 1000, time2018, getDeviceData()))
      .toEqual([latLng2018,]);
  });

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2020, time2020 + 100, getDeviceData()))
      .toEqual([getDeviceData()[time2020].latLng,]);
  });

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2018 - 100, time2020 + 100, getDeviceData()))
      .toEqual([
        latLng2018,
        latLng2019,
        latLng2020
      ]);
  });

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2018, time2020, getDeviceData()))
      .toEqual([
        latLng2018,
        latLng2019,
        latLng2020
      ]);
  });

  test("Test getLatLngsForTimeRange", () => {

    const expectedLatlngs = [
      latLng2019,
      latLng2020
    ];

    expect(getLatLngsForTimeRange(time2018 + 100, time2020, getDeviceData()))
      .toEqual(expect.arrayContaining(expectedLatlngs));

  });

  test("Test getLatLngsForTimeRange", () => {

    const expectedLatlngs = [
      latLng2018,
      latLng2019
    ];

    expect(getLatLngsForTimeRange(time2018, time2020 - 100, getDeviceData()))
      .toEqual(expect.arrayContaining(expectedLatlngs));
  });

  test("Test getLatLngsForTimeRange", () => {
    expect(getLatLngsForTimeRange(time2018, time2019, getDeviceData()))
      .toEqual([
        latLng2018,
        latLng2019
      ]);
  });
});

describe("getInterpolatedLatLng tests", () => {

  test("Test getInterpolatedLatLng only one date time.", () => {
    expect(getInterpolatedLatLng(time2018 - 10000, getDeviceData()))
      .toEqual(latLng2018);
  });

  test("Test getInterpolatedLatLng real date time.", () => {
    expect(getInterpolatedLatLng(time2018, getDeviceData()))
      .toEqual(latLng2018);
  });

  test("Test getInterpolatedLatLng real date time.", () => {
    expect(getInterpolatedLatLng(time2019, getDeviceData()))
      .toEqual(latLng2019);
  });

  test("Test getInterpolatedLatLng real date time.", () => {
    expect(getInterpolatedLatLng(time2020, getDeviceData()))
      .toEqual(latLng2020);
  });

  test("Test getInterpolatedLatLng past date time.", () => {
    expect(getInterpolatedLatLng(time2018 - 10000, getDeviceData()))
      .toEqual(latLng2018);
  });

  test("Test getInterpolatedLatLng future date time.", () => {
    expect(getInterpolatedLatLng(time2020 + 10000, getDeviceData()))
      .toEqual(latLng2020);
  });

  test("Test interpolated date time.", () => {
    const halfWay = time2018 + Math.round((time2019 - time2018) / 2);
    expect(getInterpolatedLatLng(halfWay, getDeviceData()))
      .toEqual([1.5, 4.5]);
  });

  test("Test interpolated date time.", () => {
    const halfWayDate = time2019 + Math.round((time2020 - time2019) / 2);
    expect(getInterpolatedLatLng(halfWayDate, getDeviceData()))
      .toEqual([2.5, 5.5]);
  });

  test("Test interpolated date time.", () => {
    spyOnFunction(utilsHelpers, "arrayBinaryIndexSearch", () => 0);
    expect(getInterpolatedLatLng(time2019 - 6000, getDeviceData()))
      .toEqual(latLng2018);
  });

  test("Test interpolated date time.", () => {
    spyOnFunction(utilsHelpers, "arrayBinaryIndexSearch", () => getDeviceData().orderedDateTimes.length);
    expect(getInterpolatedLatLng(time2019 - 6000, getDeviceData()))
      .toEqual(latLng2020);
  });

  test("Test interpolated date time.", () => {

    spyOnFunction(utilsHelpers, "arrayBinaryIndexSearch", () => 1);
    const fakeDeviceData = {
      orderedDateTimes: [
        time2018,
        time2019
      ],
      [time2018]: {
        latLng: latLng2018,
        speed: 36
      },
      [time2019]: {
        latLng: latLng2018,
        speed: 36
      }
    };
    expect(getInterpolatedLatLng(time2019 - 6000, fakeDeviceData, null, true))
      .toEqual(latLng2018);
  });

});

describe("getLatLng tests", () => {

  test("Test getAllLatLngs", () => {
    expect(getAllLatLngs(getDeviceData()))
      .toEqual([
        latLng2018,
        latLng2019,
        latLng2020
      ]);
  });

  test("Test historicalPathModelgetLatLngUpToIndex(0)", () => {
    expect(getLatLngUpToIndex(0, getDeviceData()))
      .toEqual([
        getDeviceData()[time2018].latLng
      ]);
  });

  test("Test getLatLngUpToIndex(1)", () => {
    expect(getLatLngUpToIndex(1, getDeviceData()))
      .toEqual([
        latLng2018,
        latLng2019
      ]);
  });

  test("Test getLatLngUpToIndex(2)", () => {
    expect(getLatLngUpToIndex(2, getDeviceData()))
      .toEqual([
        latLng2018,
        latLng2019,
        latLng2020
      ]);
  });

  test("Test getLatLngUpToIndex(3)", () => {
    expect(getLatLngUpToIndex(3, getDeviceData()))
      .toEqual([
        latLng2018,
        latLng2019,
        latLng2020
      ]);
  });
});


