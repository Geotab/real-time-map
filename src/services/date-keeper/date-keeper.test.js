import {
  dateKeeper,
  initDateKeeper
} from "./date-keeper";
import storage from "../../dataStore";
import { spyOnFunction } from "../../../tests/utils/test-helpers";
import * as dateKeeperHelpers from "./date-keeper-helpers";
import * as helper from "../../utils/helper";

describe("DateKeeper Tests", () => {

  let testDateKeeper;
  const period = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
    spyOnFunction(dateKeeperHelpers, "differentDateSet");
    spyOnFunction(dateKeeperHelpers, "updatePeriodChangeFunctions");
    spyOnFunction(helper, "checkIfLive", () => 1200);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    testDateKeeper = { ...dateKeeper };
    testDateKeeper.init(6000);
  });

  test("Construction", () => {
    storage.dateKeeper$ = undefined;
    initDateKeeper();
    expect(storage.dateKeeper$).toBeDefined();
  });

  test("getPeriod", () => {
    expect(testDateKeeper.getPeriod()).toBe(period);
  });

  test("resume", () => {
    spyOnFunction(testDateKeeper, "emitNext");
    testDateKeeper.resume();

    expect(testDateKeeper.paused).toBe(false);
    expect(testDateKeeper.emitNext).toHaveBeenCalled();
  });

  test("setPeriod", () => {

    const newPeriod = 3000;
    spyOnFunction(testDateKeeper, "emitNext");

    testDateKeeper.setPeriod(newPeriod);

    expect(testDateKeeper.paused).toBe(false);
    expect(testDateKeeper.period).toBe(newPeriod);
    expect(testDateKeeper.emitNext).toHaveBeenCalled();
  });

  test("setNewTime", () => {

    const newTime = 12000;
    spyOnFunction(testDateKeeper, "emitNext");

    testDateKeeper.setNewTime(newTime);

    expect(testDateKeeper.paused).toBe(false);
    expect(testDateKeeper.emitNext).toHaveBeenCalled();
  });


  test("setNewTime", () => {

    const newTime = 12000;

    spyOnFunction(helper, "checkIfLive", () => 0);
    spyOnFunction(storage.dayStart, "getTime", () => newTime - 1000);
    spyOnFunction(storage.dayEnd, "getTime", () => newTime + 1000);
    spyOnFunction(testDateKeeper, "emitNext");

    testDateKeeper.setNewTime(newTime);

    expect(testDateKeeper.paused).toBe(false);
    expect(testDateKeeper.emitNext).toHaveBeenCalled();
  });

  test("update", () => {

    spyOnFunction(helper, "checkIfLive", () => 1200);
    spyOnFunction(testDateKeeper, "setNewTime");

    testDateKeeper.update();
    expect(testDateKeeper.setNewTime).toHaveBeenCalled();
  });

  test("update", () => {

    spyOnFunction(helper, "checkIfLive", () => 0);
    spyOnFunction(testDateKeeper, "setNewTime");

    const fakeTime = 1000;

    storage.currentTime = fakeTime;

    testDateKeeper.update();

    expect(testDateKeeper.setNewTime).toHaveBeenCalledWith(fakeTime + 1000);
  });

});

