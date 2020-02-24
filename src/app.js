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

if (typeof geotab === "undefined") {
  window.geotab = geotabStandAlone;
}

geotab.addin.realTimeMap = function realTimeMapAddIn() {
  return {
    initialize(api, state, callback) {

      initBeforeLogin();

      loginToSession(api).then(() => {

        initAfterLogin();
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