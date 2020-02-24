import GeotabApi from "mg-api-js";
import { initView } from "../..";
export const geotabStandAlone = {
  initialize: undefined,
  addin: {

    set realTimeMap(RTM) {

      const { initialize, focus, blur } = RTM();
      geotabStandAlone.initialize = initialize;
      document.body.style.height = "100vh";

      const callback = api => {
        initialize(api, state, callback);
      };

      const api = GeotabApi(authenticateCallback =>
        authenticateCallback(
          "server",
          "database",
          "userName",
          "password",
          err => {
            const showError = true;
            console.error(err);
            initView(false, showError);
          }
        )
      );

      console.warn("21", api);

      const state = {};
      // const callback = () => { };
      initialize(api, state, callback);

    }
  },
};

function handleFormSubmit() {
  const username = getValue("RTM-login-email");
  const password = getValue("RTM-login-password");
  const database = getValue("RTM-login-database");
  const serverName = getValue("RTM-login-server");

  const api = GeotabApi(authenticateCallback =>
    authenticateCallback(
      serverName,
      database,
      username,
      password,
      err => {
        const showError = true;
        console.error(err);
        initView(false, showError);
      }
    )
  );

  console.warn("21", api);

  const state = {};
  const callback = () => { };
  geotabStandAlone.initialize(api, state, callback);

};

function getValue(id) {
  const elem = document.getElementById(id);
  if (elem) {
    return elem.value;
  }
};