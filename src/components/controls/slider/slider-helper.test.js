import {
  getPixelsPerMinute,
  calculateLeftOffset,
  minutesInDay,
  getMinuteOfDay,
  calulateCurrentTime,
  getTimeInlocalFormat,
  minuteOfDayToHour
} from "./slider-helper";

import { time2019 } from "../../../../tests/utils/mock-device";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper
} from "../../../../tests/utils/test-helpers";

import storage from "../../../dataStore";

describe("Slider Helper Tests", () => {

  beforeEach(() => {
    storage.dayStart = {
      getTime() {
        return time2019;
      }
    };
  });

  test("getMinuteOfDay", () => {
    expect(getMinuteOfDay(time2019 + 60000)).toBe(1);
  });

  test("getMinuteOfDay", () => {
    expect(getMinuteOfDay(time2019 + 361000)).toBe(6);
  });

  test("calulateCurrentTime", () => {
    expect(calulateCurrentTime(60)).toBe(time2019 + 3600000);
  });

  test("getTimeInlocalFormat", () => {
    expect(getTimeInlocalFormat(30)).toBe("12:30 AM");
  });

  test("getTimeInlocalFormat", () => {
    expect(getTimeInlocalFormat(719)).toBe("11:59 AM");
  });

  test("getTimeInlocalFormat", () => {
    expect(getTimeInlocalFormat(720)).toBe("12:00 PM");
  });

  test("getTimeInlocalFormat", () => {
    expect(getTimeInlocalFormat(1439)).toBe("11:59 PM");
  });

  test("minuteOfDayToHour", () => {
    expect(minuteOfDayToHour(180)).toBe("3:00 AM");
  });

  test("minuteOfDayToHour", () => {
    expect(minuteOfDayToHour(720)).toBe("12:00 PM");
  });

  test("minuteOfDayToHour", () => {
    expect(minuteOfDayToHour(1080)).toBe("6:00 PM");
  });

});

describe("Tool tip overflow fix tests", () => {

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("getPixelsPerMinute", () => {
    expect(getPixelsPerMinute(2880)).toBe(2);
  });

  test("getPixelsPerMinute", () => {
    expect(getPixelsPerMinute(720)).toBe(0.5);
  });

  test("calculateLeftOffset", () => {
    expect(calculateLeftOffset(60, 30, 1)).toBe(30);
  });

  test("calculateLeftOffset", () => {
    expect(calculateLeftOffset(60, 60, 2)).toBe(0);
  });

  test("calculateLeftOffset", () => {
    expect(calculateLeftOffset(60, minutesInDay - 40, 1)).toBe(-20);
  });

  test("calculateLeftOffset", () => {
    expect(calculateLeftOffset(30, minutesInDay - 31, 2)).toBe(0);
  });

  test("calculateLeftOffset", () => {
    expect(calculateLeftOffset(10, minutesInDay - 9, 1)).toBe(-1);
  });

});

// describe("fixToolTipOffset Tests", () => {

//   let toolTip;

//   beforeEach(() => {
//     toolTip = {
//       style: {}
//     };
//   });

//   test("fixToolTipOffset", () => {

//     fixToolTipOffset(toolTip, 15, 1);
//     expect(toolTip.style.left).toBe(`${offsetPixelWidth - 15}px`);

//   });

//   test("fixToolTipOffset", () => {

//     fixToolTipOffset(toolTip, 0, 1);
//     expect(toolTip.style.left).toBe(`${offsetPixelWidth}px`);
//   });

//   test("fixToolTipOffset", () => {

//     fixToolTipOffset(toolTip, 45, 1);
//     expect(toolTip.style.left).toBe("0px");
//   });


//   test("fixToolTipOffset", () => {

//     fixToolTipOffset(toolTip, 1410, 1);
//     expect(toolTip.style.left).toBe("-7px");
//   });


//   test("fixToolTipOffset", () => {

//     fixToolTipOffset(toolTip, 1430, 1);
//     expect(toolTip.style.left).toBe("-27px");
//   });
// });