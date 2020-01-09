import React, { Component } from "react";
import { diagnosticSearch } from "./status-search";

export const StatusListComponent = props => {
  const mapPropsToComponent = props.setStatusDisplay;
  const statusList =
    props.statusDisplayList.length > 0
      ? props.statusDisplayList.map(prop => (
          <li key={prop.id} className="mdc-list-item">
            <span
              className={`RTM-iconSquare mdc-list-item__graphic material-icons filterIcon ${
                prop.visible ? "showConfig" : "hideConfig"
              }`}
              title="Hide/Show"
              onClick={() =>
                diagnosticSearch.toggleStatusVisibility(
                  prop.id,
                  mapPropsToComponent
                )
              }
            ></span>
            <span className="mdc-list-item__graphic material-icons status"></span>
            <span
              id={"RTMnode-" + prop.id}
              className="RTM-ConfigListItem mdc-list-item__text"
            >
              {prop.name}
            </span>
            <span
              className="mdc-list-item__meta material-icons"
              onClick={() =>
                diagnosticSearch.deleteItemFromStatusList(
                  prop.id,
                  mapPropsToComponent
                )
              }
            ></span>
          </li>
        ))
      : [];
  return statusList;
};
