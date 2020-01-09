import React from "react";
import { ControlsView } from "./controls-component";
import { render, mount, shallow } from "enzyme";
import { spyOnFunction } from "../../../tests/utils/test-helpers";
import { sliderModel } from "./slider/slider-model";
import { dateTimeModel } from "../controls/date-time-model";
import { liveButtonModel } from "../controls/live-button-model";
import { pausePlayModel } from "./play-pause/play-pause-model";
import { playBackSpeedModel } from "./speed-control/playback-speed";

test("should successfully render the component and match screenshot", () => {
  spyOnFunction(liveButtonModel, "initLiveButton");
  spyOnFunction(pausePlayModel, "initPausePlay");
  spyOnFunction(sliderModel, "initSlider");
  spyOnFunction(dateTimeModel, "initDateTimeInput");
  spyOnFunction(playBackSpeedModel, "initPlayBackSpeed");
  const component = shallow(<ControlsView />);
  expect(component).toMatchSnapshot();
});
