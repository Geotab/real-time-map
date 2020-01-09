import React, { Component } from "react";
import { liveButtonModel } from "./live-button-model";

export const LiveButtonComponent = () => (
  <button
    className="mdc-button"
    id="RTM-LiveButton"
    onClick={() => liveButtonModel.goToLive()}
  >
    <span id="RTM-LiveDot"></span>
    LIVE
    </button>

);