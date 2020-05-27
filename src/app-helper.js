import "../styles/imports/index.css";
import "../styles/imports/material.scss";
import "../styles/components/config-panel.scss";
import "../styles/components/control-bar.scss";
import "../styles/components/map.scss";
import "normalize.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet/dist/leaflet.css";
import { initDateKeeper } from "./services/date-keeper";
import { initHistoricalFeedRunner, initRealTimeFeedRunner } from "./services/data-feed/data-feed-getter";
import layerModel from "./components/map/layers";
import { mapModel } from "../src/components/map/map-model";
import storage from "./dataStore";
import { initView } from "./index";
import {
   apiConfig,
   userInfo
} from "./dataStore/api-config";
import {
   resetAnimationOnFocus,
   resetTransitionAnimation
}
   from "./utils/helper";

export function initBeforeLogin() {
   initDateKeeper();
}

export function loginToSession(api, state) {
   apiConfig.api = api;
   apiConfig.state = state;
   return new Promise(resolve => {
      apiConfig.api.getSession((session, server) => {
         userInfo.setUserInfo(session.userName, session.database, session.sessionId, server);
         resolve();
      });
   });
};

export function initAfterLogin() {
   storage.dateKeeper$.resume();
   initView();
   layerModel.initLayers();
   mapModel.locateUserAndSetView();
   resetAnimationOnFocus();

   initRealTimeFeedRunner();
   initHistoricalFeedRunner();
}

export function handleBlur() {
   storage.dateKeeper$.pause();
   console.log("Blurred!");
}

export function handleFocus(api, state) {
   apiConfig.api = api;
   apiConfig.state = state;
   storage.dateKeeper$.resume();
   resetTransitionAnimation();
   console.log("Focused!");
}
