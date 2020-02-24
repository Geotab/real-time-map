import {
  initBeforeLogin,
  initAfterLogin,
  loginToSession,
  handleFocus,
  handleBlur
} from "./app-helper";

import {
  geotabStandAlone
} from "./utils/stand-alone/geotab";

let isLogged = false;

if (typeof geotab === "undefined") {
  window.geotab = geotabStandAlone;
}

geotab.addin.realTimeMap = function realTimeMapAddIn() {

  return {
    initialize(api, state, callback) {

      initBeforeLogin(isLogged);

      loginToSession(api).then(() => {
        isLogged = true;
        initAfterLogin(isLogged);
        callback();

      });
    },

    focus() {
      handleFocus();
    },

    blur() {
      handleBlur();
    }
  };
};