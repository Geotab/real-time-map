import React, { Component } from "react";
import { exceptionSearch } from "./exception-search";

export class ExceptionFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    exceptionSearch.handleItemSelected(e, this.props.setExceptionsDisplay);
  }
  render() {
    return (
      <>
        <input
          id="RTM-exception-search-bar"
          type="search"
          placeholder="Search..."
          list="RTM-exceptions-list"
          className="RTM-SearchBar Exceptions"
          onChange={this.changeHandler}
          autoComplete="off"
        ></input>
        <datalist id="RTM-exceptions-list">
          <Dropdown options={this.props.exceptions} />
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
