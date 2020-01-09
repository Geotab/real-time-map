import React, { Component } from "react";
import configuration from "../index";
import { ExceptionFormComponent } from "./exception-form-component";
import exceptionSearch from "./exception-search";
import { ExceptionListComponent } from "./exception-list-component";
import { ExceptionToggleButtons } from "./exception-toggle-buttons";

export const ExceptionsTab = props => (
  <div>
    <button
      id="RTM-ExceptionTitle"
      className="RTM-Tab RTM-TabSelected"
      onClick={() => configuration.selectTab("RTM-ExceptionTitle")}
    >
      Exceptions
    </button>
    <div id="exception-tab" className="RTM-config-info">
      <ExceptionFormComponent
        exceptions={props.exceptions}
        setExceptionsDisplay={props.onClick}
      />
      <div className="config-Header">
        <p>Selected Exceptions:</p>
        <div className="toggleButtonDiv" id="ToggleExceptionButtons">
          <ExceptionToggleButtons setExceptionsDisplay={props.onClick} />
        </div>
      </div>

      <div id="RTM-exceptions-view">
        <div className="config-list">
          <div>
            <ul className="mdc-list" id="ExceptionsList">
              <ExceptionListComponent
                exceptionDisplayList={props.exceptionDisplayList}
                setExceptionsDisplay={props.onClick}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);
