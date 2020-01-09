import {
  resetMapData,
  logRecordsData,
  markerList,
  devicesPropertyData,
  exceptionEventsData,
  groupsPropertyData,
} from "./map-data";

describe("api helpers tests", () => {

  test("Should resetMapData", () => {

    markerList.testID = {
      unsubscribe: jest.fn()
    };

    resetMapData();

    expect(markerList).toMatchObject({});
    expect(logRecordsData).toMatchObject({});
    expect(groupsPropertyData).toMatchObject({});
    expect(exceptionEventsData).toMatchObject({});
    expect(devicesPropertyData).toMatchObject({});

  });

});