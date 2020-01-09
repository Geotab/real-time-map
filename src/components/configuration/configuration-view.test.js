import React from "react";
import { ConfigView } from "./configuration-view";
import { render, shallow } from "enzyme";
import {
  spyOnFunction,
  createDivsWithID
} from "../../../tests/utils/test-helpers";

import * as collapse from "./utils/config-collapse";
import { diagnosticSearch } from "./status-config/status-search";
import { exceptionSearch } from "./exception-config/exception-search";
import { deviceSearch } from "./vehicles-config/vehicle-search";
import { selectTab } from "./configuration-model";

describe("ConfigView Tests", () => {

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should successfully render the config component", () => {
    const component = render(<ConfigView />);
    expect(component).toMatchSnapshot();
  });

  test("should successfully call the component did mount when rendering view", () => {
    spyOnFunction(diagnosticSearch, "init", fn => fn());
    spyOnFunction(deviceSearch, "init", fn => fn());
    spyOnFunction(exceptionSearch, "init", fn => fn());
    spyOnFunction(collapse, "initCollapse");
    spyOnFunction(deviceSearch, "loadSavedDeviceConfig", fn => fn());
    spyOnFunction(exceptionSearch, "loadSavedExceptionConfig", fn => fn());
    spyOnFunction(diagnosticSearch, "loadSavedStatusConfig", fn => fn());

    shallow(<ConfigView />);

    expect(collapse.initCollapse).toHaveBeenCalled();
    expect(deviceSearch.loadSavedDeviceConfig).toHaveBeenCalled();
    expect(exceptionSearch.loadSavedExceptionConfig).toHaveBeenCalled();
    expect(diagnosticSearch.loadSavedStatusConfig).toHaveBeenCalled();
  });
});

describe("Configuration-model Tests", () => {

  const testTabID = "testTabID";

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("selectTab", () => {
    document.body.innerHTML = `<div id='${testTabID}' class="RTM-TabSelected"></div>`;
    const result = selectTab(testTabID);
    expect(result).toBe(false);
  });

  test("selectTab", () => {

    const exceptionTitleID = "RTM-ExceptionTitle";
    document.body.innerHTML = `<div id='${exceptionTitleID}' class="RTM-Tab"></div>`;
    createDivsWithID(["exception-tab", "status-tab", "vehicle-tab"]);

    selectTab(exceptionTitleID);
  });


  test("selectTab", () => {

    const statusTitleID = "RTM-StatusTitle";
    document.body.innerHTML = `<div id='${statusTitleID}' class="RTM-Tab"></div>`;
    createDivsWithID(["exception-tab", "status-tab", "vehicle-tab"]);

    selectTab(statusTitleID);
  });

  test("selectTab", () => {

    const vehicleTitleID = "RTM-VehicleTitle";
    document.body.innerHTML = `<div id='${vehicleTitleID}' class="RTM-Tab"></div>`;
    createDivsWithID(["exception-tab", "status-tab", "vehicle-tab"]);

    selectTab(vehicleTitleID);
  });
});