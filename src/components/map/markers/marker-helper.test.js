import { calculateDateTimeIndex, createMapMarker } from "./marker-helper";

describe("Device helper Tests", () => {

  test("calculateDateTimeIndex", () => {

    const result = calculateDateTimeIndex(1, [2, 3]);
    expect(result).toEqual([0, 2]);
  });

  test("calculateDateTimeIndex", () => {

    const result = calculateDateTimeIndex(4, [2, 3]);
    expect(result).toEqual([1, 3]);
  });

  test("createMapMarker", () => {

    const marker = createMapMarker([1, 2]);
    expect(marker).toBeDefined();
  });

});