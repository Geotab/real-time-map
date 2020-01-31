import React, { Component } from "react";
import {pausePlayModel} from "./play-pause-model";

export const PlayPauseButtonComponent = () => (
  <button
    className="mdc-button"
    id="RTMControlButton"
    onClick={() => pausePlayModel.togglePausePlay()}
    title= "Pause"
  >
  </button>
);