import React from "react";
import {MapView} from "./map-view";
import { render, mount, shallow } from "enzyme";
import {mapModel} from "./map-model";
import { progressBar } from "../progress-bar";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper,
  createDivsWithID,
  createDivsWithClasses
} from "../../../tests/utils/test-helpers";

let wrapper;

test("should successfully render the map component", () => {
  const component = render(<MapView />);
  expect(component).toMatchSnapshot();
});

test("should successfully call the component did mount when rendering view", () => {
  spyOnFunction(progressBar, "update");
  mapModel.handleMapCreated = jest.fn();
  wrapper = shallow(<MapView />);
  expect(mapModel.handleMapCreated).toHaveBeenCalledWith("RTM-Map");
});