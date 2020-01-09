import { makeAPICall } from "./helpers";

export const userAPI = {

  getUserInfo: userName => {
    const parameters = {
      "typeName": "User",
      "search": {
        name: userName
      }
    };
    return makeAPICall("Get", parameters);
  },

  getCoordinatesFromAddress: address => {

    const parameters = {
      "addresses": [].concat(address)
    };

    return makeAPICall("GetCoordinates", parameters);
  }
};