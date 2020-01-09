import { sliderModel } from "./slider-model";
import { time2019 } from "../../../../tests/utils/mock-device";

import * as helper from "../../../utils/helper";

import * as sliderHelper from "./slider-helper";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper
} from "../../../../tests/utils/test-helpers";

import noUiSlider from "propellerkit-range-slider/node_modules/nouislider/distribute/nouislider";

import storage from "../../../dataStore";

describe("sliderModel Tests", () => {

  let testSlider;

  const mockRTMSlider = {
    noUiSlider: {
      updateOptions: jest.fn(),
      on: jest.fn()
    }
  };

  beforeAll(() => {

    storage._currentTime = time2019 + 60000;
    storage._timeRangeStart = time2019 + 60000;

    storage.dateKeeper$ = {
      subscribe: jest.fn(),
      setNewTime: jest.fn(),
      update: jest.fn(),
    };

    storage.dayStart = {
      getTime() {
        return time2019;
      }
    };

    document.body.innerHTML =
      "<div id='RTM-TimeSlider'>" +
      '  <span class="noUi-handle-lower" />' +
      '  <span class="noUi-handle-lower" />' +
      '  <span class="noUi-handle-upper" />' +
      '  <span class="noUi-handle-upper" />' +
      "</div>";

    spyOnFunction(noUiSlider, "create", RTMSlider =>
      RTMSlider.noUiSlider = mockRTMSlider.noUiSlider
    );

  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    testSlider = { ...sliderModel };
    testSlider.initSlider();
    spyOnAccessorFunction(sliderModel, "RTMSlider", "get", () => mockRTMSlider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initSlider", () => {
    expect(noUiSlider.create).toHaveBeenCalled();
  });

  test("updateSlider", () => {

    spyOnFunction(testSlider, "handleOverFlowFix");
    spyOnFunction(testSlider, "toolTipOverFlowFix");

    testSlider.updateSlider(time2019 + 61000);

    expect(mockRTMSlider.noUiSlider.updateOptions).toHaveBeenCalled();
    expect(testSlider.handleOverFlowFix).toHaveBeenCalled();
    expect(testSlider.toolTipOverFlowFix).toHaveBeenCalled();

  });

  test("updateSlider", () => {

    spyOnFunction(testSlider, "handleOverFlowFix");
    spyOnFunction(testSlider, "toolTipOverFlowFix");

    testSlider.userCurrentlySlidng = true;
    testSlider.updateSlider(time2019);

    expect(mockRTMSlider.noUiSlider.updateOptions).not.toHaveBeenCalled();
    expect(testSlider.handleOverFlowFix).not.toHaveBeenCalled();
    expect(testSlider.toolTipOverFlowFix).not.toHaveBeenCalled();
  });

  test("startSliding", () => {

    spyOnFunction(testSlider, "toolTipOverFlowFix");

    testSlider.currentHandle = 0;
    testSlider.userCurrentlySlidng = false;

    testSlider.startSliding([], 1);

    expect(testSlider.currentHandle).toBe(1);
    expect(testSlider.userCurrentlySlidng).toBe(true);
    expect(testSlider.toolTipOverFlowFix).toHaveBeenCalled();

  });

  test("userSliding", () => {

    spyOnFunction(testSlider, "handleOverFlowFix");
    spyOnFunction(testSlider, "toolTipOverFlowFix");

    testSlider.currentHandle = 1;
    testSlider.userCurrentlySlidng = false;

    testSlider.userSliding([], 1);

    expect(testSlider.userCurrentlySlidng).toBe(true);
    expect(testSlider.handleOverFlowFix).not.toHaveBeenCalled();
    expect(testSlider.toolTipOverFlowFix).toHaveBeenCalled();

  });

  test("userSliding", () => {

    spyOnFunction(testSlider, "handleOverFlowFix");
    spyOnFunction(testSlider, "toolTipOverFlowFix");

    testSlider.currentHandle = 2;
    testSlider.userCurrentlySlidng = false;

    testSlider.userSliding([], 1);

    expect(testSlider.userCurrentlySlidng).toBe(true);
    expect(testSlider.handleOverFlowFix).toHaveBeenCalled();
    expect(testSlider.toolTipOverFlowFix).toHaveBeenCalled();

  });

  test("sliderValueSet", () => {

    spyOnFunction(testSlider, "handleOverFlowFix");

    testSlider.currentHandle = 1;
    testSlider.userCurrentlySlidng = true;

    testSlider.sliderValueSet([0, 1], 1);

    expect(testSlider.currentHandle).toBe(2);
    expect(testSlider.userCurrentlySlidng).toBe(false);

    expect(testSlider.handleOverFlowFix).toHaveBeenCalled();
    expect(storage.dateKeeper$.setNewTime).toHaveBeenCalled();

  });

  test("sliderValueSet", () => {

    spyOnFunction(testSlider, "handleOverFlowFix");
    spyOnFunction(helper, "checkIfLive", () => 700);

    testSlider.currentHandle = 1;
    testSlider.userCurrentlySlidng = true;

    testSlider.sliderValueSet([0, 1], 1);

    expect(testSlider.currentHandle).toBe(2);
    expect(testSlider.userCurrentlySlidng).toBe(false);

    expect(testSlider.handleOverFlowFix).toHaveBeenCalled();
    expect(storage.dateKeeper$.setNewTime).toHaveBeenCalled();
    expect(helper.checkIfLive).toHaveBeenCalled();

  });

  test("sliderValueSet", () => {

    spyOnFunction(testSlider, "handleOverFlowFix");
    spyOnFunction(helper, "checkIfLive", () => 700);

    testSlider.currentHandle = 0;
    testSlider.userCurrentlySlidng = true;

    testSlider.sliderValueSet([0, 1], 1);

    expect(testSlider.currentHandle).toBe(2);
    expect(testSlider.userCurrentlySlidng).toBe(false);

    expect(testSlider.handleOverFlowFix).toHaveBeenCalled();
    expect(storage.dateKeeper$.update).toHaveBeenCalled();
    expect(helper.checkIfLive).toHaveBeenCalled();

  });

  test("toolTipOverFlowFix", () => {

    document.body.innerHTML += '<span class="noUi-tooltip" /> <span class="noUi-tooltip" />';
    spyOnFunction(sliderHelper, "calculateLeftOffset", () => 10);

    testSlider.toolTipOverFlowFix([0, 1], 1);

    expect(sliderHelper.calculateLeftOffset).toHaveBeenCalledWith(36, 1, 0);

  });

  test("toolTipOverFlowFix", () => {

    document.body.innerHTML += '<span class="noUi-tooltip" /> <span class="noUi-tooltip" />';
    spyOnFunction(sliderHelper, "calculateLeftOffset", () => 10);

    testSlider.toolTipOverFlowFix([0, 1], 0);

    expect(sliderHelper.calculateLeftOffset).toHaveBeenCalledWith(36, 0, 0);

  });

  test("handleOverFlowFix", () => {

    document.body.innerHTML += '<span class="noUi-handle" /> <span class="noUi-handle" />';
    spyOnFunction(sliderHelper, "calculateLeftOffset", () => 10);

    testSlider.handleOverFlowFix([0, 1]);

    expect(sliderHelper.calculateLeftOffset).toHaveBeenCalledWith(9, 0, 0);

  });

  test("handleOverFlowFix", () => {

    document.body.innerHTML += '<span class="noUi-handle" /> <span class="noUi-handle" />';
    spyOnFunction(sliderHelper, "calculateLeftOffset", () => 10);

    testSlider.handleOverFlowFix([1, 1]);

    expect(sliderHelper.calculateLeftOffset).toHaveBeenCalledWith(9, 1, 0);

  });

});