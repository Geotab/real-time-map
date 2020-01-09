import React, { Component } from "react";
import { LiveButtonComponent } from "../controls/live-button-model/liveButton-component";
import { PlayPauseButtonComponent } from "./play-pause/play-pause-component";
import { SpeedControlComponent } from "./speed-control/speed-control-component";
import { sliderModel } from "./slider/slider-model";
import { dateTimeModel } from "../controls/date-time-model";
import { liveButtonModel } from "../controls/live-button-model";
import { pausePlayModel } from "./play-pause/play-pause-model";
import { playBackSpeedModel } from "./speed-control/playback-speed";

export class ControlsView extends React.Component {
  componentDidMount() {
    playBackSpeedModel.initPlayBackSpeed();
    pausePlayModel.initPausePlay();
    sliderModel.initSlider();
    dateTimeModel.initDateTimeInput();
    liveButtonModel.initLiveButton();
  }

  render() {
    return (
      //Control bar at the bottom of the map
      <React.Fragment>
        <div id="RTM-ControlBarContainer">
          <div id="Slider-Container">
            <div id="RTM-TimeSlider" className="pmd-range-slider"></div>
          </div>
          <div id="RTM-ControlsContainer">
            <div id="timeControls">
              <PlayPauseButtonComponent />
              <SpeedControlComponent />
            </div>

            <div className="inputControls ">
              <label> Date: </label>
              <input
                className="timeInputBox mdc-button"
                type="date"
                id="dateInputBox"
                step="1"
              ></input>
            </div>

            <div className="inputControls ">
              <label> Start Time: </label>
              <input
                className="timeInputBox mdc-button"
                type="time"
                id="timeRangeStart"
                step="1"
              ></input>
            </div>

            <div className="inputControls ">
              <label> Current Time: </label>
              <input
                className="timeInputBox mdc-button"
                type="time"
                id="currentTimeInput"
                step="1"
              ></input>
            </div>

            {/* //Jump to live time. */}
            <LiveButtonComponent />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
