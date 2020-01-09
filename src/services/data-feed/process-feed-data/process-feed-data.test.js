import { processFeedData } from "./process-feed-data";
import { LOGRECORD, EXCEPTIONEVENT } from "../../../constants/feed-type-names";
import * as markers from "../../../components/map/markers/marker-model";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper,
  createDivsWithID,
  createDivsWithClasses
} from "../../../../tests/utils/test-helpers";

const date2018 = Date.parse("2018-05-01T06:12:18");   //1525169538000
const date2019 = Date.parse("2019-05-15T12:18:36");   //1557937116000
const date2020 = Date.parse("2020-06-22T18:36:06");   //1592865366000

const latLng2018 = { "lat": 43.4, "lng": -79.7 };
const latLng2019 = { "lat": 43.5, "lng": -79.6 };
const latLng2020 = { "lat": 43.6, "lng": -79.5 };

const requestedFeedTypes = [LOGRECORD, EXCEPTIONEVENT];
const samplelogRecordsData = {
  // change keys to seconds start of day?
  "testDevice": {
    orderedDateTimes: [
      date2018,
      date2019,
      date2020
    ],

    [date2018]: {
      latLng: [latLng2018.lat, latLng2018.lng],
      speed: 18
    },
    [date2019]: {
      latLng: [latLng2019.lat, latLng2019.lng],
      speed: 36
    },
    [date2020]: {
      latLng: [latLng2020.lat, latLng2020.lng],
      speed: 60
    }
  }
};
const sampleFeedData = [
  {
    data: [
      {
        dateTime: date2018,
        device: {
          id: "testDevice"
        },
        id: "YJZ",
        latitude: latLng2018.lat,
        longitude: latLng2018.lng,
        speed: 18
      },
      {
        dateTime: date2019,
        device: {
          id: "testDevice"
        },
        id: "YJZ",
        latitude: latLng2019.lat,
        longitude: latLng2019.lng,
        speed: 36
      },
      {
        dateTime: date2020,
        device: {
          id: "testDevice"
        },
        id: "YJZ",
        latitude: latLng2020.lat,
        longitude: latLng2020.lng,
        speed: 60
      }
    ],
    toVersion: "0000000000000006",
  },
  {
    data: [
      {
        activeFrom: date2018,
        activeTo: date2019,
        device: {
          id: "testDevice"
        },
        id: "YJZ",
        diagnostic: "AtWork",
        distance: 360,
        driver: "YJZ",
        duration: "06:18:36",
        rule: { id: "YJZAtWork" },
        version: "0000000005c3284b"
      }
    ],
    toVersion: "0000000000000012",
  }
];


describe("processFeedData tests", () => {

  beforeAll(() => {
    spyOnFunction(markers, "createDeviceMarker");
  });

  test("Should processFeedData", () => {
    processFeedData(sampleFeedData, requestedFeedTypes);
    // expect(logRecordsData).toEqual(samplelogRecordsData);
  });
});
