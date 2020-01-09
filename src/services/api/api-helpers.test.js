import {
  getGroups,
  makeAPICall,
  makeAPIMultiCall,
  getRules,
  getAllActiveDevices,
  getDiagnosticByName,
  getRulesByName,
  getDeviceByName,
  createDeviceByNameCall,
  getGroupsByName,
  createGroupsByNameCall,
  getDevicesInGroups,
  getGroupByID,
  saveBlobStorage,
  getBlobStorage
} from "./helpers";

import { apiConfig } from "../../dataStore/api-config";
import { userAPI } from "./user-api";
describe("api helpers tests", () => {
  let callPayload;

  beforeEach(() => {
    apiConfig.api = {
      call(call, param) {
        callPayload = [call, param];
      },
      multiCall: jest.fn(),
    };
  });

  test("Should makeAPICall", () => {
    makeAPICall(1, 2);
    expect(callPayload).toEqual([1, 2]);
  });

  test("Should makeAPIMultiCall", () => {
    makeAPIMultiCall(1, 2);
    expect(callPayload).toEqual([1, 2]);
  });

  test("Should getGroups", () => {
    getGroups([]);
  });

  test("Should getRules", () => {
    getRules([]);
  });

  test("Should getAllActiveDevices", () => {
    getAllActiveDevices(100);
    expect(callPayload[0]).toEqual("Get");
    expect(callPayload[1]).toMatchObject(
      {
        "search": { "fromDate": 100, },
        "typeName": "Device",
      }
    );
  });

  test("Should getAllActiveDevices", () => {
    getAllActiveDevices([]);
  });

  test("Should getDiagnosticByName", () => {
    getDiagnosticByName([]);
  });

  test("Should getRulesByName", () => {
    getRulesByName([]);
  });

  test("Should getDeviceByName", () => {
    getDeviceByName([]);
  });

  test("Should createDeviceByNameCall", () => {
    createDeviceByNameCall([]);
  });

  test("Should getGroupsByName", () => {
    getGroupsByName([]);
  });

  test("Should createGroupsByNameCall", () => {
    createGroupsByNameCall([]);
  });

  test("Should getDevicesInGroups", () => {
    getDevicesInGroups([]);
  });

  test("Should saveBlobStorage", () => {
    saveBlobStorage([]);
  });

  test("Should getGroupByID", () => {
    getGroupByID([]);
  });

  test("Should getBlobStorage", () => {
    getBlobStorage([]);
  });

});

describe("userInfo tests", () => {

  let callPayload;

  beforeEach(() => {
    apiConfig.api = {
      call(call, param) {
        callPayload = [call, param];
      },
      multiCall: jest.fn(),
    };
  });

  test("userInfo", () => {
    userAPI.getUserInfo("test");

    expect(callPayload[0]).toEqual("Get");
    expect(callPayload[1]).toMatchObject(
      {
        "search": { "name": "test", },
        "typeName": "User",
      }
    );
  });

  test("userInfo", () => {
    userAPI.getCoordinatesFromAddress("test");

    expect(callPayload[0]).toEqual("GetCoordinates");
    expect(callPayload[1]).toMatchObject(
      {
        "addresses": ["test"]
      }
    );
  });
});