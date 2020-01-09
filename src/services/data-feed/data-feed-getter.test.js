import * as helpers from "../api/helpers";
import * as snackBar from "../../components/snackbar/snackbar";
import * as processFeedData from "./process-feed-data/process-feed-data";
import { progressBar } from "../../components/progress-bar/progress-indicator";
import * as linearProgress from "@material/linear-progress";

import {
  feedDataGetter,
  initRealTimeFeedRunner,
  realTimefeedRunner,
  initHistoricalFeedRunner,
  getFeedDataCache,
  historicalFeedRunner,
  historicalFeedDataComplete
} from "./data-feed-getter";

import { markerList } from "../../dataStore/map-data";

import { LOGRECORD, EXCEPTIONEVENT, FAULTDATA } from "../../constants/feed-type-names";
import storage from "../../dataStore";

import { apiConfig } from "../../dataStore/api-config";
import * as utilsHelpers from "../../utils/helper";
import {
  spyOnFunction,
  mockDateKeeper,
  mockAPI,
  createDivsWithClasses
} from "../../../tests/utils/test-helpers";

import {
  deviceID,
  getTestMarker,
} from "../../../tests/utils/mock-device";

const startDateWithDelay = new Date(Date.now() - 360000);
const fromDate = startDateWithDelay.toISOString();

const mockResponse = [
  {
    data: [],
    toVersion: 100
  },
  {
    data: [],
    toVersion: 200
  }
];

describe("Feed data getter", () => {

  let testFeedDataGetter;

  beforeAll(() => {

    jest.useFakeTimers();
    spyOnFunction(helpers, "makeAPIMultiCall", () => Promise.resolve(mockResponse));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    testFeedDataGetter = { ...feedDataGetter };
    testFeedDataGetter.init(
      fromDate,
      [LOGRECORD, EXCEPTIONEVENT],
      360
    );
  });

  test("init", () => {
    testFeedDataGetter.init(
      fromDate,
      [LOGRECORD, EXCEPTIONEVENT],
    );

    expect(testFeedDataGetter.resultsLimit).toBe(60000);
  });

  test("init", () => {

    const fakeSearch = "fake";

    testFeedDataGetter.init(
      fromDate,
      [LOGRECORD, EXCEPTIONEVENT],
      360,
      fakeSearch
    );

    expect(testFeedDataGetter.search).toBe(fakeSearch);
  });

  test("Should update lastFeedVersions", () => {
    testFeedDataGetter.updateFeedVersions(mockResponse);

    expect(testFeedDataGetter.lastFeedVersions[LOGRECORD]).toBe(100);
    expect(testFeedDataGetter.lastFeedVersions[EXCEPTIONEVENT]).toBe(200);
  });

  test("Should create multiCallList", () => {

    testFeedDataGetter.lastFeedVersions = {
      [LOGRECORD]: 100,
      [EXCEPTIONEVENT]: 200
    };

    const multiCallList = testFeedDataGetter.createMultiCallList();

    const result = [
      ["GetFeed",
        {
          "fromVersion": 100,
          "resultsLimit": 360,
          "search": {
            "fromDate": fromDate
          },
          "typeName": LOGRECORD
        }],
      ["GetFeed", {
        "fromVersion": 200,
        "resultsLimit": 360,
        "search": {
          "fromDate": fromDate
        },
        "typeName": EXCEPTIONEVENT
      }
      ]
    ];

    expect(multiCallList).toEqual(result);
  });

  test("Should get feed", () => {
    const dataPromise = testFeedDataGetter.getFeedData();
    return dataPromise.then(result => expect(result).toEqual(mockResponse));
  });

  test("Should cancel get feed", () => {
    storage.realTimeFeedDataGetter = testFeedDataGetter;
    realTimefeedRunner();

    const dataPromise = testFeedDataGetter.getFeedData().catch(reason => reason);
    testFeedDataGetter.cancelRunner();
    return dataPromise.rejects;
  });

  test("Add Feed Type", () => {
    testFeedDataGetter.addFeedType(FAULTDATA);
    expect(testFeedDataGetter.feedTypes.includes(FAULTDATA)).toBe(true);
  });

  test("Remove Feed Type", () => {
    testFeedDataGetter.removeFeedType(EXCEPTIONEVENT);
    expect(testFeedDataGetter.feedTypes.includes(EXCEPTIONEVENT)).toBe(false);
  });
});

describe("Feed runners", () => {

  beforeAll(() => {

    jest.useFakeTimers();
    storage.startDate = startDateWithDelay;

    storage.dayStart = new Date(storage.startDate);
    storage.dayStart.setHours(0, 0, 0, 0);
    storage.dayEnd = new Date(storage.dayStart.getTime() + 86399999);

    mockDateKeeper(storage, 1000);
    mockAPI(apiConfig);

    spyOnFunction(helpers, "makeAPIMultiCall", () => Promise.resolve(mockResponse));
    spyOnFunction(snackBar, "showSnackBar");
    spyOnFunction(progressBar, "update");

    createDivsWithClasses(["mdc-linear-progress", "test", "mdc-linear-progress"]);
    const fakeProgress = {
      open: jest.fn(),
      close: jest.fn()
    };
    spyOnFunction(linearProgress, "MDCLinearProgress", () => fakeProgress);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {

  });

  test("initRealTimeFeedRunner", () => {
    storage.realTimeFeedDataGetter = undefined;

    initRealTimeFeedRunner();

    expect(storage.realTimeFeedDataGetter).toBeDefined();
  });

  test("initRealTimeFeedRunner", () => {

    storage.isLiveDay = true;
    storage.realTimeFeedDataGetter = undefined;

    initRealTimeFeedRunner();

    storage.realTimeFeedDataGetter.cancelRunner();
    expect(storage.realTimeFeedDataGetter).toBeDefined();
  });

  test("initHistoricalFeedRunner", () => {

    initHistoricalFeedRunner();
    expect(progressBar.update).toBeCalledWith(0.1);
  });

  test("getFeedDataCache", () => {
    const result = getFeedDataCache();
    expect(result.timeStamp).toBeDefined();
  });

  test("getFeedDataCache", () => {

    const fakeIndexedDBVal = {
      timeStamp: startDateWithDelay.getTime()
    };

    const result = getFeedDataCache(fakeIndexedDBVal);
    expect(result.timeStamp).toBeDefined();
  });


  // //Recursive function needs rewrite to test
  // test.skip("historicalFeedRunner", () => {

  //   const fakeFeedData = [{ data: [{ id: "id", dateTime: fromDate }] }, { data: [12] }];
  //   const testHistoricalFeedDataList = [{ data: [1] }, { data: [2] }];
  //   storage.HistoricalFeedDataGetter = {
  //     getFeedData: jest.fn(() => Promise.resolve(fakeFeedData))
  //   };
  //   spyOnFunction(utilsHelpers, "getDayPerentage", () => false);

  //   historicalFeedRunner(testHistoricalFeedDataList);
  // });

  test("historicalFeedDataComplete", () => {
    storage.isLiveDay = false;
    storage.HistoricalFeedDataGetter = {
      getFeedData: jest.fn(() => Promise.resolve([]))
    };

    spyOnFunction(processFeedData, "processFeedData");

    markerList[deviceID] = getTestMarker();
    const testHistoricalFeedDataList = [{ data: [{ id: "id", dateTime: fromDate }] }];
    historicalFeedDataComplete(testHistoricalFeedDataList);
  });

});
