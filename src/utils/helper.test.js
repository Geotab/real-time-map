import {
  insertIntoOrderedArray,
  arrayBinaryIndexSearch,
  checkIfLive,
  calculateAnimatedAngleDelta,
  resetAnimationOnFocus,
  getExceptionColor,
  getDayPerentage
} from "./helper";
import storage from "../dataStore";

describe("checkIfLive testing", () => {
  const testRuleID = "testRuleID";
  beforeAll(() => {
    storage.delay = 0;
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("resetAnimationOnFocus", () => {
    resetAnimationOnFocus();
  });

  test("getExceptionColor", () => {
    storage.selectedExceptions = {
      testRuleID: {
        "color": { "a": 255, "b": 0, "g": 0, "r": 255 }
      }
    };
    const exceptionColor = getExceptionColor(testRuleID);
    expect(exceptionColor).toBe("#ff0000");
  });

  test("getDayPerentage", () => {
    storage.dayStart = new Date(6000);
    const dayPercentage = getDayPerentage(5000);
    expect(dayPercentage).toBe(false);
  });

  describe("arrayBinaryIndexSearch testing", () => {

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 0)).toEqual(0);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 0)).toEqual(0);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 1)).toEqual(0);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 1)).toEqual(0);
    });

    test("Should find right index", () => {
      const testArray = [2, 3, 4, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 1)).toEqual(0);
    });

    test("Should find right index", () => {
      const testArray = [2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 1)).toEqual(0);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 2)).toEqual(1);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 2)).toEqual(1);
    });

    test("Should find right index", () => {
      const testArray = [1, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 2)).toEqual(1);
    });

    test("Should find right index", () => {
      const testArray = [1, 3, 4, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 2)).toEqual(1);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 4)).toEqual(3);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 4)).toEqual(3);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 4)).toEqual(3);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 4)).toEqual(3);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 8)).toEqual(7);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 9];
      expect(arrayBinaryIndexSearch(testArray, 8)).toEqual(7);
    });

    test("Should find right index", () => {
      const testArray = [2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 8)).toEqual(6);
      testArray.splice(6, 0, 8);
      expect(testArray).toEqual([2, 3, 4, 5, 6, 7, 8, 8, 9]);
    });

    test("Should find right index", () => {
      const testArray = [2, 3, 4, 5, 6, 7, 9];
      expect(arrayBinaryIndexSearch(testArray, 8)).toEqual(6);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 9)).toEqual(8);
    });

    test("Should find right index", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 9)).toEqual(8);
    });

    test("Should find right index", () => {
      const testArray = [2, 3, 4, 5, 6, 7, 8, 9];
      expect(arrayBinaryIndexSearch(testArray, 9)).toEqual(7);
    });

    test("Should find right index", () => {
      const testArray = [2, 3, 4, 5, 6, 7, 8];
      expect(arrayBinaryIndexSearch(testArray, 9)).toEqual(7);
    });

  });

  describe("insertIntoOrderedArray testing", () => {

    test("Should insert into start of array", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      insertIntoOrderedArray(testArray, 0);
      expect(testArray).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test("Should insert into end of array", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      insertIntoOrderedArray(testArray, 10);
      expect(testArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    test("Should insert into right index of array", () => {
      const testArray = [1, 2, 4, 5, 6, 7, 8, 9];
      insertIntoOrderedArray(testArray, 3);
      expect(testArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });


    test("Should insert into right index of array", () => {
      const testArray = [1, 3, 4, 5, 6, 7, 8];
      insertIntoOrderedArray(testArray, 2);
      expect(testArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    test("Should insert into right index of array", () => {
      const testArray = [1, 3, 4, 5, 6, 7, 8, 9];
      insertIntoOrderedArray(testArray, 2);
      expect(testArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test("Should insert into right index of array", () => {
      const testArray = [1, 2, 3, 4, 6, 7, 9];
      insertIntoOrderedArray(testArray, 8);
      expect(testArray).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
    });

    test("Should insert into right index of array", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 9];
      insertIntoOrderedArray(testArray, 8);
      expect(testArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test("Should not insert duplicate.", () => {
      const testArray = [1, 2, 3, 4, 5, 6, 7, 9];
      insertIntoOrderedArray(testArray, 3);
      expect(testArray).toEqual([1, 2, 3, 4, 5, 6, 7, 9]);
    });
  });

  describe("checkIfLive testing", () => {
    test("checkIfLive", () => {
      const liveDate = new Date();
      liveDate.setMilliseconds(0);
      expect(checkIfLive(liveDate)).toBeTruthy();
    });

    test("checkIfLive", () => {
      const liveDate = new Date(Date.now() - 2000);
      liveDate.setMilliseconds(0);
      expect(checkIfLive(liveDate)).toBeFalsy();
    });

    test("checkIfLive", () => {
      const liveDate = new Date(Date.now() + 1200);
      liveDate.setMilliseconds(0);
      expect(checkIfLive(liveDate)).toBeTruthy();
    });
  });

  describe("calculateAnimatedAngleDelta testing", () => {

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(66, 66)).toBe(0);
    });

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(360, 0)).toBe(0);
    });

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(180, -180)).toBe(0);
    });

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(660, 300)).toBe(0);
    });

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(360, 720)).toBe(0);
    });

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(-360, 720)).toBe(0);
    });

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(-90, 270)).toBe(0);
    });

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(36, 66)).toBe(30);
    });

    test("calculateAnimatedAngleDelta", () => {
      expect(calculateAnimatedAngleDelta(66, 36)).toBe(-30);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(190, 0)).toBe(170);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(60, 300)).toBe(-120);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(90, 270)).toBe(180);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(270, 90)).toBe(-180);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(90, 271)).toBe(-179);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(90, 269)).toBe(179);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(450, 269)).toBe(179);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(450, 271)).toBe(-179);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(450, 631)).toBe(-179);
    });

    test("calculateAnimatedAngle", () => {
      expect(calculateAnimatedAngleDelta(180, 540)).toBe(0);
    });

  });

});