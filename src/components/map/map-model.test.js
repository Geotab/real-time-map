import {userAPI} from "../../services/api/user-api";
import { userInfo } from "../../dataStore/api-config";
import {mapModel} from "./map-model";
import storage from "../../dataStore";

import {
  createDivsWithID,
  mockMap
} from "../../../tests/utils/test-helpers";

describe("api helpers tests", () => {
  const testDivID = "RTM-Map";

  beforeAll(() => {
    createDivsWithID([testDivID, "two"]);
  });

  test("Should handleMapCreated", () => {
    storage.map = undefined;
    mapModel.handleMapCreated(testDivID);
    expect(storage.map).toBeDefined();
  });

  test("Should addMapBoxTileLayer", () => {
    mockMap(storage, 12, true);
    mapModel.addMapBoxTileLayer(storage.map);
  });

  test("Should mapSetView", () => {
    mapModel.mapSetView([]);
  });

  test("Should mapSetView", () => {
    mapModel.mapSetView([1, 2]);
  });

  test("map company address promise executes all functions", (done) => {

    mapModel.mapSetView = jest.fn();

    userAPI.getCoordinatesFromAddress = jest.fn(() => {
      return new Promise((res) => {
        res([{
          x: 5,
          y: 10
        }]);
      });
    });

    userAPI.getUserInfo = jest.fn(() => {
      return new Promise((res) => {
        res([{ companyAddress: "some address" }]);

      });
    });
    userInfo.userName = "someUser";

    mapModel.setMapToCompanyAddress()
      .then(() => {
        expect(userAPI.getUserInfo).toHaveBeenCalledWith("someUser");
        expect(userAPI.getCoordinatesFromAddress).toHaveBeenCalledWith("some address");
        expect(mapModel.mapSetView).toHaveBeenCalledWith({ "lat": 10, "lng": 5 });
        done();
      });
  });
}); 