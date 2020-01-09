import { initExceptionPath } from "./exception-path";
import { initHistoricPath } from "./historic-path";
import { initLivePath } from "./live-path";
import storage from "../../../dataStore";

export function initPaths(deviceMarker) {
  if (!storage.historicalComplete) {
    return;
  }

  if (!deviceMarker.historicPath) {
    deviceMarker.historicPath = initHistoricPath(deviceMarker);
  }

  if (!deviceMarker.livePath) {
    deviceMarker.livePath = initLivePath(deviceMarker);
  }

  if (storage.exceptionsEnabled && !deviceMarker.exceptionPath) {
    deviceMarker.exceptionPath = initExceptionPath(deviceMarker);
  }
};