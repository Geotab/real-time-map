import React from "react";
import {StatusToggleButtons} from "./status-toggle-buttons";
import { render, mount, shallow } from "enzyme";

let wrapper;

let state;
beforeEach(() => {
  state = {
    visibility: true 
  };
});

test("should successfully render the component and match screenshot", () => {
  const component = render(<StatusToggleButtons />);
  expect(component).toMatchSnapshot();
});

test("should successfully togglenpm te component state", () => {
  wrapper = shallow(<StatusToggleButtons />);
  const instance = wrapper.instance();
  instance.toggleVisibility();
  expect(wrapper.state.visibility).toBeFalsy();
});