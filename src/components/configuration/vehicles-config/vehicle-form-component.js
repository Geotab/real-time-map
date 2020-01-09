import React, { Component } from "react";
import { deviceSearch } from "./vehicle-search";

export class VehicleFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    deviceSearch.handleItemSelected(e, this.props.setVehicleDisplay);
  }
  render() {
    return (
      <>
        <input
          id="RTM-vehicle-search-bar"
          type="search"
          placeholder="Search..."
          list="RTM-vehicles-list"
          className="RTM-SearchBar Vehicles"
          onChange={this.changeHandler}
          autoComplete="off"
        ></input>
        <datalist id="RTM-vehicles-list">
          <Dropdown options={this.props.devices} />
        </datalist>
      </>
    );
  }
}

export const Dropdown = props => {
  const isResultEmpty = props.options.length <= 0;
  const builtDropdownList = props.options.map(prop => (
    <option key={prop.id} id={prop.id}>
      {prop.name}
    </option>
  ));
  const optionList = isResultEmpty ? [] : builtDropdownList;
  return optionList;
};
