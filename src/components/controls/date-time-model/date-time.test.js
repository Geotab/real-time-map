import {
  dateTimeModel,
  onChange
} from "./date-time";

import storage from "../../../dataStore";
import * as helper from "../../../utils/helper";
import * as snackbar from "../../snackbar/snackbar";
import {
  spyOnFunction,
  mockDateKeeper
} from "../../../../tests/utils/test-helpers";

import { time2019, time2020 } from "../../../../tests/utils/mock-device";

describe("dateTimeModel tests", () => {

  beforeAll(() => {

    jest.useFakeTimers();

    storage.currentTime = time2019;
    mockDateKeeper(storage, 1000);
    // createDivsWithID[]
    document.body.innerHTML =
      "<div id='RTM-TimeSlider'>" +
      '  <div id="dateInputBox">' +
      '  <div id="timeRangeStart">' +
      '  <div id="currentTimeInput">' +
      "</div>";
    spyOnFunction(snackbar, "showSnackBar");
    spyOnFunction(helper, "getLiveTime", () => time2020);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test initDateTimeInput", () => {
    onChange();
    dateTimeModel.initDateTimeInput();

    expect(snackbar.showSnackBar).toHaveBeenCalled();
    expect(dateTimeModel.dateInput.value).toBe("5/15/2019");
  });

  test("Test updateCurrentSecond", () => {

    dateTimeModel.updateCurrentSecond(time2019);

    expect(dateTimeModel.currentTimeInput.value).toBe("12:00:00 AM");
  });

  test("Test updateCurrentSecond", () => {

    dateTimeModel.updateCurrentSecond(time2019 + 6000);

    expect(dateTimeModel.currentTimeInput.value).toBe("12:00:06 AM");

    dateTimeModel.updateCurrentSecond(time2019);
  });

  test("Test onDateEntered", () => {

    spyOnFunction(dateTimeModel, "applyAndUpdate");

    const fakeEvent = {
      preventDefault: jest.fn(),
      keyCode: 13
    };

    dateTimeModel.onDateEntered(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(dateTimeModel.applyAndUpdate).toHaveBeenCalledWith(time2019);
  });

  test("Test onDateEntered", () => {

    spyOnFunction(dateTimeModel, "applyAndUpdate");

    const fakeEvent = {
      preventDefault: jest.fn(),
      keyCode: 14
    };

    dateTimeModel.onDateEntered(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(dateTimeModel.applyAndUpdate).not.toHaveBeenCalled();
  });

  test("Test onStartTimeEntered", () => {

    spyOnFunction(dateTimeModel, "applyAndUpdate");

    const fakeEvent = {
      preventDefault: jest.fn(),
      keyCode: 13
    };

    dateTimeModel.onStartTimeEntered(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(dateTimeModel.applyAndUpdate).toHaveBeenCalledWith(time2019);

  });

  test("Test onStartTimeEntered", () => {

    spyOnFunction(dateTimeModel, "applyAndUpdate");

    const fakeEvent = {
      preventDefault: jest.fn(),
      keyCode: 14
    };

    dateTimeModel.onStartTimeEntered(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(dateTimeModel.applyAndUpdate).not.toHaveBeenCalled();

  });


  test("Test onCurrentTimeEntered", () => {

    spyOnFunction(dateTimeModel, "applyAndUpdate");

    const fakeEvent = {
      preventDefault: jest.fn(),
      keyCode: 13
    };

    dateTimeModel.onCurrentTimeEntered(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(dateTimeModel.applyAndUpdate).toHaveBeenCalledWith(time2019);

  });


  test("Test onCurrentTimeEntered", () => {

    spyOnFunction(dateTimeModel, "applyAndUpdate");

    const fakeEvent = {
      preventDefault: jest.fn(),
      keyCode: 12
    };

    dateTimeModel.onCurrentTimeEntered(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(dateTimeModel.applyAndUpdate).not.toHaveBeenCalled();

  });


  test("Test applyAndUpdate", () => {

    spyOnFunction(dateTimeModel, "updateCurrentSecond");
    dateTimeModel.applyAndUpdate.mockRestore();

    dateTimeModel.applyAndUpdate(time2019);

    expect(dateTimeModel.updateCurrentSecond).toHaveBeenCalledWith(time2019);

  });

});