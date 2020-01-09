import React, { Component } from "react";
import { deviceSearch } from "./vehicle-search";

export const VehicleListComponent = props => {
  const mapPropsToComponent = props.setVehicleDisplay;
  const vehicleList =
    props.vehicleDisplayList.length > 0
      ? props.vehicleDisplayList.map(prop => (
          <li key={prop.id} className="mdc-list-item">
            <span
              className={`RTM-iconSquare mdc-list-item__graphic material-icons filterIcon ${
                prop.visible ? "showConfig" : "hideConfig"
              }`}
              title="Hide/Show"
              onClick={() =>
                deviceSearch.toggleDeviceVisibility(
                  prop.id,
                  mapPropsToComponent
                )
              }
            ></span>
            {createDeviceListElement(
              prop.id,
              prop.name,
              prop.color,
              deviceSearch.zoomIntoDevice
            )}
            <span
              id={"RTMnode-" + prop.id}
              className="RTM-ConfigListItem mdc-list-item__text"
            >
              {prop.name}
            </span>
            <span
              className="mdc-list-item__meta material-icons"
              onClick={() =>
                deviceSearch.deleteItemFromdeviceList(
                  prop.id,
                  mapPropsToComponent
                )
              }
            ></span>
          </li>
        ))
      : [];
  return vehicleList;
};

const createDeviceListElement = (id, name, color, flyFunction) => {
  if (name.includes("Group")) {
    const { r, g, b, a } = color;
    const rgba = `rgba(${r},${g},${b},${a})`;
    return (
      <span
        className="mdc-list-item__graphic material-icons group"
        style={{ backgroundColor: rgba }}
      ></span>
    );
  } else {
    return (
      <span
        className="mdc-list-item__graphic material-icons vehicle"
        title="Fly to Car on Map"
        onClick={() => flyFunction(id)}
      ></span>
    );
  }
};
