import { processLogRecords } from './process-log-records';
// import { logRecordsData } from '../../dataStore/map-data';

import { logRecordsData, markerList } from "../../../dataStore/map-data";
import { createObjectKeyIfNotExist, insertIntoOrderedArray } from "../../../utils/helper";
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

// const samplelogRecordsData = {
//   'testDevice': {
//     orderedDateTimes: [
//       date2018,
//       date2019,
//       date2020
//     ],

//     [date2018]: {
//       latLng: [latLng2018.lat, latLng2018.lng],
//       speed: 18
//     },
//     [date2019]: {
//       latLng: [latLng2019.lat, latLng2019.lng],
//       speed: 36
//     },
//     [date2020]: {
//       latLng: [latLng2020.lat, latLng2020.lng],
//       speed: 60
//     }
//   }
// };

const sampleLogRecords = [
  {
    dateTime: date2018,
    device: {
      id: 'testDevice'
    },
    id: "YJZ",
    latitude: latLng2018.lat,
    longitude: latLng2018.lng,
    speed: 18
  },
  {
    dateTime: date2019,
    device: {
      id: 'testDevice'
    },
    id: "YJZ",
    latitude: latLng2019.lat,
    longitude: latLng2019.lng,
    speed: 36
  },
  {
    dateTime: date2020,
    device: {
      id: 'testDevice'
    },
    id: "YJZ",
    latitude: latLng2020.lat,
    longitude: latLng2020.lng,
    speed: 60
  },
];

describe("processLogRecords tests", () => {
  beforeAll(() => {
    spyOnFunction(markers, "createDeviceMarker");
  });

  test("Should processLogRecords", () => {
    processLogRecords(sampleLogRecords);
    // expect(logRecordsData).toEqual(samplelogRecordsData);
  });
});
