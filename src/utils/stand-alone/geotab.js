import GeotabApi from "mg-api-js";

export const geotabStandAlone = {

  addin: {

    set realTimeMap(RTM) {

      document.body.style.height = "100vh";

      const api = GeotabApi(authenticateCallback =>
        authenticateCallback(
          'server',
          'database',
          'userName',
          'password',
          err => console.error(err)
        )
      );

      console.warn('21', api);


      // const { initialize, focus, blur } = RTM();

      // const state = {};
      // const callback = () => {};

      // initialize(api, state, callback);

    }
  },
};