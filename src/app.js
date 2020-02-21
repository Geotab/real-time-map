import {
	initBeforeLogin,
	initAfterLogin,
	loginToSession,
	handleFocus,
	handleBlur
}
from "./app-helper";

geotab.addin.realTimeMap = function(api, state) {
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
