import React from "react";
import {ExceptionToggleButtons} from "./exception-toggle-buttons";
import { render, shallow } from "enzyme";

let wrapper;

let state;
beforeEach(() => {
  state = {
    visibility: true 
  };
});

test("should successfully render the component and match screenshot", () => {
  const component = render(<ExceptionToggleButtons />);
  expect(component).toMatchSnapshot();
});

test("should successfully togglenpm te component state", () => {
  wrapper = shallow(<ExceptionToggleButtons />);
  const instance = wrapper.instance();
  instance.toggleVisibility();
  expect(wrapper.state.visibility).toBeFalsy();
});