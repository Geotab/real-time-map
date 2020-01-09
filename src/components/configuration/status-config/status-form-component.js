import React, { Component } from "react";
import { diagnosticSearch } from "./status-search";

export class StatusFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    diagnosticSearch.handleItemSelected(e, this.props.setStatusDisplay);
  }
  render() {
    return (
      <>
        <input
          id="RTM-status-search-bar"
          type="search"
          placeholder="Search..."
          list="RTM-status-list"
          className="RTM-SearchBar Status"
          onChange={this.changeHandler}
          autoComplete="off"
        ></input>
        <datalist id="RTM-status-list">
          <Dropdown options={this.props.statuses} />
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
