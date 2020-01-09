import {
  spyOnFunction,
  spyOnAccessorFunction
} from "./utils/test-helpers";

describe("Template", () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should run", () => {
    expect(1).toBe(1);
  });

});
