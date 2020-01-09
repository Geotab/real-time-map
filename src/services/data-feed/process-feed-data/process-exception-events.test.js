import processExceptionEvents from "./process-exception-events";
import { time2018 } from "../../../../tests/utils/mock-device";
import storage from "../../../dataStore";

const date2018 = Date.parse("2018-05-01T06:12:18");   //1525169538000
const date2019 = Date.parse("2019-05-15T12:18:36");   //1557937116000
const date2020 = Date.parse("2020-06-22T18:36:06");   //1592865366000

const sampleExceptionEvents = {
  "testID": {
    [date2018]: {
      [date2018 + 1000]: {
        "RuleIdlingId1": {
          "diagnosticID": "DiagnosticIgnitionId1",
        }
      }
    },

    [date2019]: {
      [date2020]: {
        "RuleIdlingId2": {
          "diagnosticID": "DiagnosticIgnitionId2",
        }
      }
    },

    [date2020]: {
      [date2020 + 1000]: {
        "RuleIdlingId3": {
          "diagnosticID": "DiagnosticIgnitionId3",
        }
      }
    },

    "orderedDateTimes": [
      date2018,
      date2019,
      date2020
    ],
  },
};

const sampleExceptionEventsData = [
  {
    activeFrom: date2018,
    activeTo: date2018 + 1000,
    device: { id: "testID" },
    diagnostic: { id: "DiagnosticIgnitionId1" },
    distance: 0,
    driver: "UnknownDriverId",
    duration: "00:01:40.5600000",
    id: "testID2",
    rule: { id: "RuleIdlingId1" },
    version: "0000000000fafe7e",
  },
  {
    activeFrom: date2019,
    activeTo: date2020,
    device: { id: "testID" },
    diagnostic: { id: "DiagnosticIgnitionId2" },
    distance: 1,
    driver: "UnknownDriverId",
    duration: "00:01:40.5600000",
    id: "testID2",
    rule: { id: "RuleIdlingId2" },
    version: "0000000000fafe7e",
  },
  {
    activeFrom: date2020,
    activeTo: date2020 + 1000,
    device: { id: "testID" },
    diagnostic: { id: "DiagnosticIgnitionId3" },
    distance: 2,
    driver: "UnknownDriverId",
    duration: "00:01:40.5600000",
    id: "testID2",
    rule: { id: "RuleIdlingId3" },
    version: "0000000000fafe7e",
  },
];

describe("processExceptionEvents tests", () => {

  test("Should processExceptionEvents", () => {
    storage.exceptionsEnabled = false;
    processExceptionEvents(sampleExceptionEventsData);
  });

  test("Should processExceptionEvents", () => {
    storage.exceptionsEnabled = true;
    processExceptionEvents(sampleExceptionEventsData);
  });
});
