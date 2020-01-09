import React, { Component } from "react";
import configuration from "../index";
import { StatusFormComponent } from "./status-form-component";
import { StatusListComponent } from "./status-list-component";
import { StatusToggleButtons } from "./status-toggle-buttons";

export const StatusTab = props => (
  <div>
    <button
      id="RTM-StatusTitle"
      className="RTM-Tab RTM-TabNotSelected"
      onClick={() => configuration.selectTab("RTM-StatusTitle")}
    >
      Status
    </button>
    <div id="status-tab" className="RTM-config-info">
      <StatusFormComponent
        statuses={props.statuses}
        setStatusDisplay={props.onClick}
      />
      <div className="config-Header">
        <p>Selected Status:</p>
        <div className="toggleButtonDiv" id="ToggleStatusButtons">
          <StatusToggleButtons setStatusDisplay={props.onClick} />
        </div>
      </div>

      <div id="RTM-status-view">
        <div className="config-list">
          <div>
            <ul className="mdc-list" id="StatusList">
              <StatusListComponent
                statusDisplayList={props.statusDisplayList}
                setStatusDisplay={props.onClick}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);
