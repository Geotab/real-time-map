import React, { Component } from "react";
import { exceptionSearch } from "./exception-search";

export const ExceptionListComponent = props => {
  const mapPropsToComponent = props.setExceptionsDisplay;
  const exceptionList =
    props.exceptionDisplayList.length > 0
      ? props.exceptionDisplayList.map(prop => (
          <li key={prop.id} className="mdc-list-item">
            <span
              className={`RTM-iconSquare mdc-list-item__graphic material-icons filterIcon ${
                prop.visible ? "showConfig" : "hideConfig"
              } `}
              title="Hide/Show"
              onClick={() =>
                exceptionSearch.toggleExceptionVisibility(
                  prop.id,
                  mapPropsToComponent
                )
              }
            ></span>
            <span
              className="RTM-iconSquare mdc-list-item__graphic material-icons exception"
              style={{
                backgroundColor: `rgba(${prop.color["r"]},${prop.color["g"]},${prop.color["b"]})`
              }}
            ></span>
            <span
              id={"RTMnode-" + prop.id}
              className="RTM-ConfigListItem mdc-list-item__text"
            >
              {prop.name}
            </span>
            <span
              className="mdc-list-item__meta material-icons"
              onClick={() =>
                exceptionSearch.deleteItemFromExceptionList(
                  prop.id,
                  mapPropsToComponent
                )
              }
            ></span>
          </li>
        ))
      : [];
  return exceptionList;
};
