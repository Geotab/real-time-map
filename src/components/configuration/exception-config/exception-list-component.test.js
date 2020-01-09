import React from "react";
import {
  ExceptionListComponent
} from "./exception-list-component";
import {
  render,
  mount,
  shallow
} from "enzyme";

let props;
beforeEach(() => {
  props = {
    exceptionDisplayList: [{
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
      const component = shallow( < ExceptionListComponent {
          ...props
        }
        />);
        expect(component).toMatchSnapshot();
      });