import React from "react";
import {
  VehicleListComponent
} from "./vehicle-list-component";
import {
  render,
  mount,
  shallow
} from "enzyme";

let props;
beforeEach(() => {
  props = {
    vehicleDisplayList: [{
        id: "1",
        name: "test device",
        color: {
          r: 1,
          g: 2,
          b: 3,
          a: 4
        }
    }]
  };
});


test("should successfully render the component and match screenshot", () => {
      const component = shallow( < VehicleListComponent {
          ...props
        }
        />);
        expect(component).toMatchSnapshot();
      });